import {Workspace} from '../../hooks/workspace'
import {beforeEach,it,expect,vi} from 'vitest'
import {render,screen,fireEvent,waitFor} from '@testing-library/react'
import PlacePicker from './PlacePicker'
import {api} from '../../services/api'
vi.mock('../../services/api',()=>({api:vi.fn()}))
vi.mock('../shelters/ShelterMap',()=>({default:()=> <div>確認用地図</div>}))
const row={location:{name:'도쿄역',country:'JP',lat:35.68,lon:139.76},label:'東京駅 · 東京都',approximate:false,source:'https://maps.gsi.go.jp/'}
beforeEach(()=>{vi.resetAllMocks();localStorage.setItem('ag-country','JP')})
it('requires choosing a real search result and map confirmation before saving its timezone',async()=>{
 vi.mocked(api).mockImplementation(async path=>(path.startsWith('places/search')?{candidates:[row]}:{timezone:'Asia/Tokyo',source:'일본 표준시',warning:null}) as never)
 const save=vi.fn();render(<Workspace><PlacePicker onChoose={save}/></Workspace>);
 fireEvent.change(screen.getByLabelText('도시·숙소·장소 이름'),{target:{value:'도쿄역'}});fireEvent.click(screen.getByRole('button',{name:'장소 검색'}));
 fireEvent.click(await screen.findByRole('button',{name:/東京駅/}));
 expect(await screen.findByText('確認用地図')).toBeVisible();await waitFor(()=>expect(screen.getByRole('button',{name:'이 위치 등록하기'})).toBeEnabled());
 expect(save).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'이 위치 등록하기'}));
 expect(save).toHaveBeenCalledWith(expect.objectContaining({lat:35.68,lon:139.76,timezone:'Asia/Tokyo',approximate:false}));
})
it('does not save an invalid coordinate after the server rejects the metadata check',async()=>{
 vi.mocked(api).mockImplementation(async path=>{if(path.startsWith('places/search'))return {candidates:[row]} as never;throw new Error('국가와 좌표를 확인하세요.')})
 const save=vi.fn();render(<Workspace><PlacePicker onChoose={save}/></Workspace>);
 fireEvent.change(screen.getByLabelText('도시·숙소·장소 이름'),{target:{value:'도쿄역'}});fireEvent.click(screen.getByRole('button',{name:'장소 검색'}));
 fireEvent.click(await screen.findByRole('button',{name:/東京駅/}));await screen.findByRole('alert');
 expect(screen.getByRole('button',{name:'이 위치 등록하기'})).toBeDisabled();expect(save).not.toHaveBeenCalled()
})
it('discards a delayed result after the search text changes',async()=>{
 let finish!:(value:unknown)=>void;vi.mocked(api).mockImplementation(()=>new Promise(resolve=>{finish=resolve}) as never)
 render(<Workspace><PlacePicker onChoose={vi.fn()}/></Workspace>);
 fireEvent.change(screen.getByLabelText('도시·숙소·장소 이름'),{target:{value:'도쿄역'}});fireEvent.click(screen.getByRole('button',{name:'장소 검색'}));
 fireEvent.change(screen.getByLabelText('도시·숙소·장소 이름'),{target:{value:'오사카역'}});finish({candidates:[row]});
 await waitFor(()=>expect(screen.queryByRole('button',{name:/東京駅/})).not.toBeInTheDocument())
})
it('uses only the header country and does not offer a separate country dropdown',async()=>{
 vi.mocked(api).mockResolvedValue({candidates:[]} as never);render(<Workspace><PlacePicker onChoose={vi.fn()}/></Workspace>);
 expect(screen.getByText('조회 국가').parentElement).toHaveTextContent('일본');expect(screen.queryByRole('combobox')).toBeNull();fireEvent.change(screen.getByLabelText('도시·숙소·장소 이름'),{target:{value:'도쿄역'}});fireEvent.click(screen.getByRole('button',{name:'장소 검색'}));await waitFor(()=>expect(api).toHaveBeenCalledWith(expect.stringContaining('country=JP')));
});
it('does not silently switch the selected country to a GPS location in the US',()=>{
 const gps=vi.fn((ok:PositionCallback)=>ok({coords:{latitude:40.7,longitude:-74}} as GeolocationPosition));vi.stubGlobal('navigator',{geolocation:{getCurrentPosition:gps}});
 render(<Workspace><PlacePicker onChoose={vi.fn()}/></Workspace>);fireEvent.click(screen.getByRole('button',{name:'현재 위치 사용'}));expect(screen.getByRole('alert')).toHaveTextContent('상단 국가를 바꾸거나 일본의 장소');expect(localStorage.getItem('ag-country')).toBe('JP');expect(api).not.toHaveBeenCalled();vi.unstubAllGlobals();
});
