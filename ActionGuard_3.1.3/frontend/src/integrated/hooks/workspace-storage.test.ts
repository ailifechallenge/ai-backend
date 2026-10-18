import {beforeEach,it,expect,vi} from 'vitest'
import {JOURNEY_KEY,readJourney,writeJourney} from './workspace-storage'
const place={country:'US' as const,name:'New York',lat:40.7,lon:-74,timezone:'America/New_York'}
const stay={name:'Hotel',country:'US' as const,latitude:40.7,longitude:-74,municipality:null,timezone:'America/New_York',start:'2026-10-17T15:00',end:'2026-10-18T10:00'}
beforeEach(()=>{localStorage.clear();vi.restoreAllMocks()})
it('restores only the saved location and itinerary, without alert text or stale judgments',()=>{
 expect(writeJourney(place,stay)).toBe(true)
 expect(readJourney()).toEqual({place,stay})
 const raw=localStorage.getItem(JOURNEY_KEY)!
 expect(raw).not.toContain('translation');expect(raw).not.toContain('verification');expect(raw).not.toContain('alert')
})
it('discards corrupt, unknown-version and unsupported-coordinate data',()=>{
 for(const raw of ['{',JSON.stringify({version:99,place}),JSON.stringify({version:1,place:{...place,lat:0},stay:{...stay,timezone:'Bad/Zone'}})]){
  localStorage.setItem(JOURNEY_KEY,raw);expect(readJourney()).toEqual({place:null,stay:null})
 }
})
it('does not restore an itinerary with reversed times',()=>{
 localStorage.setItem(JOURNEY_KEY,JSON.stringify({version:1,place,stay:{...stay,end:stay.start}}))
 expect(readJourney().stay).toBeNull()
})
it('clears both saved values on explicit deletion',()=>{
 writeJourney(place,stay);writeJourney(null,null);expect(localStorage.getItem(JOURNEY_KEY)).toBeNull()
})
it('keeps the app usable when device storage rejects writes',()=>{
 vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('quota')})
 expect(writeJourney(place,stay)).toBe(false)
})
