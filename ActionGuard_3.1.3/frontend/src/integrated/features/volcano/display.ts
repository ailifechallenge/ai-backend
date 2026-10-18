import {distance,type Point} from '../seismic/model'
export type VolcanoDisplayRow={code:string;name:string;name_en:string;level:number|null;official_name:string;lat:number|null;lon:number|null;kind_code?:string}
// Display readings; original JMA names remain available alongside the Korean UI.
const names:Record<string,string>={
 '桜島':'사쿠라지마','阿蘇山':'아소산','浅間山':'아사마산','霧島山（新燃岳）':'기리시마산(신모에다케)','諏訪之瀬島':'스와노세섬','薩摩硫黄島':'사쓰마이오섬','雌阿寒岳':'메아칸다케','硫黄島':'이오섬',
 '十勝岳':'도카치다케','北海道駒ヶ岳':'홋카이도 고마가타케','口永良部島':'구치노에라부섬','ベヨネース列岩':'베요네스 열암','須美寿島':'스미스섬','西之島':'니시노섬','福徳岡ノ場':'후쿠토쿠오카노바',
 '富士山':'후지산','御嶽山':'온타케산','白山':'하쿠산','箱根山':'하코네산','焼岳':'야케다케','新潟焼山':'니가타 야케야마','草津白根山':'구사쓰시라네산','磐梯山':'반다이산','吾妻山':'아즈마산','安達太良山':'아다타라산','岩手山':'이와테산','秋田駒ヶ岳':'아키타 고마가타케','蔵王山':'자오산','鶴見岳・伽藍岳':'쓰루미다케·가란다케','九重山':'구주산','雲仙岳':'운젠다케','霧島山':'기리시마산','霧島山（御鉢）':'기리시마산(오하치)','伊豆大島':'이즈오섬','三宅島':'미야케섬','八丈島':'하치조섬','青ヶ島':'아오가섬','伊豆鳥島':'이즈 도리섬','樽前山':'다루마에산','有珠山':'우스산','恵山':'에산','アトサヌプリ':'아토사누푸리','大雪山':'다이세쓰산','倶多楽':'굿타라','恵庭岳':'에니와다케','中之島':'나카노섬'
}
export const volcanoName=(v:VolcanoDisplayRow)=>names[v.name]??(v.name_en||v.name)
export function volcanoStatus(v:VolcanoDisplayRow){
 if(v.level!=null)return `분화 경계 레벨 ${v.level}`
 return v.official_name.replaceAll('活火山であることに留意','활화산 활동에 유의하세요').replaceAll('周辺海域警戒','주변 해역에 대한 경보').replaceAll('火口周辺危険','분화구 주변 위험').replaceAll('居住地域厳重警戒','거주 지역 엄중 경계').replaceAll('居住地域警戒','거주 지역 경계').replaceAll('噴火警報（周辺海域）','분화 경보(주변 해역)').replaceAll('噴火警報（火口周辺）','분화 경보(화구 주변)').replaceAll('噴火警報','분화 경보').replaceAll('噴火予報','분화 예보').replaceAll('海底火山','해저 화산')
}
export function volcanoDistance(point:Point|null,v:VolcanoDisplayRow){
 return point&&v.lat!=null&&v.lon!=null&&Number.isFinite(v.lat)&&Number.isFinite(v.lon)?distance(point,{lat:v.lat,lon:v.lon}):null
}
export function orderedVolcanoes<T extends VolcanoDisplayRow>(rows:T[],point:Point|null):T[]{
 if(!point)return [...rows]
 return [...rows].sort((a,b)=>{const da=volcanoDistance(point,a),db=volcanoDistance(point,b);return da==null?(db==null?0:1):db==null?-1:da-db})
}
export const volcanoDistanceLabel=(point:Point|null,v:VolcanoDisplayRow)=>{const km=volcanoDistance(point,v);return km==null?'':`거리 ${Math.round(km).toLocaleString('ko-KR')}km`}

export function volcanoAction(v:VolcanoDisplayRow&{action:string}){
 return v.level==null?'이 화산에는 숫자로 된 경계 레벨을 사용하지 않습니다. 현지 출입 제한과 공식 안내를 확인하십시오.':v.action
}
