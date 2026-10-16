"""Offline SDK checks with newly generated test keys; no real provider/account is contacted."""
import asyncio
import json
import pytest
from backend.push.providers import Sender

def test_apns_es256_header_claims_and_reuse(monkeypatch,tmp_path):
 jwt=pytest.importorskip('jwt');ec=pytest.importorskip('cryptography.hazmat.primitives.asymmetric.ec')
 from cryptography.hazmat.primitives import serialization
 key=ec.generate_private_key(ec.SECP256R1());p=tmp_path/'test-key.p8';p.write_bytes(key.private_bytes(serialization.Encoding.PEM,serialization.PrivateFormat.PKCS8,serialization.NoEncryption()))
 monkeypatch.setenv('PUSH_APNS_TEAM_ID','TESTTEAM');monkeypatch.setenv('PUSH_APNS_KEY_ID','TESTKEY');monkeypatch.setenv('PUSH_APNS_KEY_FILE',str(p))
 async def check():
  s=Sender();a=await s.authorization('apns');b=await s.authorization('apns');assert a==b
  assert jwt.get_unverified_header(a)['kid']=='TESTKEY'
  assert jwt.decode(a,key.public_key(),algorithms=['ES256'])['iss']=='TESTTEAM'
 asyncio.run(check())

def test_fcm_service_account_refresh_and_cache_without_network(monkeypatch,tmp_path):
 pytest.importorskip('google.auth');pytest.importorskip('cryptography')
 from cryptography.hazmat.primitives.asymmetric import rsa
 from cryptography.hazmat.primitives import serialization
 import google.auth.transport.requests
 key=rsa.generate_private_key(public_exponent=65537,key_size=2048)
 account={'type':'service_account','project_id':'test-project','private_key_id':'test-key','private_key':key.private_bytes(serialization.Encoding.PEM,serialization.PrivateFormat.PKCS8,serialization.NoEncryption()).decode(),'client_email':'test@test-project.iam.gserviceaccount.com','token_uri':'https://oauth2.googleapis.com/token'}
 p=tmp_path/'test-service-account.json';p.write_text(json.dumps(account));monkeypatch.setenv('PUSH_FCM_SERVICE_ACCOUNT_FILE',str(p))
 calls=[]
 class Request:
  def __call__(self,url,**kwargs):
   calls.append(url)
   assert url=='https://oauth2.googleapis.com/token'
   return type('Response',(),{'status':200,'data':b'{"access_token":"fake-offline-token","expires_in":3600,"token_type":"Bearer"}','headers':{}})()
 monkeypatch.setattr(google.auth.transport.requests,'Request',Request)
 async def check():
  s=Sender();assert await s.authorization('fcm')=='fake-offline-token';assert await s.authorization('fcm')=='fake-offline-token'
 asyncio.run(check());assert len(calls)==1
