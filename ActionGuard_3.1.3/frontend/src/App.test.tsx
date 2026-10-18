import {beforeEach,expect,it,vi} from 'vitest'
import {render,screen,fireEvent,within} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import {Workspace} from './integrated/hooks/workspace'
import {api} from './integrated/services/api'
import App from './App'

vi.mock('./integrated/services/api',()=>({api:vi.fn(),upload:vi.fn()}))
beforeEach(()=>{
 localStorage.clear()
 vi.resetAllMocks()
 vi.mocked(api).mockImplementation(async(path)=>{
  if(path==='health')return {ai_configured:false} as never
  if(path==='chat')return {answer:'경보 없이도 앱 안내를 도와드립니다.',sources:[],checked_at:new Date().toISOString(),mode:'evidence',actions:[{label:'일본 지진 지도',path:'/japan-disasters?tab=earthquake'},{label:'문자 해석',path:'/'}]} as never
  throw new Error('Unexpected request: '+path)
 })
})
function mount(url='/'){
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter initialEntries={[url]}><Workspace><App/></Workspace></MemoryRouter></QueryClientProvider>)
}
it('exposes every core feature without claiming a fictional current location',()=>{
 mount()
 expect(screen.getByRole('heading',{name:'번역을 한 번 더 검증합니다'})).toBeVisible()
 fireEvent.click(screen.getByRole('button',{name:'건너뛰기'}))
 expect(screen.getByRole('link',{name:'문자 해석하기'})).toHaveAttribute('href','/analyze')
 expect(screen.queryByRole('link',{name:/진앙 · 관측 진도 지도/})).toBeNull()
 fireEvent.click(screen.getByRole('button',{name:/서비스 국가 선택/}))
 fireEvent.click(screen.getByRole('button',{name:/일본 JMA/}))
 expect(screen.getByRole('link',{name:/진앙 · 관측 진도 지도/})).toHaveAttribute('href','/japan-disasters?tab=earthquake')
 expect(screen.getByRole('link',{name:/해안별 쓰나미 경보/})).toHaveAttribute('href','/japan-disasters?tab=tsunami')
 expect(screen.getByRole('link',{name:'알림 설정'})).toHaveAttribute('href','/notifications')
 expect(screen.queryByText(/현재 위치 · Houston/)).toBeNull()
 expect(within(screen.getByRole('navigation',{name:'하단 메뉴'})).getAllByRole('link')).toHaveLength(5)
})
it('allows a question before alert recognition and preserves backend action links',async()=>{
 mount('/chat')
 fireEvent.change(screen.getByRole('textbox',{name:'AI 도우미에게 질문'}),{target:{value:'이 앱으로 무엇을 할 수 있어?'}})
 fireEvent.click(screen.getByRole('button',{name:'질문 보내기'}))
 expect(await screen.findByText('경보 없이도 앱 안내를 도와드립니다.')).toBeVisible()
 const body=vi.mocked(api).mock.calls.find(([path])=>path==='chat')?.[1] as {text:string;alert_id?:string;location:unknown}
 expect(body.text).toBe('');expect(body.alert_id).toBeUndefined();expect(body.location).toBeNull()
 expect(screen.getByRole('link',{name:'일본 지진 지도 →'})).toHaveAttribute('href','/japan-disasters?tab=earthquake')
 expect(screen.getByRole('link',{name:'문자 해석 →'})).toHaveAttribute('href','/analyze')
})
it('keeps the pasted message and selected country when moving from analysis to the assistant',async()=>{
 mount('/analyze')
 const source='Do not evacuate. Shelter in place.'
 fireEvent.change(screen.getByLabelText('경보 원문'),{target:{value:source}})
 fireEvent.change(screen.getByLabelText('문자를 받은 국가'),{target:{value:'US'}})
 fireEvent.click(within(screen.getByRole('navigation',{name:'하단 메뉴'})).getByRole('link',{name:'챗봇'}))
 fireEvent.change(screen.getByRole('textbox',{name:'AI 도우미에게 질문'}),{target:{value:'이 문자의 행동을 설명해 줘'}})
 fireEvent.click(screen.getByRole('button',{name:'질문 보내기'}))
 await screen.findByText('경보 없이도 앱 안내를 도와드립니다.')
 expect(vi.mocked(api).mock.calls.find(([path])=>path==='chat')?.[1]).toMatchObject({text:source,country:'US'})
 expect(screen.queryByText('대피 이동 지시가 있습니다')).toBeNull()
})
it('never offers the Japan seismic shortcut while analyzing in the US service context',()=>{
 mount('/analyze');expect(screen.getByRole('button',{name:'서비스 국가 선택 · 현재 미국'})).toBeVisible();expect(screen.queryByRole('link',{name:/일본 지진 · 쓰나미 지도/})).toBeNull();expect(screen.queryByRole('option',{name:'일본'})).toBeNull();
})
