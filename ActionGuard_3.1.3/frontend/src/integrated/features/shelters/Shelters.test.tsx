import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {Workspace} from '../../hooks/workspace';
import Shelters from '../../pages/Shelters';
vi.mock('./ShelterMap',()=>({default:({shelters,route,onSelect}:any)=><div data-testid="map" data-route={String(route)}>{shelters.map((s:any)=><button key={s.id} onClick={()=>onSelect(s.id)}>pin {s.name}</button>)}</div>}));
const school={id:'1',name:'FICTIONAL School',address:'1 Test St',lat:40.75,lon:-73.99,status:'planned',status_label:'현장 개방 확인 필요',shelter_type:'school',type_label:'학교·교육시설',distance_m:100,bearing_deg:0,direction:'북',wheelchair_accessible:'확인되지 않음',pets:'확인되지 않음',source:'https://data.cityofnewyork.us/',checked_at:'2026-10-15T00:00:00Z',source_updated_at:null};
const church={...school,id:'2',name:'FICTIONAL Church',status:'registered',navigable:false,shelter_type:'religious',type_label:'종교시설',status_label:'등록 이력 · CLOSED · 입소 목적지 제외'};
const result={origin:{lat:40.758,lon:-73.9855},radius_km:50,disaster:'hurricane',shelters:[school,church],checked_at:school.checked_at,source:'https://gis.fema.gov/',sources:[],warnings:[],note:'공식 자료',truncated:false};
function show(){render(<MemoryRouter><Workspace><Shelters/></Workspace></MemoryRouter>);}
beforeEach(()=>{localStorage.clear();vi.restoreAllMocks();vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify(result))));Object.defineProperty(navigator,'onLine',{configurable:true,value:true});});
describe('separate shelter explorer',()=>{
 it('keeps the unopened facility status visible while allowing an explicit location route',async()=>{
  const reference={...school,reference_only:true,navigable:false,status:'planned',status_label:'허리케인 지정 · 개방 미확인',supported_hazards:['hurricane']};
  vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({...result,country:'US',disaster:'general',shelters:[reference]})));
  show();fireEvent.click(screen.getByText('등록 위치 주변 시설 찾기'));
  await screen.findByText('pin FICTIONAL School');fireEvent.click(screen.getByText('pin FICTIONAL School'));
  expect(screen.queryByText('운영 중으로 조회된 시설 0곳 · 지정시설 참고자료 1곳')).not.toBeInTheDocument();
  expect(screen.getByText(/현재 개방 여부는 확인되지 않았습니다/)).toBeInTheDocument();
  expect(screen.getByRole('link',{name:'이 시설까지 길찾기 →'})).toBeInTheDocument();
  expect(screen.getByText(/현재 개방·입소 가능 여부는 별도로 확인/)).toBeInTheDocument();
 });
 it('uses the assistants queried coordinates instead of silently reverting to the default example',async()=>{
  render(<MemoryRouter initialEntries={['/shelters?country=US&lat=40.6892532&lon=-74.0445482&disaster=general']}><Workspace><Shelters/></Workspace></MemoryRouter>);
  fireEvent.click(screen.getByText('등록 위치 주변 시설 찾기'));
  await screen.findByText('pin FICTIONAL School');
  expect(String(vi.mocked(fetch).mock.calls[0][0])).toContain('lat=40.6892532&lon=-74.0445482');
 });
 it('queries full map and never automatically requests a route',async()=>{show();fireEvent.click(screen.getByText('등록 위치 주변 시설 찾기'));await screen.findByText('pin FICTIONAL Church');expect(fetch).toHaveBeenCalledTimes(1);expect(String(vi.mocked(fetch).mock.calls[0][0])).toContain('lat=40.758&lon=-73.9855&radius_km=10&disaster=general&include_registered=false');expect(screen.getByTestId('map')).toHaveAttribute('data-route','null');});
 it('filters facility types on the whole map',async()=>{show();fireEvent.click(screen.getByText('등록 위치 주변 시설 찾기'));await screen.findByText('pin FICTIONAL Church');fireEvent.change(screen.getByLabelText('시설 유형'),{target:{value:'religious'}});expect(screen.queryByText('pin FICTIONAL School')).not.toBeInTheDocument();expect(screen.getByText('pin FICTIONAL Church')).toBeInTheDocument();});
 it('allows an explicit route to a reference location without claiming it is open',async()=>{show();fireEvent.click(screen.getByText('등록 위치 주변 시설 찾기'));await screen.findByText('pin FICTIONAL Church');fireEvent.click(screen.getByText('pin FICTIONAL Church'));expect(screen.getByRole('link',{name:'이 시설까지 길찾기 →'})).toHaveAttribute('href',expect.stringContaining('view=route'));expect(screen.getByText(/현재 개방·입소 가능 여부는 별도로 확인/)).toBeInTheDocument();expect(screen.queryByText(/현재 운영 중으로 확인되지 않아/)).not.toBeInTheDocument();});
 it('passes user start and chosen destination to separate navigation',async()=>{show();fireEvent.click(screen.getByText('등록 위치 주변 시설 찾기'));await screen.findByText('pin FICTIONAL School');fireEvent.click(screen.getByText('pin FICTIONAL School'));expect(screen.getByText('이 시설까지 길찾기 →')).toHaveAttribute('href','/shelters?view=route&from=40.758%2C-73.9855&to=40.75%2C-73.99&name=FICTIONAL+School&country=US');expect(fetch).toHaveBeenCalledTimes(1);});
 it('rejects the screenshot coordinate typo before querying',async()=>{show();fireEvent.change(screen.getByLabelText('공통 위치 위도'),{target:{value:'4.758'}});fireEvent.change(screen.getByLabelText('공통 위치 경도'),{target:{value:'-73.9855'}});fireEvent.click(screen.getByText('이 위치 등록하기'));expect(await screen.findByRole('alert')).toHaveTextContent('선택한 국가 안의 위치');expect(fetch).not.toHaveBeenCalled();});
 it('saves a list snapshot without a route',async()=>{show();fireEvent.click(screen.getByText('등록 위치 주변 시설 찾기'));await screen.findByText('pin FICTIONAL School');fireEvent.click(screen.getByText('목록 오프라인 저장'));expect(JSON.parse(localStorage.getItem('actionguard.f4.snapshot.v1')||'{}').route).toBeNull();});
});
it('requires a fresh lookup before routing from an offline snapshot',async()=>{
 show();fireEvent.click(screen.getByText('등록 위치 주변 시설 찾기'));await screen.findByText('pin FICTIONAL School');
 fireEvent.click(screen.getByText('목록 오프라인 저장'));fireEvent.click(screen.getByText('저장본 불러오기'));
 fireEvent.click(screen.getByText('pin FICTIONAL School'));
 expect(screen.queryByText('이 시설까지 길찾기 →')).not.toBeInTheDocument();
 expect(screen.getByText(/저장본은 현재 상태를 다시 조회한 뒤/)).toBeInTheDocument();
});

it('queries the fresh GPS point in one click instead of the old map point',async()=>{
 let success:PositionCallback=()=>{};
 Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:vi.fn(cb=>{success=cb})}})
 show();fireEvent.click(screen.getByRole('button',{name:'현 위치 주변 시설 찾기'}));
 expect(fetch).not.toHaveBeenCalled();success({coords:{latitude:34.0522,longitude:-118.2437}} as GeolocationPosition)
 await screen.findByText('pin FICTIONAL School');expect(String(vi.mocked(fetch).mock.calls[0][0])).toContain('lat=34.0522&lon=-118.2437')
})
it('does not send another countrys GPS coordinates to a US shelter query',async()=>{
 Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:vi.fn(cb=>cb({coords:{latitude:35.68,longitude:139.76}}))}})
 show();fireEvent.click(screen.getByRole('button',{name:'현 위치 주변 시설 찾기'}));expect(await screen.findByRole('alert')).toHaveTextContent('선택한 국가 밖');expect(fetch).not.toHaveBeenCalled()
})
it('discards a delayed GPS callback after search settings change',async()=>{
 let success:PositionCallback=()=>{};
 Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:vi.fn(cb=>{success=cb})}})
 show();fireEvent.click(screen.getByRole('button',{name:'현 위치 주변 시설 찾기'}));
 fireEvent.change(screen.getByLabelText('검색 반경'),{target:{value:'5'}})
 success({coords:{latitude:34.0522,longitude:-118.2437}} as GeolocationPosition)
 expect(fetch).not.toHaveBeenCalled();fireEvent.click(screen.getByText('등록 위치 주변 시설 찾기'));await screen.findByText('pin FICTIONAL School');expect(String(vi.mocked(fetch).mock.calls[0][0])).toContain('lat=40.758&lon=-73.9855')
})
