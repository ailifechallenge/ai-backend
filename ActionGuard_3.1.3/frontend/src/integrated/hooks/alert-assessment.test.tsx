import {it,expect,vi,beforeEach} from 'vitest'
import {render,screen} from '@testing-library/react'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import {useAlertAssessment} from './alert-assessment'
import {ResponseBadge} from '../../components/AlertIdentity'
import {api} from '../services/api'
import type {Alert} from '../types'
vi.mock('../services/api',()=>({api:vi.fn()}))
const a={id:'nws:typhoon',text:'Typhoon Warning. Complete final preparations.',event:'Typhoon Warning'} as Alert
function Subject(){const q=useAlertAssessment(a);return <ResponseBadge assessment={q.data} pending={q.isFetching}/>}
beforeEach(()=>vi.resetAllMocks())
it('shares one AI request for the same alert and sends source evidence without registered coordinates',async()=>{
 vi.mocked(api).mockResolvedValue({level:3,method:'ai',inactive:false} as never)
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><Subject/><Subject/></QueryClientProvider>)
 expect(await screen.findAllByText('AI 행동 해석')).toHaveLength(2);expect(api).toHaveBeenCalledTimes(1);expect(api).toHaveBeenCalledWith('urgency',{text:a.text,alert_id:a.id,country:'US',use_ai:true})
})
it('shows uncertainty after an AI request fails instead of inferring a stage from the warning title',async()=>{
 vi.mocked(api).mockRejectedValue(new Error('offline'))
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><Subject/></QueryClientProvider>)
 expect(await screen.findByText('원문 행동 확인')).toBeVisible();expect(screen.queryByText('4단계 · 대피')).toBeNull()
})
