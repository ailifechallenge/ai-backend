import {describe,it,expect} from 'vitest';
import {distance,nearestStation,intensityLabel,formatTime,placeLabel,heightLabel} from './model';
describe('seismic observations',()=>{
 it('uses geodesic distance including the date line',()=>{expect(distance({lat:35.6812,lon:139.7671},{lat:35.6,lon:140.1})).toBeCloseTo(31.4,0);expect(distance({lat:0,lon:179},{lat:0,lon:-179})).toBeCloseTo(222.4,0);expect(distance({lat:90,lon:180},{lat:90,lon:180})).toBe(0);});
 it('returns a measured station, never calculates an intensity',()=>{expect(nearestStation({lat:35,lon:139},[])).toBeNull();const s=nearestStation({lat:35,lon:139},[{lat:35.01,lon:139,id:'x',name:'station',city:'city',intensity:'5+'}]);expect(s?.intensity).toBe('5+');expect(s?.distance).toBeGreaterThan(1);});
 it('keeps upper/lower separate and missing unknown',()=>{expect(intensityLabel('5-')).toBe('5 약');expect(intensityLabel('5+')).toBe('5 강');expect(intensityLabel(null)).toBe('미확인');});
 it('formats in Japan time',()=>{expect(formatTime('2026-10-15T05:13:00Z')).toContain('14:13');expect(formatTime(null)).toBe('미확인');expect(formatTime('invalid')).toBe('미확인');});
});

it('keeps Okinawa from becoming offshore and shows thresholds correctly',()=>{expect(placeLabel('沖縄本島地方')).toBe('오키나와 본섬 지역');expect(placeLabel('千葉県東方沖')).toBe('지바현 동쪽 앞바다');expect(heightLabel('<0.2')).toBe('0.2 m 미만');});
