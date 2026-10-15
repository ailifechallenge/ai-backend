"""FCM v1 and APNs providers. Credentials only live on the server."""
import asyncio
import os
import re
import time
from dataclasses import dataclass
from pathlib import Path
import httpx

@dataclass
class Outcome:
    state:str
    reason:str
    retry_after:int=60

def configured():
    return {'fcm':bool(os.getenv('PUSH_FCM_PROJECT_ID') and os.getenv('PUSH_FCM_SERVICE_ACCOUNT_FILE')),
            'apns':all(os.getenv(k) for k in ('PUSH_APNS_TEAM_ID','PUSH_APNS_KEY_ID','PUSH_APNS_TOPIC','PUSH_APNS_KEY_FILE'))}

class Sender:
    def __init__(self,client=None):
        self.client=client;self.google=None;self.apple=None;self.lock=asyncio.Lock()
    async def authorization(self,provider):
        async with self.lock:
            if provider=='fcm':
                from google.oauth2 import service_account
                from google.auth.transport.requests import Request
                if self.google is None:self.google=service_account.Credentials.from_service_account_file(os.environ['PUSH_FCM_SERVICE_ACCOUNT_FILE'],scopes=['https://www.googleapis.com/auth/firebase.messaging'])
                if not self.google.valid:await asyncio.to_thread(self.google.refresh,Request())
                return self.google.token
            import jwt
            if not self.apple or self.apple[0]<time.time():
                token=jwt.encode({'iss':os.environ['PUSH_APNS_TEAM_ID'],'iat':int(time.time())},Path(os.environ['PUSH_APNS_KEY_FILE']).read_text(),algorithm='ES256',headers={'kid':os.environ['PUSH_APNS_KEY_ID']})
                self.apple=(time.time()+3000,token)
            return self.apple[1]
    async def send(self,item):
        provider=item['provider'];payload=item['payload'];now=time.time()
        if item['expires']<=now:return Outcome('expired','expired')
        if not configured().get(provider):return Outcome('retry','provider_unconfigured')
        try:
            auth=await self.authorization(provider)
            if provider=='fcm':
                project=os.environ['PUSH_FCM_PROJECT_ID']
                if not re.fullmatch(r'[a-zA-Z0-9-]{3,128}',project):return Outcome('failed','configuration_error')
                url=f'https://fcm.googleapis.com/v1/projects/{project}/messages:send'
                body={'message':{'token':item['token'],'notification':{'title':payload['title'],'body':payload['body']},'data':payload['data'],'android':{'priority':'high','ttl':str(max(1,int(item['expires']-now)))+'s','notification':{'channel_id':'official-alerts','tag':item['id']}}}}
                headers={'Authorization':'Bearer '+auth}
            else:
                if not re.fullmatch(r'[a-fA-F0-9]{64,256}',item['token']):return Outcome('invalid','invalid_device')
                host='api.sandbox.push.apple.com' if os.getenv('PUSH_APNS_SANDBOX')=='true' else 'api.push.apple.com'
                url=f'https://{host}/3/device/{item["token"]}'
                import uuid
                headers={'authorization':'bearer '+auth,'apns-topic':os.environ['PUSH_APNS_TOPIC'],'apns-push-type':'alert','apns-priority':'10','apns-expiration':str(int(item['expires'])),'apns-id':str(uuid.UUID(item['id'][:32])),'apns-collapse-id':item['id']}
                body={'aps':{'alert':{'title':payload['title'],'body':payload['body']},'sound':'default'},**payload['data']}
            if self.client:r=await self.client.post(url,headers=headers,json=body)
            else:
                async with httpx.AsyncClient(timeout=20,http2=provider=='apns') as client:r=await client.post(url,headers=headers,json=body)
            if r.status_code==200:
                if provider=='fcm' and not str(r.json().get('name') or '').startswith('projects/'):return Outcome('retry','provider_response_invalid')
                return Outcome('accepted','provider_accepted')
            try:data=r.json()
            except ValueError:data={}
            if provider=='apns' and r.status_code==410:return Outcome('invalid','invalid_device')
            if provider=='fcm':
                details=(data.get('error') or {}).get('details') or []
                if any(d.get('@type')=='type.googleapis.com/google.firebase.fcm.v1.FcmError' and d.get('errorCode')=='UNREGISTERED' for d in details if isinstance(d,dict)):return Outcome('invalid','invalid_device')
            if r.status_code==401:self.google=None;self.apple=None
            if r.status_code in (401,403,408,429) or r.status_code>=500:
                retry=r.headers.get('retry-after','60');delay=60
                if retry.isdigit():delay=min(3600,max(60,int(retry)))
                else:
                    try:
                        from email.utils import parsedate_to_datetime
                        delay=min(3600,max(60,int(parsedate_to_datetime(retry).timestamp()-time.time())))
                    except (ValueError,TypeError,OverflowError):pass
                return Outcome('retry','provider_temporary_error',delay)
            return Outcome('failed','provider_rejected')
        except Exception:return Outcome('retry','provider_connection_or_configuration_error')
