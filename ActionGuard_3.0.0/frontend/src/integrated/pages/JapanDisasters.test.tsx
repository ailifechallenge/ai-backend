import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import JapanDisasters from './JapanDisasters';
import {api} from '../services/api';
vi.mock('../services/api',()=>({api:vi.fn()}));
vi.mock('../features/seismic/SeismicMap',()=>({default:({bulletin}:{bulletin?:{id:string}|null})=><div data-testid="coast-map">{bulletin?.id??'no-colored-bulletin'}</div>}));
const bulletin={id:'official',issued_at:new Date().toISOString(),valid_until:null,current:false,cancelled:false,regions:[],epicenter:null,source_url:'https://www.jma.go.jp/'};
let response:Record<string,unknown>;
beforeEach(()=>{response={bulletin:{...bulletin},checked_at:new Date().toISOString(),status:'no_current_bulletin',clear_at:new Date().toISOString()};vi.mocked(api).mockImplementation(async(path)=>{if(path==='japan/tsunami')return response as never;if(path==='japan/tsunami-coasts')return {type:'FeatureCollection',features:[]} as never;return {events:[],checked_at:new Date().toISOString()} as never;});});
afterEach(cleanup);
function page(){render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter initialEntries={['/japan-disasters?tab=tsunami']}><JapanDisasters/></MemoryRouter></QueryClientProvider>);}
it('never colors historical coasts until explicitly opened',async()=>{page();expect(await screen.findByTestId('coast-map')).toHaveTextContent('no-colored-bulletin');fireEvent.click(screen.getByText('최근 과거 발표 보기'));expect(screen.getByTestId('coast-map')).toHaveTextContent('official');expect(screen.getByText('과거 발표 · 현재 경보 아님')).toBeVisible();fireEvent.click(screen.getByText('과거 발표 닫기'));expect(screen.getByTestId('coast-map')).toHaveTextContent('no-colored-bulletin');});
it('hides warning colors when a cached current status is stale',async()=>{response={...response,checked_at:new Date(Date.now()-180000).toISOString(),bulletin:{...bulletin,current:true}};page();expect(await screen.findByTestId('coast-map')).toHaveTextContent('no-colored-bulletin');expect(screen.getByText('최신 상태 재확인 필요')).toBeVisible();});
it('expires a bulletin on the client even before the next fetch',async()=>{response={...response,bulletin:{...bulletin,current:true,valid_until:new Date(Date.now()-1000).toISOString()}};page();expect(await screen.findByTestId('coast-map')).toHaveTextContent('no-colored-bulletin');});
it('shows the current bulletin without needing an archive click',async()=>{response={...response,bulletin:{...bulletin,current:true}};page();expect(await screen.findByTestId('coast-map')).toHaveTextContent('official');expect(screen.getByText('현재 유효한 쓰나미 발표가 있어요')).toBeVisible();expect(screen.queryByText('최근 과거 발표 보기')).toBeNull();});
it('requires an explicit current-coast selection before presenting warning actions',async()=>{
 response={...response,bulletin:{...bulletin,current:true,regions:[{code:'100',name:'北海道太平洋沿岸東部',level:'warning',kind_code:'51',height:'3',arrival_at:null,arrival_condition:null}]}};
 page();await screen.findByTestId('coast-map');expect(screen.getByText('쓰나미에 대비해 알아두세요')).toBeVisible();
 fireEvent.change(screen.getByLabelText('내가 있는 해안 선택'),{target:{value:'official:100'}});expect(screen.getByText('해당 경보 해안에 있다면')).toBeVisible();expect(screen.getByText(/해제될 때까지 안전한 곳에서 대피를 유지/)).toBeVisible();
});

it('does not silently replace an expired notification earthquake with another event',async()=>{
 const latest={id:'new-event',event_id:'new',issued_at:new Date().toISOString(),occurred_at:new Date().toISOString(),place:'千葉県',magnitude:3,max_intensity:'1',epicenter:null,cancelled:false};
 vi.mocked(api).mockImplementation(async(path)=>path==='japan/earthquakes'?{events:[latest],checked_at:new Date().toISOString()} as never:response as never);
 render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={['/japan-disasters?tab=earthquake&event=expired']}><JapanDisasters/></MemoryRouter></QueryClientProvider>);
 expect(await screen.findByText(/선택한 알림의 지진은 현재 제공 목록/)).toBeVisible();expect(vi.mocked(api).mock.calls.some(([path])=>path.startsWith('japan/earthquakes/'))).toBe(false);
});
it('shows official cancellation when tapping a previously delivered event',async()=>{
 vi.mocked(api).mockImplementation(async(path)=>path==='japan/earthquakes'?{events:[],cancelled_events:[{id:'cancelled-version',event_id:'20261015141019',cancelled:true}],checked_at:new Date().toISOString()} as never:response as never);
 render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={['/japan-disasters?tab=earthquake&event=20261015141311_20261015141019_VXSE5k_1.json']}><JapanDisasters/></MemoryRouter></QueryClientProvider>);
 expect(await screen.findByText('선택한 지진 발표가 취소되었습니다. 최신 공식 정보를 확인하세요.')).toBeVisible();expect(vi.mocked(api).mock.calls.some(([p])=>p.startsWith('japan/earthquakes/'))).toBe(false);
});
