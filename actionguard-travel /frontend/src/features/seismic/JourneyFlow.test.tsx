import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {MemoryRouter,Routes,Route} from 'react-router-dom';
import {Workspace} from '../../hooks/workspace';
import SeismicActions from './SeismicActions';
import Shelters from '../../pages/Shelters';
vi.mock('../shelters/ShelterMap',()=>({default:()=> <div>시설 지도</div>}));
afterEach(()=>{cleanup();vi.restoreAllMocks();});
function show(example:boolean){render(<MemoryRouter initialEntries={['/japan-disasters']}><Workspace><Routes><Route path="/japan-disasters" element={<SeismicActions hazard="tsunami" eventId="official.json" position={example?{lat:35.6812,lon:139.7671,example:true}:null} onLocate={()=>{}}/>}/><Route path="/shelters" element={<Shelters/>}/></Routes></Workspace></MemoryRouter>);}
it('carries the selected hazard and explicit example into a manual facility search',async()=>{
 const fetcher=vi.fn(async(_input:RequestInfo|URL)=>new Response(JSON.stringify({origin:{lat:35.6812,lon:139.7671},country:'JP',disaster:'tsunami',shelters:[],radius_km:5,warnings:[],note:'test',checked_at:new Date().toISOString(),source:'https://www.gsi.go.jp/'})));vi.stubGlobal('fetch',fetcher);
 show(true);fireEvent.click(screen.getByRole('link',{name:'쓰나미 지정 대피장소 찾기 →'}));expect(fetcher).not.toHaveBeenCalled();expect(screen.getByLabelText('재난 유형')).toHaveValue('tsunami');expect(screen.getByLabelText('시설 조회 국가')).toHaveValue('JP');expect(screen.getByLabelText('위도')).toHaveValue(35.6812);expect(screen.getByRole('status')).toHaveTextContent('실제 위치로 바꾼 뒤');expect(screen.getByRole('link',{name:'← 지진·쓰나미 정보로 돌아가기'})).toHaveAttribute('href','/japan-disasters?tab=tsunami&event=official.json');fireEvent.click(screen.getByText('이 위치 주변 시설 찾기'));await screen.findByText('표시 0곳 / 조회 시설 0곳');expect(String(fetcher.mock.calls[0]?.[0])).toContain('disaster=tsunami');
});
it('keeps missing-location handoffs clearly distinct from actual GPS',()=>{show(false);fireEvent.click(screen.getByRole('link',{name:'쓰나미 지정 대피장소 찾기 →'}));expect(screen.getByRole('status')).toHaveTextContent('내 위치가 전달되지 않았습니다');});
