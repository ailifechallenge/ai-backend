import {beforeEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import {Workspace,useWorkspace} from '../hooks/workspace';
import {MemoryRouter} from 'react-router-dom';
import TravelAssistant from './TravelAssistant';
function Subject(p:React.ComponentProps<typeof TravelAssistant>){return <MemoryRouter><Workspace><TravelAssistant {...p}/></Workspace></MemoryRouter>;}
const props={text:'Flood Warning',alert:null,country:'US' as const};
const conflict={status:'판정 불가',reasons:['공식 경보를 선택하세요.'],checked_at:'2026-10-15T00:00:00Z',source:null,interval_utc:[]};
beforeEach(()=>{vi.stubGlobal('fetch',vi.fn(async(url:string)=>new Response(JSON.stringify(url.endsWith('/conflict')?conflict:{answer:'종료 시각을 확인할 수 없습니다.',sources:[],checked_at:'now',mode:'rule'}),{status:200})));});
function fill(){
 fireEvent.change(screen.getByLabelText('장소 이름'),{target:{value:'숙소'}});
 fireEvent.change(screen.getByLabelText('위도'),{target:{value:'34.05'}});
 fireEvent.change(screen.getByLabelText('경도'),{target:{value:'-118.24'}});
 fireEvent.change(screen.getByLabelText('체류 시작'),{target:{value:'2026-10-16T15:00'}});
 fireEvent.change(screen.getByLabelText('체류 종료'),{target:{value:'2026-10-17T11:00'}});
}
it('registers a stay with explicit local timezone and sends it to rule-based chat',async()=>{
 render(<Subject {...props}/>);fill();
 fireEvent.click(screen.getByText('장소 등록하고 겹침 확인'));
 await screen.findByText('등록한 장소:',{exact:false});
 fireEvent.click(screen.getByText('내 숙소 일정이 겹치나요?'));
 await screen.findByText('종료 시각을 확인할 수 없습니다.');
 const request=vi.mocked(fetch).mock.calls.find(([url])=>String(url).endsWith('/chat'));
 expect(JSON.parse(String(request?.[1]?.body)).stay).toMatchObject({name:'숙소',latitude:34.05,timezone:'America/Los_Angeles',start:'2026-10-16T15:00'});
});
it('invalidates a saved comparison after changing the itinerary',async()=>{
 render(<Subject {...props}/>);fill();fireEvent.click(screen.getByText('장소 등록하고 겹침 확인'));
 await screen.findByText('판정 불가');
 fireEvent.change(screen.getByLabelText('위도'),{target:{value:'35'}});
 expect(screen.queryByText('판정 불가')).not.toBeInTheDocument();
 expect(screen.queryByText('등록한 장소:',{exact:false})).not.toBeInTheDocument();
});
it('discards a delayed answer from a previous alert',async()=>{
 let resolve!:(r:Response)=>void;
 vi.stubGlobal('fetch',vi.fn(()=>new Promise<Response>(r=>{resolve=r;})));
 const {rerender}=render(<Subject {...props}/>);
 fireEvent.click(screen.getByText('언제 끝나나요?'));
 rerender(<Subject {...props} text="New warning"/>);
 resolve(new Response(JSON.stringify({answer:'OLD ANSWER',sources:[],mode:'rule',checked_at:'now'}),{status:200}));
 await waitFor(()=>expect(screen.getByText('언제 끝나나요?')).not.toBeDisabled());
 expect(screen.queryByText('OLD ANSWER')).not.toBeInTheDocument();
});
it('keeps the failed question for retry and shows it while waiting',async()=>{
 let reject!:(e:Error)=>void;
 vi.stubGlobal('fetch',vi.fn(()=>new Promise((_resolve,r)=>{reject=r;})));
 render(<Subject {...props}/>);
 fireEvent.click(screen.getByText('차로 이동할 때 주의할 점은?'));
 expect(screen.getByRole('status')).toHaveTextContent('차로 이동할 때 주의할 점은?');
 reject(new TypeError('offline'));
 await waitFor(()=>expect(screen.getByLabelText('AI 도우미에게 질문')).toHaveValue('차로 이동할 때 주의할 점은?'));
 expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
it('sends followup history and can start a fresh conversation',async()=>{
 render(<Subject {...props}/>);
 fireEvent.click(screen.getByText('언제 끝나나요?'));
 await screen.findByText('종료 시각을 확인할 수 없습니다.');
 fireEvent.change(screen.getByLabelText('AI 도우미에게 질문'),{target:{value:'그럼 내일은?'}});
 fireEvent.click(screen.getByText('질문 보내기'));
 await waitFor(()=>expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2));
 const body=JSON.parse(String(vi.mocked(fetch).mock.calls[1][1]?.body));
 expect(body.history).toEqual([{role:'user',text:'언제 끝나나요?'},{role:'assistant',text:'종료 시각을 확인할 수 없습니다.'}]);
 await waitFor(()=>expect(screen.getByText('대화 새로 시작')).not.toBeDisabled());
 fireEvent.click(screen.getByText('대화 새로 시작'));
 expect(screen.queryByText('종료 시각을 확인할 수 없습니다.')).not.toBeInTheDocument();
});

it('can recheck an already saved stay without losing the response',async()=>{
 render(<Subject {...props}/>);fill();fireEvent.click(screen.getByText('장소 등록하고 겹침 확인'));
 await screen.findByText('판정 불가');
 fireEvent.click(screen.getByText('장소 등록하고 겹침 확인'));
 await screen.findByText('판정 불가');
 expect(screen.getByText('언제 끝나나요?')).not.toBeDisabled();
 expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
});
function ChangePlace(){const ws=useWorkspace();return <button onClick={()=>ws.setPlace({name:'Tokyo',country:'JP',lat:35.68,lon:139.76})}>Change location</button>;}
it('discards a pending answer and unlocks chat when the shared place changes',async()=>{
 let resolve!:(r:Response)=>void;
 vi.stubGlobal('fetch',vi.fn(()=>new Promise<Response>(r=>{resolve=r;})));
 render(<MemoryRouter><Workspace><ChangePlace/><TravelAssistant {...props}/></Workspace></MemoryRouter>);
 fireEvent.click(screen.getByText('언제 끝나나요?'));
 fireEvent.click(screen.getByText('Change location'));
 expect(screen.getByText('언제 끝나나요?')).not.toBeDisabled();
 resolve(new Response(JSON.stringify({answer:'OLD LOCATION',sources:[],mode:'rule',checked_at:'now'})));
 await waitFor(()=>expect(screen.queryByText('OLD LOCATION')).not.toBeInTheDocument());
 expect(screen.getByLabelText('장소 이름')).toHaveValue('Tokyo');
});

it('allows app-wide help before any alert and does not request GPS automatically',async()=>{
 const gps=vi.fn();vi.stubGlobal('navigator',{...navigator,geolocation:{getCurrentPosition:gps}});
 render(<Subject text="" alert={null} country="unknown"/>);
 expect(screen.getByLabelText('AI 도우미에게 질문')).not.toBeDisabled();
 fireEvent.click(screen.getByText('이 앱으로 무엇을 할 수 있어?'));
 await screen.findByText('종료 시각을 확인할 수 없습니다.');
 const request=JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body));
 expect(request.text).toBe('');expect(request.question).toContain('무엇을');expect(gps).not.toHaveBeenCalled();
});
it('shows actual facility cards and links from a pre-alert tool response',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({answer:'조회 목록에서 찾았어요.',sources:[],checked_at:new Date().toISOString(),mode:'live',intent:'shelters',items:[{kind:'shelter',title:'공식 시설 A',detail:'주소 확인',status:'개방 확인 필요',source:'https://www.gsi.go.jp/',path:'/shelters?country=JP',distance_m:130}],actions:[{label:'알림 설정',path:'/notifications'}],tools_used:['공식 시설 조회']}))));
 render(<Subject text="" alert={null} country="JP"/>);
 fireEvent.click(screen.getByText('가장 가까운 대피소를 알려줘'));
 await screen.findByText('1. 공식 시설 A');
 expect(screen.getByText('직선거리 130m')).toBeInTheDocument();
 expect(screen.getByText('지도·일반 경로 보기')).toHaveAttribute('href','/shelters?country=JP');
 expect(screen.getByText('알림 설정 →')).toHaveAttribute('href','/notifications');
});
