import type {Origin,WalkingRoute} from './types';
// Local planar projection is sufficient for nearby GPS-to-road matching.
export function matchStep(route:WalkingRoute,p:Origin,accuracy:number){
 if(!Number.isFinite(accuracy)||accuracy>35)return {index:null,reason:'위치 오차가 커서 자동 안내를 잠시 멈췄어요.'};
 const scale=111320,cos=Math.cos(p.lat*Math.PI/180);let candidates:{index:number;d:number}[]=[];
 route.steps.forEach((s,index)=>{const pts=s.coordinates||[];let best=Infinity;for(let i=1;i<pts.length;i++){const a=[(pts[i-1][0]-p.lon)*scale*cos,(pts[i-1][1]-p.lat)*scale],b=[(pts[i][0]-p.lon)*scale*cos,(pts[i][1]-p.lat)*scale];const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,-(a[0]*dx+a[1]*dy)/(dx*dx+dy*dy||1)));best=Math.min(best,Math.hypot(a[0]+t*dx,a[1]+t*dy));}if(Number.isFinite(best))candidates.push({index,d:best});});
 candidates=candidates.sort((a,b)=>a.d-b.d);const best=candidates[0];
 if(!best)return {index:null,reason:'자동 안내용 구간 좌표가 없습니다. 구간을 직접 선택하세요.'};
 if(best.d>45)return {index:null,reason:'경로에서 벗어났을 수 있어요. 안전한 곳에서 위치를 확인하고 경로를 다시 찾으세요.'};
 if(candidates.some(x=>Math.abs(x.index-best.index)>1&&x.d<best.d+10))return {index:null,reason:'교차하는 경로에서 진행 방향을 확인 중입니다. 현재 구간을 직접 선택할 수 있어요.'};
 return {index:best.index,reason:'GPS 위치로 현재 구간을 표시하고 있어요.'};
}
