import {inJapanCoverage} from '../shelters/coverage';
import type {Point} from './model';

export type SeismicHandoff = {
  kind:'japan-seismic';
  hazard:'earthquake'|'tsunami';
  eventId:string|null;
  returnTo:string;
  origin:(Point&{example:boolean;name:string;at?:number;accuracy?:number})|null;
};

/** Only a location deliberately selected by the traveller is an origin. Never use an epicenter. */
export function buildHandoff(hazard:SeismicHandoff['hazard'],eventId:string|null,position:(Point&{example?:boolean;at?:number;accuracy?:number})|null,now=Date.now()):SeismicHandoff {
  const usable=position&&inJapanCoverage(position)&&(position.example||!!position.at&&(now-position.at>=-30000&&now-position.at<=600000));
  const query=new URLSearchParams({tab:hazard});
  if(eventId)query.set('event',eventId);
  return {kind:'japan-seismic',hazard,eventId,returnTo:'/japan-disasters?'+query,origin:usable?{lat:position.lat,lon:position.lon,example:!!position.example,at:position.at,accuracy:typeof position.accuracy==='number'&&Number.isFinite(position.accuracy)&&position.accuracy>=0?position.accuracy:undefined,name:position.example?'도쿄역 예시':'지진·쓰나미 화면에서 확인한 위치'}:null};
}
export function readHandoff(state:unknown):SeismicHandoff|null {
  if(!state||typeof state!=='object'||!('seismicHandoff' in state))return null;
  const h=state.seismicHandoff as Partial<SeismicHandoff>|null;
  if(!h||h.kind!=='japan-seismic'||!['earthquake','tsunami'].includes(h.hazard??'')||typeof h.returnTo!=='string')return null;
  // Rebuild the internal return address rather than trusting a URL from navigation state.
  const clean=buildHandoff(h.hazard as SeismicHandoff['hazard'],typeof h.eventId==='string'?h.eventId:null,null);
  if(h.origin&&typeof h.origin.lat==='number'&&typeof h.origin.lon==='number')clean.origin=buildHandoff(clean.hazard,clean.eventId,{lat:h.origin.lat,lon:h.origin.lon,example:h.origin.example===true,at:h.origin.at,accuracy:h.origin.accuracy}).origin;
  return clean;
}
export const GUIDANCE_SOURCES={
 earthquake:'https://www.jma.go.jp/jma/kishou/know/jishin/eew/koudou/koudou.html',
 tsunami:'https://www.jma.go.jp/jma/kishou/know/jishin/joho/tsunamiinfo.html',
};
export function actionCopy(hazard:'earthquake'|'tsunami',level?:string){
 if(hazard==='earthquake')return {title:'지금 흔들림을 느낀다면',steps:['머리를 보호하고 튼튼한 탁자 아래 등 안전한 곳에서 몸을 지키세요.','큰 가구와 떨어질 물건에서 멀어지고, 당황해서 밖으로 뛰어나가지 마세요.'],condition:'선택한 지진의 대피 명령이 아닌, 흔들림을 느낄 때의 일반 행동요령입니다.'};
 if(level==='major'||level==='warning')return {title:'해당 경보 해안에 있다면',steps:['해안이나 강 주변에서 벗어나 높은 곳이나 지정된 대피 건물로 즉시 대피하세요.','파도가 반복될 수 있어요. 경보·주의보가 해제될 때까지 안전한 곳에서 대피를 유지하세요.'],condition:'선택한 해안 경보에 해당하는 사람을 위한 일반 행동요령입니다. 내 위치의 해당 여부는 별도 확인하세요.'};
 if(level==='advisory')return {title:'해당 주의보 해안에 있다면',steps:['바다에 있다면 즉시 물 밖으로 나와 해안에서 멀어지세요.','해제될 때까지 바다에 들어가거나 해안에 접근하지 마세요.'],condition:'선택한 해안의 주의보에 대한 일반 행동요령입니다.'};
 return {title:'쓰나미에 대비해 알아두세요',steps:['해안에서 강하거나 오래 지속되는 흔들림을 느끼면 해안에서 벗어나 더 높은 안전한 곳으로 대피하세요.','현재 경보 단계와 지자체 대피 지시는 공식 안내에서 확인하세요.'],condition:'현재 위치에 대한 대피 명령이 아닌 일반 대비 정보입니다.'};
}
