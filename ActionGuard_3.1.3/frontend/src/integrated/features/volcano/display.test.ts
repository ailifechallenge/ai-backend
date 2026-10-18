import {expect,it} from 'vitest'
import {volcanoName,volcanoStatus,orderedVolcanoes,volcanoDistanceLabel} from './display'
const row=(code:string,lat:number|null,lon:number|null)=>({code,name:code,name_en:code,official_name:'火口周辺危険',level:null,lat,lon})
it('preserves official list order without a registered point and never mutates it',()=>{
 const rows=[row('far',43,142),row('near',35,139)];expect(orderedVolcanoes(rows,null)).toEqual(rows)
 const sorted=orderedVolcanoes(rows,{lat:35,lon:139});expect(sorted.map(v=>v.code)).toEqual(['near','far']);expect(rows[0].code).toBe('far')
})
it('sorts by distance while placing unknown coordinates last with stable ties',()=>{
 const rows=[row('unknown',null,null),row('far',43,142),row('near',35,139),row('tie',35,139),row('bad',NaN,139)]
 expect(orderedVolcanoes(rows,{lat:35,lon:139}).map(v=>v.code)).toEqual(['near','tie','far','unknown','bad'])
 expect(volcanoDistanceLabel(null,rows[2])).toBe('');expect(volcanoDistanceLabel({lat:35,lon:139},rows[2])).toBe('거리 0km')
})
it('renders the previously untranslated active volcano names and nonnumeric restrictions in Korean',()=>{
 for(const name of ['十勝岳','北海道駒ヶ岳','口永良部島','ベヨネース列岩','須美寿島','西之島','福徳岡ノ場'])expect(volcanoName({...row('',0,0),name})).toMatch(/[가-힣]/)
 expect(volcanoStatus(row('',0,0))).toBe('분화구 주변 위험')
 expect(volcanoStatus({...row('',0,0),official_name:'活火山であることに留意（海底火山）'})).toBe('활화산 활동에 유의하세요（해저 화산）')
 expect(volcanoStatus({...row('',0,0),official_name:'周辺海域警戒'})).toBe('주변 해역에 대한 경보')
 expect(volcanoStatus({...row('',0,0),level:2})).toBe('분화 경계 레벨 2')
})
