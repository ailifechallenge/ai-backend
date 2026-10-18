import {describe,it,expect} from 'vitest';
import {apiAddress,notificationTarget,deepLinkTarget,addReceived} from './contracts';
const data={kind:'earthquake',event:'20261015141311_20261015141019_VXSE5k_1.json',issued_at:'2026-10-15T05:13:00Z'};
describe('native notification targets',()=>{
 it('opens exactly the validated observation without a payload-provided route',()=>{const t=notificationTarget({...data,url:'https://evil.example',route:'/other'});expect(t?.route).toContain('tab=earthquake&event=20261015');expect(t?.route).not.toContain('evil');});
 it('always opens current tsunami status even if the notification is old',()=>{expect(notificationTarget({kind:'tsunami',event:'20261010033742_20261010025608_VTSE41_0.json',issued_at:data.issued_at})?.route).toBe('/japan-disasters?tab=tsunami');});
 it.each([null,{}, {...data,event:'../../secret'}, {...data,kind:'fire'}, {...data,issued_at:'2026-10-15'}, {...data,event:'https://evil.example/a.json'}])('rejects unsupported or ambiguous notification input',bad=>expect(notificationTarget(bad)).toBeNull());
 it('accepts only the registered custom-scheme host',()=>{const params=new URLSearchParams(data);expect(deepLinkTarget('actionguard://alert?'+params)?.kind).toBe('earthquake');for(const url of ['https://evil.example/?'+params,'actionguard://other?'+params,'actionguard://alert/path?'+params,'actionguard://user@alert?'+params])expect(deepLinkTarget(url)).toBeNull();});
 it('deduplicates notifications and caps retained entries',()=>{const t=notificationTarget(data)!;const a=addReceived([],t);expect(addReceived(a,t)).toBe(a);let rows=a;for(let i=0;i<40;i++)rows=addReceived(rows,{...t,key:'unique'+i});expect(rows).toHaveLength(30);});
});
describe('native API deployment',()=>{
 it('keeps web development proxy URLs',()=>expect(apiAddress('japan/tsunami',undefined,false)).toBe('/api/japan/tsunami'));
 it('rejects missing native API config and HTTP/credential bases',()=>{expect(()=>apiAddress('health',undefined,true)).toThrow('앱 서버 주소');for(const base of ['http://example.org','https://user:secret@example.org','https://example.org?token=secret'])expect(()=>apiAddress('health',base,true)).toThrow('HTTPS');});
 it('supports detailed filenames and queries without escaping the API base',()=>{expect(apiAddress('japan/earthquakes/'+data.event,'https://api.example.org/',true)).toBe('https://api.example.org/api/japan/earthquakes/'+data.event);expect(apiAddress('alerts?point=35%2C139','https://api.example.org',true)).toContain('/api/alerts?point=');for(const path of ['../secret','https://evil.test/a','a/%2e%2e/secret'])expect(()=>apiAddress(path,'https://api.example.org',true)).toThrow('API 경로');});
});
describe('regional weather notification links',()=>{
 const weather={kind:'weather',country:'US',region:'CA',area:'CAZ522',event:'https://api.weather.gov/alerts/urn:oid:2.49.0.1',issued_at:'2026-10-15T05:13:00Z'};
 it('opens current official state within the app, ignoring a supplied host',()=>{const target=notificationTarget({...weather,url:'https://evil.test'});expect(target?.route).toMatch(/^\/weather-alert\?/);expect(target?.route).toContain('US%3ACA%3ACAZ522');expect(target?.route).not.toContain('evil');});
 it('accepts only a matching Japanese city and announcement identity',()=>{expect(notificationTarget({...weather,country:'JP',region:'130000',area:'1310100',event:'jma:130000:1310100:15'})?.kind).toBe('weather');expect(notificationTarget({...weather,country:'JP',region:'130000',area:'1310100',event:'jma:140000:1310100:15'})).toBeNull();});
 it.each([{area:'NYZ001'},{event:'https://evil.test/alerts/urn:oid:1'},{event:'../../escape'},{region:'../../'},{country:'KR'}])('rejects mismatched or unsafe regional notification targets',bad=>{expect(notificationTarget({...weather,...bad})).toBeNull();});
});

it('permits only an explicit native local-device build to contact a local Mac',()=>{
 expect(apiAddress('health','http://MacBook-Pro.local:8004',true,true)).toBe('http://MacBook-Pro.local:8004/api/health');
 for(const [base,native,local] of [['http://example.org',true,true],['http://MacBook-Pro.local:8004',true,false],['http://MacBook-Pro.local:8004',false,true],['http://user:pass@MacBook-Pro.local:8004',true,true],['http://MacBook-Pro.local:8004/path',true,true]] as const)expect(()=>apiAddress('health',base,native,local)).toThrow('HTTPS')
})
