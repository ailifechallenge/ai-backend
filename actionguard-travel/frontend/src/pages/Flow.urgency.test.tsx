import {it,expect,vi,beforeEach} from 'vitest';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {Workspace} from '../hooks/workspace';
import Flow from './Flow';
import {api} from '../services/api';
vi.mock('../services/api',()=>({api:vi.fn(),upload:vi.fn()}));
vi.mock('../components/TravelAssistant',()=>({default:()=>null}));
const assessment={level:4,label:'대피',action_kind:'shelter',headline:'지금 낮은 층의 실내로 대피하세요',meaning:'원문 지시를 확인하세요.',actions:['머리와 목을 보호하세요.'],evidence:[],sources:[],provenance:'input',applicability:'대상 지역이라면',notice:'입력문 해석 · 발령 미확인',inactive:false,rule_version:'us-action-scale-1'};
beforeEach(()=>{vi.mocked(api).mockImplementation(async(path)=>{if(path==='urgency')return assessment as never;if(path==='guidance')return {cards:[],limitations:[],provenance:'input'} as never;throw new Error('AI 연결 필요');});});
function page(){render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Workspace><Flow/></Workspace></MemoryRouter></QueryClientProvider>);fireEvent.change(screen.getByLabelText('경보 원문'),{target:{value:'Tornado Warning'}});fireEvent.click(screen.getByRole('button',{name:'문자 이해하기'}));}
it('keeps the action scale available when AI translation fails and clears it for a new message',async()=>{
 page();expect(await screen.findByRole('heading',{name:assessment.headline})).toBeVisible();
 await waitFor(()=>expect(screen.getByRole('button',{name:'문자 이해하기'})).toBeEnabled());
 expect(screen.getByText('AI 연결 필요')).toBeInTheDocument();
 fireEvent.click(screen.getByText('받은 문자 확인·다시 분석'));
 fireEvent.change(screen.getByLabelText('경보 원문'),{target:{value:'Heat Advisory'}});
 expect(screen.queryByRole('heading',{name:assessment.headline})).toBeNull();
});
it('shows no stage when the urgency service fails while keeping the rest of the flow usable',async()=>{
 vi.mocked(api).mockImplementation(async(path)=>{if(path==='guidance')return {cards:[],limitations:[],provenance:'input'} as never;throw new Error('offline');});
 page();expect(await screen.findByText('대응 단계를 확인하지 못했어요. 원문의 행동 지시를 확인하세요.')).toBeVisible();
 expect(screen.queryByRole('list',{name:'앱 행동 척도: 정보, 주의, 대비, 대피'})).toBeNull();
});
it('renders a basic stage while AI is pending and keeps it when AI fails',async()=>{
 let failAi:(reason:Error)=>void=()=>{};
 vi.mocked(api).mockImplementation(async(path,body)=>{
   if(path==='urgency')return (body as {use_ai:boolean}).use_ai?await new Promise((_resolve,reject)=>{failAi=reject;}):assessment as never;
   if(path==='guidance')return {cards:[],limitations:[],provenance:'input'} as never;
   throw new Error('AI 연결 필요');
 });
 page();expect(await screen.findByRole('heading',{name:assessment.headline})).toBeVisible();
 expect(screen.getByText('AI 원문 해석 중 · 기본 판정을 먼저 보여드려요')).toBeVisible();
 failAi(new Error('quota'));
 expect(await screen.findByText('AI 연결을 완료하지 못해 기본 판정을 유지했어요.')).toBeVisible();
 expect(screen.getByRole('heading',{name:assessment.headline})).toBeVisible();
});
