import hashlib
import json
import os
import secrets
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path
from fastapi import HTTPException

def digest(value): return hashlib.sha256(value.encode()).hexdigest()

class Store:
    def __init__(self, path):
        self.path = str(path)
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        # Tokens are needed by the provider. Keep this database private; it is not a public artifact.
        fd=os.open(self.path, os.O_CREAT|os.O_RDWR, 0o600);os.close(fd)
        os.chmod(self.path, 0o600)
        with self.db() as db:
            db.executescript('''
            CREATE TABLE IF NOT EXISTS enrollment(hash TEXT PRIMARY KEY,provider TEXT NOT NULL,expires REAL NOT NULL,used INTEGER DEFAULT 0);
            CREATE TABLE IF NOT EXISTS device(id TEXT PRIMARY KEY,key_hash TEXT NOT NULL,provider TEXT NOT NULL,token TEXT NOT NULL,token_hash TEXT NOT NULL UNIQUE,preferences TEXT NOT NULL,active INTEGER NOT NULL,expires REAL NOT NULL);
            CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY,value TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS delivery(id TEXT PRIMARY KEY,device_id TEXT NOT NULL,event_key TEXT NOT NULL,payload TEXT NOT NULL,state TEXT NOT NULL,attempts INTEGER DEFAULT 0,due REAL NOT NULL,expires REAL NOT NULL,lease REAL,claim TEXT,result TEXT,UNIQUE(device_id,event_key));
            ''')
    @contextmanager
    def db(self):
        c=sqlite3.connect(self.path,timeout=10);c.row_factory=sqlite3.Row
        try:
            c.execute('PRAGMA foreign_keys=ON');yield c;c.commit()
        except Exception:c.rollback();raise
        finally:c.close()
    def enrollment(self, provider, ttl=600):
        if provider not in ('apns','fcm'):raise ValueError('provider')
        code=secrets.token_urlsafe(32)
        with self.db() as db:db.execute('INSERT INTO enrollment(hash,provider,expires) VALUES(?,?,?)',(digest(code),provider,time.time()+ttl))
        return code
    def register(self, code, provider, token, preferences):
        now=time.time();device_id=secrets.token_urlsafe(24);key=secrets.token_urlsafe(32)
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            row=db.execute('SELECT * FROM enrollment WHERE hash=?',(digest(code),)).fetchone()
            if not row or row['used'] or row['expires']<=now or row['provider']!=provider:raise HTTPException(401,'기기 연결 코드가 만료되었거나 올바르지 않습니다.')
            if db.execute('SELECT 1 FROM device WHERE token_hash=?',(digest(token),)).fetchone():raise HTTPException(409,'이미 연결된 기기입니다. 기존 연결에서 갱신하거나 해제해 주십시오.')
            db.execute('UPDATE enrollment SET used=1 WHERE hash=?',(digest(code),))
            expires=now+86400*30
            db.execute('INSERT INTO device VALUES(?,?,?,?,?,?,1,?)',(device_id,digest(key),provider,token,digest(token),json.dumps(preferences),expires))
        return {'device_id':device_id,'management_key':key,'expires_at':expires}
    def authenticate(self, db, device_id, key):
        row=db.execute('SELECT * FROM device WHERE id=?',(device_id,)).fetchone()
        if not row or not secrets.compare_digest(row['key_hash'],digest(key)) or not row['active'] or row['expires']<=time.time():raise HTTPException(401,'기기 연결을 다시 확인해 주십시오.')
        return row
    def update(self, device_id, key, token, preferences):
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE');row=self.authenticate(db,device_id,key)
            actual=token or row['token']
            if db.execute('SELECT 1 FROM device WHERE token_hash=? AND id<>?',(digest(actual),device_id)).fetchone():raise HTTPException(409,'다른 연결에 등록된 기기 토큰입니다.')
            db.execute('UPDATE device SET token=?,token_hash=?,preferences=?,expires=? WHERE id=?',(actual,digest(actual),json.dumps(preferences),time.time()+86400*30,device_id))
            # A changed preference must not keep a previous region's queued alert alive.
            if json.loads(row['preferences'])!=preferences:
                db.execute("UPDATE delivery SET state='cancelled',result='subscription_changed' WHERE device_id=? AND state IN ('pending','processing')",(device_id,))
        return {'status':'updated'}
    def revoke(self, device_id, key):
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE');self.authenticate(db,device_id,key)
            db.execute("UPDATE delivery SET state='cancelled',result='unsubscribed' WHERE device_id=? AND state IN ('pending','processing')",(device_id,))
            db.execute('DELETE FROM device WHERE id=?',(device_id,))
        return {'status':'revoked'}
    def devices(self):
        with self.db() as db:return [dict(r) for r in db.execute('SELECT * FROM device WHERE active=1 AND expires>?',(time.time(),))]
    def get_meta(self,key):
        with self.db() as db:r=db.execute('SELECT value FROM meta WHERE key=?',(key,)).fetchone()
        return json.loads(r['value']) if r else None
    def set_meta(self,key,value):
        with self.db() as db:db.execute('INSERT INTO meta VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',(key,json.dumps(value)))
    def enqueue(self,device_id,event_key,payload,expires):
        with self.db() as db:db.execute("INSERT OR IGNORE INTO delivery(id,device_id,event_key,payload,state,due,expires) VALUES(?,?,?,?,'pending',?,?)",(digest(device_id+':'+event_key),device_id,event_key,json.dumps(payload),time.time(),expires))
    def claim(self):
        now=time.time();claim=secrets.token_hex(16)
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            db.execute("UPDATE delivery SET state='expired',result='expired' WHERE state IN ('pending','processing') AND expires<=?",(now,))
            db.execute("UPDATE delivery SET state='pending' WHERE state='processing' AND lease<=?",(now,))
            row=db.execute("SELECT q.*,d.token,d.provider,d.preferences FROM delivery q JOIN device d ON d.id=q.device_id WHERE q.state='pending' AND q.due<=? AND d.active=1 AND d.expires>? ORDER BY q.due LIMIT 1",(now,now)).fetchone()
            if not row:return None
            db.execute("UPDATE delivery SET state='processing',attempts=attempts+1,claim=?,lease=? WHERE id=?",(claim,now+90,row['id']))
            return {**dict(row),'claim':claim,'attempts':row['attempts']+1}
    def finish(self,item,state,result,retry_after=60):
        with self.db() as db:
            db.execute('UPDATE delivery SET state=?,result=?,due=?,lease=NULL WHERE id=? AND claim=? AND state=\'processing\'',(state,result,time.time()+retry_after,item['id'],item['claim']))
    def disable(self,device_id):
        with self.db() as db:
            db.execute('DELETE FROM device WHERE id=?',(device_id,))
            db.execute("UPDATE delivery SET state='cancelled',result='device_invalid' WHERE device_id=? AND state IN ('pending','processing')",(device_id,))
    def report(self,device_id,key):
        with self.db() as db:
            self.authenticate(db,device_id,key)
            return {'counts':{r['state']:r['n'] for r in db.execute('SELECT state,count(*) n FROM delivery WHERE device_id=? GROUP BY state',(device_id,))}}

    def start_run(self):
        owner=secrets.token_hex(16)
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            r=db.execute("SELECT value FROM meta WHERE key='worker_lease'").fetchone()
            if r and json.loads(r['value'])['expires']>time.time():return None
            db.execute("INSERT INTO meta VALUES('worker_lease',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",(json.dumps({'owner':owner,'expires':time.time()+120}),))
        return owner
    def renew_run(self,owner):
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            r=db.execute("SELECT value FROM meta WHERE key='worker_lease'").fetchone()
            if not r or json.loads(r['value'])['owner']!=owner:return False
            db.execute("UPDATE meta SET value=? WHERE key='worker_lease'",(json.dumps({'owner':owner,'expires':time.time()+120}),))
            return True
    def end_run(self,owner):
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            r=db.execute("SELECT value FROM meta WHERE key='worker_lease'").fetchone()
            if r and json.loads(r['value'])['owner']==owner:db.execute("DELETE FROM meta WHERE key='worker_lease'")
    def cleanup(self):
        now=time.time()
        with self.db() as db:
            db.execute("UPDATE delivery SET state='cancelled',result='device_expired' WHERE device_id IN (SELECT id FROM device WHERE expires<=?) AND state IN ('pending','processing')",(now,))
            db.execute('DELETE FROM device WHERE expires<=?',(now,))
            db.execute('DELETE FROM enrollment WHERE expires<=?',(now,))
            db.execute("DELETE FROM delivery WHERE expires<? AND state NOT IN ('pending','processing')",(now-86400*30,))

    def previously_notified(self,device_id,event_key):
        with self.db() as db:
            return bool(db.execute("SELECT 1 FROM delivery WHERE device_id=? AND event_key=? AND state IN ('accepted','pending','processing','previewed')",(device_id,event_key)).fetchone())

    def defer(self,item,result):
        # Source failures are not provider delivery attempts.
        with self.db() as db:
            db.execute("UPDATE delivery SET state='pending',result=?,due=?,lease=NULL,attempts=MAX(0,attempts-1) WHERE id=? AND claim=? AND state='processing'",(result,time.time()+60,item['id'],item['claim']))
