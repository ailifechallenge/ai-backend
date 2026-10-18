export type OfficialLevel={label:string;action:string;tone:number;source:string}
const nws='https://www.weather.gov/safety/';const jma='https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/';
export function officialLevel(event:string,country:'US'|'JP'):OfficialLevel {
 if(country==='US'){
  if(/\bWarning\b/i.test(event))return {label:'Warning · 경보',action:'보호행동이 필요합니다. 재난별 원문 지시를 확인하십시오. 모든 Warning이 외부 대피를 뜻하지 않습니다.',tone:4,source:nws};
  if(/\bWatch\b/i.test(event))return {label:'Watch · 대비',action:'발생 가능성에 대비하고 최신 경보를 확인하십시오.',tone:3,source:nws};
  if(/\bAdvisory\b/i.test(event))return {label:'Advisory · 주의보',action:'주의보도 지금 보호행동이 필요할 수 있습니다. 원문의 행동 지시를 따르십시오.',tone:2,source:nws};
  return {label:'공식 정보 · 유형 확인',action:'발표명과 원문 지시를 확인하십시오. 낮은 위험을 뜻하지 않습니다.',tone:1,source:nws};
 }
 const jp=event.normalize('NFKC');
 // Five-level equivalence applies to the designated rainfall/flood/landslide/storm-surge hazards, not every JMA warning.
 const eligible=/(大雨|氾濫|洪水|土砂災害|高潮)/.test(jp);
 if(eligible){const n=/特別警報/.test(jp)?5:/危険警報/.test(jp)?4:/警報/.test(jp)?3:/注意報/.test(jp)?2:null;
  if(n)return {label:`레벨 ${n} 상당 · ${n===5?'특별경보':n===4?'위험경보':n===3?'경보':'주의보'}`,action:({2:'대피 장소와 이동 방법을 확인하십시오.',3:'위험한 장소의 고령자 등은 대피가 필요한 수준입니다.',4:'위험한 장소에서는 모두 대피가 필요한 수준입니다.',5:'생명의 위험이 있습니다. 즉시 가능한 안전을 확보하십시오.'} as Record<number,string>)[n]+' 기상정보의 상당 레벨이며 지자체 대피 지시와 구분하십시오.',tone:Math.min(n,4),source:jma};
 }
 if(/大津波/.test(jp))return {label:'대쓰나미 경보',action:'해안·강가에서 즉시 높은 곳이나 대피 건물로 이동하십시오.',tone:4,source:'https://www.jma.go.jp/jma/kishou/know/jishin/joho/tsunamiinfo.html'};
 if(/津波警報/.test(jp))return {label:'쓰나미 경보',action:'해안·강가에서 즉시 높은 곳이나 대피 건물로 이동하십시오.',tone:4,source:'https://www.jma.go.jp/jma/kishou/know/jishin/joho/tsunamiinfo.html'};
 if(/津波注意報/.test(jp))return {label:'쓰나미 주의보',action:'바다에서 나오고 해안에서 벗어나십시오.',tone:2,source:'https://www.jma.go.jp/jma/kishou/know/jishin/joho/tsunamiinfo.html'};
 return {label:/特別警報/.test(jp)?'특별경보':/警報/.test(jp)?'경보':/注意報/.test(jp)?'주의보':'공식 정보 · 유형 확인',action:'이 재난은 공통 숫자 레벨로 환산하지 않습니다. 해당 경보의 공식 행동 지시를 확인하십시오.',tone:/特別警報/.test(jp)?4:/警報/.test(jp)?3:2,source:jma};
}
