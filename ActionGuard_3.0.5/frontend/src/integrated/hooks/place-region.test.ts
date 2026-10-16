import {it,expect} from 'vitest'
import {placeDisplay,placeCountry} from './place-region'
it('puts the territory beside Agana and identifies Guam as a US territory',()=>{const p={name:'agana',country:'US' as const,lat:13.46,lon:144.74,regionCode:'GU',regionName:'괌'};expect(placeDisplay(p)).toBe('아가나 · 괌');expect(placeCountry(p)).toBe('미국령')})
it('shows the verified state instead of a state code and avoids repeating a state already in the name',()=>{const p={name:'Los Angeles',country:'US' as const,lat:34,lon:-118,regionCode:'CA'};expect(placeDisplay(p)).toBe('로스앤젤레스 · 캘리포니아주');expect(placeDisplay({...p,name:'California hotel'})).toBe('California hotel')})
it('does not derive an administrative region from an alert covering a different area',()=>{expect(placeDisplay({name:'도쿄역',country:'JP',lat:35.68,lon:139.76})).toBe('도쿄역')})
