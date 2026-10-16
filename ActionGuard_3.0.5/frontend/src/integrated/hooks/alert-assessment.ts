import {useQuery} from '@tanstack/react-query'
import {api} from '../services/api'
import type {Alert,UrgencyAssessment} from '../types'
export function useAlertAssessment(a:Alert|null|undefined,enabled=true){
 return useQuery({queryKey:['alert-ai-assessment',a?.id,a?.text,a?.id.startsWith('jma:')?'JP':'US'],enabled:!!a&&enabled,queryFn:()=>api<UrgencyAssessment>('urgency',{text:a!.text,alert_id:a!.id,country:a!.id.startsWith('jma:')?'JP':'US',use_ai:true}),staleTime:300000,gcTime:600000,retry:false,refetchOnWindowFocus:false})
}
