import type {UrgencyAssessment} from '../integrated/types'
const names:Record<string,string>={
 'Typhoon Warning':'태풍 경보','Typhoon Watch':'태풍 예비경보','Super Typhoon Warning':'슈퍼태풍 경보','Super Typhoon Watch':'슈퍼태풍 예비경보',
 'Heat Advisory':'폭염 주의보','Excessive Heat Warning':'극심한 폭염 경보','Extreme Heat Warning':'극심한 폭염 경보','Excessive Heat Watch':'극심한 폭염 예비경보','Extreme Heat Watch':'극심한 폭염 예비경보',
 'Flood Warning':'홍수 경보','Flood Watch':'홍수 예비경보','Flood Advisory':'홍수 주의보','Flash Flood Warning':'돌발홍수 경보','Flash Flood Watch':'돌발홍수 예비경보','Tornado Warning':'토네이도 경보','Tornado Watch':'토네이도 예비경보','Severe Thunderstorm Warning':'심한 뇌우 경보','Severe Thunderstorm Watch':'심한 뇌우 예비경보','High Wind Warning':'강풍 경보','High Wind Watch':'강풍 예비경보','Wind Advisory':'강풍 주의보','Winter Storm Warning':'겨울폭풍 경보','Winter Storm Watch':'겨울폭풍 예비경보','Winter Weather Advisory':'겨울철 기상 주의보','Hurricane Warning':'허리케인 경보','Hurricane Watch':'허리케인 예비경보','Tropical Storm Warning':'열대폭풍 경보','Storm Surge Warning':'폭풍해일 경보','Coastal Flood Warning':'해안홍수 경보','Coastal Flood Advisory':'해안홍수 주의보','Tsunami Warning':'쓰나미 경보','Tsunami Advisory':'쓰나미 주의보','Red Flag Warning':'산불 위험 경보','Fire Weather Watch':'산불 위험 예비경보','Dense Fog Advisory':'짙은 안개 주의보','Air Quality Alert':'대기질 경보','寒波注意報':'한파 주의보','大雨警報':'호우 경보','大雨注意報':'호우 주의보','洪水警報':'홍수 경보','洪水注意報':'홍수 주의보','暴風警報':'폭풍 경보','雷注意報':'낙뢰 주의보','大雪警報':'대설 경보','大雪注意報':'대설 주의보','津波警報':'쓰나미 경보','津波注意報':'쓰나미 주의보'
}
export function alertName(event?:string){if(!event)return '받은 문자 확인';return names[event]??event}
export function ResponseBadge({assessment,pending=false}:{assessment?:UrgencyAssessment|null;pending?:boolean}){
 const level=assessment?.inactive?null:assessment?.level
 return <span data-assessment-method={assessment?.method} className={`response-badge stage-${level??'unknown'}`}>{pending?'AI 판단 중':level?`${level}단계 · ${['정보','주의','대비','대피'][level-1]}`:assessment?.inactive?'단계 미표시':'단계 미확인'}</span>
}
