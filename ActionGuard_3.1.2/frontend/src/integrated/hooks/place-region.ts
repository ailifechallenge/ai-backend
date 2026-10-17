import {useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import {useWorkspace} from './workspace'
import {api} from '../services/api'
import {US_STATES} from '../features/regions/labels'
import type {JourneyPlace} from './journey'
export function usePlaceRegion(){
 const ws=useWorkspace(),p=ws.place
 const result=useQuery({queryKey:['place-region',p?.country,p?.lat,p?.lon],enabled:!!p&&p.country==='US'&&!p.regionCode,queryFn:()=>api<{region_code?:string|null}>('places/metadata',{name:p!.name,country:p!.country,lat:p!.lat,lon:p!.lon}),retry:false,staleTime:86400000})
 useEffect(()=>{const code=result.data?.region_code,region=US_STATES.find(s=>s.code===code);if(p&&p.country==='US'&&region&&!p.regionCode)ws.setPlace({...p,regionCode:region.code,regionName:region.ko_name})},[result.data,p?.country,p?.lat,p?.lon,p?.regionCode])
}
const cities:Record<string,string>={'agana':'아가나','hagatna':'아가나','hagåtña':'아가나','los angeles':'로스앤젤레스','new york':'뉴욕','new york city':'뉴욕','san francisco':'샌프란시스코','chicago':'시카고','seattle':'시애틀','washington':'워싱턴','tokyo':'도쿄'}
export function placeDisplay(p:JourneyPlace){
 const name=cities[p.name.trim().toLocaleLowerCase()]??p.name,region=US_STATES.find(s=>s.code===p.regionCode)
 return region&&!name.includes(region.ko_name)&&!name.toLowerCase().includes(region.en_name.toLowerCase())?`${name} · ${region.ko_name}`:name
}
export function placeCountry(p:JourneyPlace){return p.country==='JP'?'일본':['GU','MP','PR','VI','AS'].includes(p.regionCode??'')?'미국령':'미국'}
