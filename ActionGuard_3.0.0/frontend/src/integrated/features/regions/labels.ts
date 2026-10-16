import jp from '../../../../../data/japan-region-display.json';
import states from '../../../../../data/us-states-ko.json';
export type RegionChoice={code:string;name:string;en_name?:string;ko_name?:string|null;display_name?:string;label_method?:string};
export const US_STATES=states;
export const stateLabel=(code:string)=>{const s=US_STATES.find(x=>x.code===code);return s?`${s.ko_name} · ${s.en_name} (${s.code})`:code;};
type Entry={name:string;ko_name:string};
const offices:Record<string,Entry>=jp.offices;
const municipalities:Record<string,Entry>=jp.municipalities;
const names=new Map<string,Set<string>>();
for(const entry of [...Object.values(offices),...Object.values(municipalities)]){const values=names.get(entry.name)??new Set<string>();values.add(entry.ko_name);names.set(entry.name,values);}
export function japanRegionLabel(r:RegionChoice):string{
 if(r.display_name&&r.ko_name)return r.display_name;
 const entry=offices[r.code]??municipalities[r.code];
 if(entry?.name===r.name)return `${entry.ko_name} (${r.name})`;
 return japaneseAreaLabel(r.name)+(r.en_name?` · ${r.en_name}`:'');
}
export function japaneseAreaLabel(name:string):string{
 return name.split('、').map(n=>{const values=names.get(n.trim());return values?.size===1?`${[...values][0]} (${n.trim()})`:n;}).join(' · ');
}
export function savedRegionLabel(r:{scope:string;name:string}):string{
 const parts=r.scope.split(':');return parts[0]==='JP'?japanRegionLabel({code:parts[2],name:r.name}):`${stateLabel(parts[1])} · ${r.name}`;
}
