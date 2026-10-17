import {it,expect} from 'vitest';
import {matchStep} from './progress';
import type {WalkingRoute} from './types';
const route={steps:[{coordinates:[[139,35],[139.001,35]]},{coordinates:[[139.001,35],[139.001,35.001]]}]} as WalkingRoute;
it('finds a resumed second segment without replaying from the start',()=>{expect(matchStep(route,{lat:35.0008,lon:139.001},5).index).toBe(1);});
it('does not advance on inaccurate or off-route locations',()=>{expect(matchStep(route,{lat:35,lon:139},100).index).toBeNull();expect(matchStep(route,{lat:35.01,lon:139},5).index).toBeNull();});
it('does not guess the segment where distant sections overlap',()=>{const r={steps:[route.steps[0],route.steps[1],route.steps[0]]} as WalkingRoute;expect(matchStep(r,{lat:35,lon:139.0005},5).index).toBeNull();});
it('handles older cached routes without geometry',()=>{expect(matchStep({steps:[{}]} as WalkingRoute,{lat:35,lon:139},5).index).toBeNull();});
