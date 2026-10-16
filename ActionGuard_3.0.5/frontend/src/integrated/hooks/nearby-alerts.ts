import {useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import {useWorkspace} from './workspace'
import {api} from '../services/api'
import type {Alert} from '../types'
export function useNearbyAlerts(){
 const ws=useWorkspace(),p=ws.place
 const result=useQuery({queryKey:['nearby-official-alerts',p?.country,p?.lat,p?.lon],queryFn:()=>api<{alerts:Alert[];checked_at:string}>('places/alerts',{country:p!.country,lat:p!.lat,lon:p!.lon,name:p!.name}),enabled:!!p,staleTime:60000,refetchInterval:60000,refetchOnWindowFocus:'always',refetchOnReconnect:'always',retry:false})
 useEffect(()=>{const fresh=result.data?.alerts.find(a=>a.id===ws.alert?.id&&a.text===ws.alert?.text);if(fresh&&fresh.checked_at!==ws.alert?.checked_at)ws.refreshAlert(fresh)},[result.data,ws.alert?.id,ws.alert?.checked_at])
 return result
}
