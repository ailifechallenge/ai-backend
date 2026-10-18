export type AlertTarget={kind:'earthquake'|'tsunami'|'weather'|'volcano';event:string|null;issuedAt:string;route:string;key:string};
const QUAKE=/^\d{14}_\d{14}_VXSE[A-Za-z0-9]+_\d+\.json$/;
const TSUNAMI=/^\d{14}_\d{14}_VTSE41_\d+\.json$/;
/** Notification content cannot choose a host, API URL, script or arbitrary app route. */
export function notificationTarget(data:unknown):AlertTarget|null {
 if(!data||typeof data!=='object')return null;
 const d=data as Record<string,unknown>;
 if(d.kind!=='earthquake'&&d.kind!=='tsunami'&&d.kind!=='weather'&&d.kind!=='volcano')return null;
 if(typeof d.issued_at!=='string'||!Number.isFinite(Date.parse(d.issued_at))||!/(?:Z|[+-]\d{2}:\d{2})$/.test(d.issued_at))return null;
 if(d.kind==='volcano'){if(typeof d.event!=='string'||!/^\d{3}$/.test(d.event))return null;return {kind:'volcano',event:d.event,issuedAt:d.issued_at,route:'/japan-volcano?code='+d.event,key:`volcano:${d.event}:${d.issued_at}`}}
 if(d.kind==='weather'){
  if(typeof d.region!=='string'||typeof d.area!=='string'||typeof d.event!=='string'||d.event.length>500||/[\x00-\x1f]/.test(d.event))return null;
  const scope=`${d.country}:${d.region}:${d.area}`;
  if(!/^(?:US:[A-Z]{2}:[A-Z]{2}[CZ][0-9]{3}|JP:[0-9]{6}:[0-9]{7})$/.test(scope))return null;
  if(d.country==='US'&&(!d.area.startsWith(d.region)||!/^https:\/\/api\.weather\.gov\/alerts\/urn:oid:[A-Za-z0-9.:-]+$/.test(d.event)))return null;
  if(d.country==='JP'&&!new RegExp(`^jma:${d.region}:${d.area}:[0-9]{2}$`).test(d.event))return null;
  const params=new URLSearchParams({scope,event:d.event});
  return {kind:'weather',event:d.event,issuedAt:d.issued_at,route:'/weather-alert?'+params,key:`weather:${scope}:${d.event}:${d.issued_at}`};
 }
 if(d.kind==='earthquake'&&(typeof d.event!=='string'||!QUAKE.test(d.event)))return null;
 if(d.kind==='tsunami'&&d.event!=null&&(typeof d.event!=='string'||!TSUNAMI.test(d.event)))return null;
 const event=typeof d.event==='string'?d.event:null;
 // Tsunami taps always reload current status; a past notification must not restore an old warning.
 const params=new URLSearchParams({tab:d.kind});if(d.kind==='earthquake'&&event)params.set('event',event);
 return {kind:d.kind,event,issuedAt:d.issued_at,route:'/japan-disasters?'+params,key:`${d.kind}:${event??''}:${d.issued_at}`};
}
export function deepLinkTarget(value:string):AlertTarget|null {
 try{const u=new URL(value);if(u.protocol!=='actionguard:'||u.hostname!=='alert'||!['','/'].includes(u.pathname)||u.username||u.password||u.port||u.hash)return null;return notificationTarget({kind:u.searchParams.get('kind'),event:u.searchParams.get('event'),issued_at:u.searchParams.get('issued_at'),country:u.searchParams.get('country'),region:u.searchParams.get('region'),area:u.searchParams.get('area')});}catch{return null;}
}
export type ReceivedAlert=AlertTarget&{receivedAt:string};
export function addReceived(rows:ReceivedAlert[],target:AlertTarget):ReceivedAlert[]{
 if(rows.some(r=>r.key===target.key))return rows;
 return [{...target,receivedAt:new Date().toISOString()},...rows].slice(0,30);
}
export function apiAddress(path:string,base:string|undefined,native:boolean,localDevice=false){
 if(!/^[a-z][a-z0-9/_.%-]*(?:\?[^#]*)?$/i.test(path)||decodeURIComponent(path.split('?')[0]).split('/').some(p=>p==='..'))throw new Error('잘못된 API 경로입니다.');
 if(!base?.trim()){if(native)throw new Error('앱 서버 주소가 설정되지 않았습니다. 앱 빌드 설정을 확인해 주십시오.');return '/api/'+path;}
 let u:URL;try{u=new URL(base);}catch{throw new Error('앱 서버 주소를 확인해 주십시오.');}
 const local=native&&localDevice&&u.protocol==='http:'&&u.hostname.endsWith('.local')&&u.pathname==='/';
 if((u.protocol!=='https:'&&!local)||u.username||u.password||u.search||u.hash)throw new Error('앱 서버는 인증정보가 없는 HTTPS 주소로 설정해야 합니다.');
 return base.replace(/\/+$/,'')+'/api/'+path;
}
