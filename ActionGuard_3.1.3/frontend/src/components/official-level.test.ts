import {expect,it} from 'vitest'
import {officialLevel} from './official-level'
import {shopUrl} from './SupplyShops'
it('does not equate all US warnings to an evacuation order',()=>{const a=officialLevel('High Wind Warning','US');expect(a.label).toBe('Warning · 경보');expect(a.action).toContain('모든 Warning이 외부 대피를 뜻하지 않습니다')})
it('preserves advisory take-action guidance',()=>expect(officialLevel('Wind Advisory','US').action).toContain('지금 보호행동'))
it('uses designated JMA rainfall levels without applying them to wind or snow',()=>{expect(officialLevel('Heavy Rain Danger Warning / 大雨危険警報','JP').label).toBe('레벨 4 상당 · 위험경보');expect(officialLevel('暴風警報','JP').label).toBe('경보');expect(officialLevel('大雪特別警報','JP').label).toBe('특별경보');expect(officialLevel('大雨特別警報','JP').label).toBe('레벨 5 상당 · 특별경보')})
it('keeps tsunami separate from meteorological numeric levels',()=>{expect(officialLevel('大津波警報','JP').label).toBe('대쓰나미 경보');expect(officialLevel('津波注意報','JP').label).toBe('쓰나미 주의보')})
it('encodes only an explicit maps search link',()=>{const u=new URL(shopUrl('薬局',{name:'東京駅',country:'JP'}));expect(u.host).toBe('www.google.com');expect(u.searchParams.get('query')).toBe('薬局 near 東京駅, Japan')})
it('uses current Maps location without embedding raw coordinates',()=>{const u=new URL(shopUrl('convenience store'));expect(u.searchParams.get('api')).toBe('1');expect(u.searchParams.get('query')).toBe('convenience store near me')})
