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
 fireEvent.change(screen.getByLabelText('장소의 현지 시간대'),{target:{value:'America/Los_Angeles'}});
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
 fireEvent.click(screen.getByRole('button',{name:'질문 보내기'}));
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

it('uses the last resolved place for a follow-up without overwriting the shared place',async()=>{
 const place={name:'도쿄역',country:'JP',lat:35.6808,lon:139.7669};
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({answer:'도쿄역 주변 조회',sources:[],checked_at:new Date().toISOString(),mode:'live',intent:'shelters',query_location:place}))));
 render(<Subject text="" alert={null} country="unknown"/>);
 fireEvent.change(screen.getByLabelText('AI 도우미에게 질문'),{target:{value:'도쿄역 주변 대피소 알려줘'}});fireEvent.click(screen.getByRole('button',{name:'질문 보내기'}));
 await screen.findByText('도쿄역 주변 조회');
 fireEvent.change(screen.getByLabelText('AI 도우미에게 질문'),{target:{value:'그럼 지진용으로 찾아줘'}});fireEvent.click(screen.getByRole('button',{name:'질문 보내기'}));
 await waitFor(()=>expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2));
 expect(JSON.parse(String(vi.mocked(fetch).mock.calls[1][1]?.body)).location).toEqual(place);
 expect(screen.getByText('조회 위치를 아직 등록하지 않았어요')).toBeInTheDocument();
});
it('lets users select an ambiguous place and submits the same question with that choice',async()=>{
 const place={name:'중앙역',country:'JP',lat:35.68,lon:139.76};
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({answer:'검색 장소를 선택하세요.',sources:[],checked_at:new Date().toISOString(),mode:'clarify',intent:'shelters',place_candidates:[{location:place,label:'중앙역 A · 도쿄',approximate:false,source:'https://maps.gsi.go.jp/'}]}))));
 render(<Subject text="" alert={null} country="unknown"/>);
 fireEvent.change(screen.getByLabelText('AI 도우미에게 질문'),{target:{value:'중앙역 주변 대피소'}});fireEvent.click(screen.getByRole('button',{name:'질문 보내기'}));
 await screen.findByText('중앙역 A · 도쿄');
 fireEvent.click(screen.getByRole('button',{name:/중앙역 A · 도쿄/}));
 await waitFor(()=>expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2));
 const payload=JSON.parse(String(vi.mocked(fetch).mock.calls[1][1]?.body));
 expect(payload.place_selection).toEqual(place);expect(payload.question).toBe('중앙역 주변 대피소');
});
it('lets a user register an itinerary before receiving an alert without claiming an overlap',async()=>{
 render(<MemoryRouter initialEntries={['/itinerary']}><Workspace><TravelAssistant text="" alert={null} country="US"/></Workspace></MemoryRouter>);
 fill();fireEvent.click(screen.getByRole('button',{name:'일정 등록하기'}));
 expect(screen.queryByRole('textbox',{name:'AI 도우미에게 질문'})).not.toBeInTheDocument();
 expect(await screen.findByRole('status')).toHaveTextContent('일정을 등록했어요.');
 expect(screen.getByText('등록한 장소:',{exact:false})).toHaveTextContent('숙소');
 expect(vi.mocked(fetch)).not.toHaveBeenCalled();
 expect(screen.queryByText('겹침 확인',{exact:true})).not.toBeInTheDocument();
});
it('rejects an itinerary whose end precedes its start before calling the API',()=>{
 render(<Subject {...props}/>);fill();
 fireEvent.change(screen.getByLabelText('체류 종료'),{target:{value:'2026-10-15T11:00'}});
 fireEvent.click(screen.getByRole('button',{name:'장소 등록하고 겹침 확인'}));
 expect(screen.getByRole('alert')).toHaveTextContent('체류 종료는 시작 시간보다 뒤로');
 expect(vi.mocked(fetch)).not.toHaveBeenCalled();
});

it('does not replace the shared lookup or clear an official alert when saving a different itinerary',async()=>{
 function Context(){const ws=useWorkspace();return <><button onClick={()=>{ws.setPlace({name:'Tokyo',country:'JP',lat:35.68,lon:139.76});ws.update('Heat Advisory',{id:'nws:heat',text:'Heat Advisory',event:'Heat Advisory'} as never)}}>Setup</button><span>lookup:{ws.place?.name}</span><span>source:{ws.alert?.id}</span><TravelAssistant text={ws.text} alert={ws.alert} country="US"/></>}
 render(<MemoryRouter initialEntries={['/itinerary']}><Workspace><Context/></Workspace></MemoryRouter>);fireEvent.click(screen.getByText('Setup'));fill();fireEvent.change(screen.getByLabelText('장소의 현지 시간대'),{target:{value:'Asia/Tokyo'}});fireEvent.change(screen.getByLabelText('위도'),{target:{value:'35.7'}});fireEvent.change(screen.getByLabelText('경도'),{target:{value:'139.8'}});fireEvent.click(screen.getByRole('button',{name:'장소 등록하고 겹침 확인'}));await screen.findByText('판정 불가');expect(screen.getByText('lookup:Tokyo')).toBeVisible();expect(screen.getByText('source:nws:heat')).toBeVisible();
})
it('rejects a manually mismatched country/timezone even before an alert is connected',()=>{
 render(<MemoryRouter initialEntries={['/itinerary']}><Workspace><TravelAssistant text="" alert={null} country="US"/></Workspace></MemoryRouter>);fill();fireEvent.change(screen.getByLabelText('장소의 현지 시간대'),{target:{value:'Asia/Tokyo'}});fireEvent.click(screen.getByRole('button',{name:'일정 등록하기'}));expect(screen.queryByRole('option',{name:'일본 · 도쿄'})).toBeNull();expect(screen.getByRole('alert')).toHaveTextContent('현지 시간대');expect(fetch).not.toHaveBeenCalled();
})
it('keeps itinerary place search fixed to the header country even with an obsolete US country hint',()=>{
 localStorage.setItem('ag-country','JP');render(<MemoryRouter initialEntries={['/itinerary']}><Workspace><TravelAssistant text="" alert={null} country="US"/></Workspace></MemoryRouter>);for(const label of screen.getAllByText('조회 국가'))expect(label.parentElement).toHaveTextContent('일본');expect(screen.queryByRole('option',{name:'미국'})).toBeNull();expect(screen.getByLabelText('장소의 현지 시간대')).toHaveValue('Asia/Tokyo');
});
