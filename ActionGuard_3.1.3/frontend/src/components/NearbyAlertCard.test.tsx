import {it,expect,vi,beforeEach} from 'vitest'
import {render,screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import NearbyAlertCard from './NearbyAlertCard'
import {useNearbyAlerts} from '../integrated/hooks/nearby-alerts'
vi.mock('../integrated/hooks/alert-assessment',()=>({useAlertAssessment:()=>({data:null,isFetching:false})}))
vi.mock('../integrated/hooks/nearby-alerts',()=>({useNearbyAlerts:vi.fn()}))
vi.mock('../integrated/hooks/workspace',()=>({useWorkspace:()=>({country:'JP',place:{name:'도쿄역',country:'JP'},alert:null})}))
beforeEach(()=>vi.resetAllMocks())
const fresh={alerts:[],checked_at:'2026-10-17T00:00:00Z'}
function show(overrides:object){vi.mocked(useNearbyAlerts).mockReturnValue({data:fresh,isError:false,isPending:false,isFetching:false,refetch:vi.fn(),...overrides} as never);render(<MemoryRouter><NearbyAlertCard/></MemoryRouter>)}
it('distinguishes no returned alerts from a statement of safety',()=>{show({});expect(screen.getByText(/안전하다는 뜻은 아닙니다/)).toBeVisible()})
it('hides cached alert actions after refresh fails and reports uncertainty',()=>{show({isError:true,data:{...fresh,alerts:[{id:'old',event:'Old Warning',area:'Old area'}]}});expect(screen.getByRole('alert')).toHaveTextContent('최신 경보를 확인하지 못했습니다');expect(screen.queryByRole('button',{name:'이 경보의 상황·행동 확인'})).toBeNull()})
it('explains the separate earthquake and tsunami coverage',()=>{show({});expect(screen.getByText(/지진·쓰나미·화산은 일본 전용 화면/)).toBeVisible()})

it('also names the primary nearby typhoon in Korean',()=>{show({data:{...fresh,alerts:[{id:'typhoon',event:'Typhoon Warning',area:'Guam'}]}});expect(screen.getByText('태풍 경보')).toBeVisible();expect(screen.getByText('Typhoon Warning')).toBeVisible()})
