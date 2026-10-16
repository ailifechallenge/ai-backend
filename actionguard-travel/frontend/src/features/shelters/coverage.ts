import type { Origin } from './types';
// Approximate feed coverage; these boxes do not establish political boundaries.
export function inUSCoverage(p: Origin): boolean {
  const boxes = [[24,50,-125,-66],[51,72,-180,-129],[51,72,170,180],
    [18,23,-161,-154],[17,19,-68,-64],[13,21,144,146],[-15,-10,-172,-168]];
  return boxes.some(([south,north,west,east]) => p.lat >= south && p.lat <= north && p.lon >= west && p.lon <= east);
}
export const NYC_EXAMPLE: Origin = {lat:40.7580, lon:-73.9855};
export function inJapanCoverage(p: Origin): boolean {return Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&[[30,46,128,146],[23.5,30.5,122.5,132],[20,30,136,154]].some(([a,b,c,d])=>p.lat>=a&&p.lat<=b&&p.lon>=c&&p.lon<=d);}
export const TOKYO_EXAMPLE: Origin = {lat:35.6812,lon:139.7671};
