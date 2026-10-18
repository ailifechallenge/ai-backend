import {describe,it,expect} from 'vitest';
import {actionCopy,buildHandoff,readHandoff} from './journey';
describe('seismic journey context',()=>{
 it('does not replace missing traveller location with an epicenter or default city',()=>{expect(buildHandoff('earthquake','event',null).origin).toBeNull();});
 it('passes a recent position and hazard but no coordinates in the return URL',()=>{const h=buildHandoff('tsunami','official.json',{lat:35.68,lon:139.76,at:1000},2000);expect(h.origin).toMatchObject({lat:35.68,lon:139.76,example:false});expect(h.returnTo).toBe('/japan-disasters?tab=tsunami&event=official.json');expect(h.returnTo).not.toContain('139.76');});
 it('keeps example origins explicitly labelled',()=>{expect(buildHandoff('tsunami',null,{lat:35.6812,lon:139.7671,example:true}).origin).toMatchObject({example:true,name:'도쿄역 예시'});});
 it('drops old, future, and out-of-coverage GPS origins',()=>{for(const p of [{lat:35,lon:139,at:1},{lat:35,lon:139,at:99999999},{lat:40,lon:-74,at:1000000}])expect(buildHandoff('earthquake',null,p,1000000).origin).toBeNull();});
 it('validates navigation state and rebuilds internal return paths',()=>{expect(readHandoff(null)).toBeNull();expect(readHandoff({seismicHandoff:{kind:'wrong'}})).toBeNull();const h=readHandoff({seismicHandoff:{...buildHandoff('earthquake','x',null),returnTo:'https://evil.test',origin:{lat:NaN,lon:139}}});expect(h?.returnTo).toBe('/japan-disasters?tab=earthquake&event=x');expect(h?.origin).toBeNull();});
 it('does not treat forecasts or unselected regions as evacuation warnings',()=>{expect(actionCopy('tsunami','forecast').title).toBe('쓰나미에 대비해 알아두십시오');expect(actionCopy('tsunami').title).toBe('쓰나미에 대비해 알아두십시오');expect(actionCopy('tsunami','warning').title).toBe('해당 경보 해안에 있다면');expect(actionCopy('tsunami','advisory').title).toBe('해당 주의보 해안에 있다면');});
});

it('does not revive a stale GPS point when returning through browser history',()=>{const original=buildHandoff('earthquake','x',{lat:35.68,lon:139.76,at:Date.now()-599000});if(original.origin)original.origin.at=Date.now()-601000;expect(readHandoff({seismicHandoff:original})?.origin).toBeNull();});
it('preserves GPS uncertainty and time when returning to the observation page',()=>{const at=Date.now();const original=buildHandoff('earthquake','x',{lat:35.68,lon:139.76,at,accuracy:125});expect(readHandoff({seismicHandoff:original})?.origin).toMatchObject({at,accuracy:125,example:false});});
