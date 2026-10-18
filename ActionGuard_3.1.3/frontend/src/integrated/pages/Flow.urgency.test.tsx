import {useState} from 'react';
import {it,expect,vi,beforeEach} from 'vitest';
import {render,screen,fireEvent,waitFor,within} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {Workspace,useWorkspace} from '../hooks/workspace';
import Flow from './Flow';
import {api} from '../services/api';
vi.mock('../services/api',()=>({api:vi.fn(),upload:vi.fn()}));
vi.mock('../components/TravelAssistant',()=>({default:()=>null}));
const assessment={level:4,label:'대피',action_kind:'shelter',headline:'지금 낮은 층의 실내로 대피하십시오',meaning:'원문 지시를 확인하십시오.',actions:['머리와 목을 보호하십시오.'],evidence:[],sources:[],provenance:'input',applicability:'대상 지역이라면',notice:'입력문 해석 · 발령 미확인',inactive:false,rule_version:'us-action-scale-1'};
beforeEach(()=>{vi.mocked(api).mockImplementation(async(path)=>{if(path==='urgency')return assessment as never;if(path==='guidance')return {cards:[],limitations:[],provenance:'input'} as never;throw new Error('AI 연결 필요');});});
function page(){render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Workspace><Flow/></Workspace></MemoryRouter></QueryClientProvider>);fireEvent.change(screen.getByLabelText('경보 원문'),{target:{value:'Tornado Warning'}});fireEvent.click(screen.getByRole('button',{name:'문자 이해하기'}));}
it('keeps the action scale available when AI translation fails and clears it for a new message',async()=>{
 page();expect(await screen.findByText(assessment.actions[0])).toBeVisible();expect(screen.getAllByText('원문 행동 확인')).toHaveLength(1);expect(screen.queryByRole('list',{name:'앱 행동 척도: 정보, 주의, 대비, 대피'})).toBeNull();
 await waitFor(()=>expect(screen.getByRole('button',{name:'문자 이해하기'})).toBeEnabled());
 expect(screen.getByText('AI 연결 필요')).toBeInTheDocument();
 fireEvent.click(screen.getByText('받은 문자 확인·다시 분석'));
 fireEvent.change(screen.getByLabelText('경보 원문'),{target:{value:'Heat Advisory'}});
 expect(screen.queryByText(assessment.actions[0])).toBeNull();
});
it('shows no stage when the urgency service fails while keeping the rest of the flow usable',async()=>{
 vi.mocked(api).mockImplementation(async(path)=>{if(path==='guidance')return {cards:[],limitations:[],provenance:'input'} as never;throw new Error('offline');});
 page();expect(await screen.findByText('대응 단계를 확인하지 못했습니다. 원문의 행동 지시를 확인하십시오.')).toBeVisible();
 expect(screen.queryByRole('list',{name:'앱 행동 척도: 정보, 주의, 대비, 대피'})).toBeNull();
});
it('renders a basic stage while AI is pending and keeps it when AI fails',async()=>{
 let failAi:(reason:Error)=>void=()=>{};
 vi.mocked(api).mockImplementation(async(path,body)=>{
   if(path==='urgency')return (body as {use_ai:boolean}).use_ai?await new Promise((_resolve,reject)=>{failAi=reject;}):assessment as never;
   if(path==='guidance')return {cards:[],limitations:[],provenance:'input'} as never;
   throw new Error('AI 연결 필요');
 });
 page();expect(await screen.findByText(assessment.actions[0])).toBeVisible();
 expect(within(screen.getByRole('article',{name:'지금 할 행동'})).getByText('AI 원문 해석 중 · 기본 판정을 먼저 보여드립니다')).toBeVisible();
 failAi(new Error('quota'));
 expect(await within(screen.getByRole('article',{name:'지금 할 행동'})).findByText('AI 연결을 완료하지 못해 기본 판정을 유지했습니다.')).toBeVisible();
 expect(screen.getByText(assessment.actions[0])).toBeVisible();
});

it('discards results when the lookup method changes and labels typhoons in Korean',async()=>{
 vi.mocked(api).mockImplementation(async(path)=>{if(path.startsWith('alerts?'))return {alerts:[{id:'nws:typhoon',event:'Typhoon Warning',headline:'Typhoon',area:'Guam',severity:'Severe',sender:'NWS',checked_at:new Date().toISOString()}],checked_at:new Date().toISOString()} as never;throw new Error('Unexpected '+path)});
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Workspace><Flow/></Workspace></MemoryRouter></QueryClientProvider>);
 fireEvent.click(screen.getByRole('tab',{name:'공식 경보 찾기'}));fireEvent.change(screen.getByLabelText('위도'),{target:{value:'13.46'}});fireEvent.change(screen.getByLabelText('경도'),{target:{value:'144.74'}});fireEvent.click(screen.getByRole('button',{name:'경보 찾기'}));expect(await screen.findByRole('button',{name:/태풍 경보/})).toBeVisible();
 fireEvent.change(screen.getByLabelText('조회 방식'),{target:{value:'area'}});await waitFor(()=>expect(screen.queryByRole('button',{name:/태풍 경보/})).toBeNull());
})

it('reopens the transient result without losing the action card or re-requesting AI',()=>{
 function Harness(){const ws=useWorkspace();const [show,setShow]=useState(false);return <><button onClick={()=>{ws.update('Tornado Warning');}}>Select source</button><button onClick={()=>{ws.setUrgency(assessment as never);ws.setTranslation({translation:'번역',hazard_explanation:'내용',summary:[],glossary:[]} as never);ws.setGuidance({cards:[],limitations:[]} as never);setShow(true)}}>Open saved result</button><button onClick={()=>setShow(false)}>Close result</button>{show&&<Flow/>}</>}
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Workspace><Harness/></Workspace></MemoryRouter></QueryClientProvider>);
 fireEvent.click(screen.getByText('Select source'));fireEvent.click(screen.getByText('Open saved result'));expect(screen.getByText(assessment.actions[0])).toBeVisible();
 fireEvent.click(screen.getByText('Close result'));fireEvent.click(screen.getByText('Open saved result'));expect(screen.getAllByText('원문 행동 확인')).toHaveLength(1);expect(vi.mocked(api).mock.calls.filter(([path])=>['translate','verify','urgency','guidance'].includes(path))).toHaveLength(0);
})

it('starts detailed translation once when opening an official alert result',async()=>{
 function Seed(){const ws=useWorkspace();return <><button onClick={()=>ws.update('Typhoon Warning',{id:'nws:typhoon',event:'Typhoon Warning',text:'Typhoon Warning',sender:'NWS',area:'Guam'} as never)}>Select official</button><Flow/></>}
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter initialEntries={['/analyze?mode=result']}><Workspace><Seed/></Workspace></MemoryRouter></QueryClientProvider>);
 fireEvent.click(screen.getByText('Select official'));await waitFor(()=>expect(vi.mocked(api).mock.calls.filter(([path])=>path==='translate')).toHaveLength(1));
 await waitFor(()=>expect(screen.getByRole('button',{name:'문자 이해하기'})).toBeEnabled());expect(vi.mocked(api).mock.calls.filter(([path])=>path==='translate')).toHaveLength(1);
})
