import {expect,it} from 'vitest';
import {US_STATES,stateLabel,japanRegionLabel,japaneseAreaLabel,savedRegionLabel} from './labels';
it('shows Korean plus original Japanese for prefectures and municipalities',()=>{
 expect(japanRegionLabel({code:'130000',name:'東京都',en_name:'Tokyo'})).toBe('도쿄도 (東京都)');
 expect(japanRegionLabel({code:'1310100',name:'千代田区'})).toBe('지요다구 (千代田区)');
 expect(japanRegionLabel({code:'1410011',name:'横浜市北部'})).toBe('요코하마시 북부 (横浜市北部)');
});
it('does not recycle a label when official identity changes',()=>{expect(japanRegionLabel({code:'1310100',name:'New official name'})).toBe('New official name');});
it('covers all supported US states and territories without requiring a code from the user',()=>{
 expect(US_STATES).toHaveLength(56);expect(stateLabel('CA')).toBe('캘리포니아주 · California (CA)');expect(stateLabel('DC')).toContain('특별구');expect(stateLabel('GU')).toContain('괌');
});
it('renders old saved Japanese names while retaining their scope and original identity',()=>{
 const old={scope:'JP:130000:1310100',name:'千代田区'};expect(savedRegionLabel(old)).toBe('지요다구 (千代田区)');expect(old.name).toBe('千代田区');
 expect(japaneseAreaLabel('千代田区、中央区')).toBe('지요다구 (千代田区) · 주오구 (中央区)');
});
