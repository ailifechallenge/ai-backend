import {beforeEach,it,expect,vi} from 'vitest'
import {render,screen,fireEvent,waitFor} from '@testing-library/react'
import PlacePicker from './PlacePicker'
import {api} from '../../services/api'
vi.mock('../../services/api',()=>({api:vi.fn()}))
vi.mock('../shelters/ShelterMap',()=>({default:()=> <div>確認用地図</div>}))
const row={location:{name:'도쿄역',country:'JP',lat:35.68,lon:139.76},label:'東京駅 · 東京都',approximate:false,source:'https://maps.gsi.go.jp/'}
beforeEach(()=>vi.resetAllMocks())
it('requires choosing a real search result and map confirmation before saving its timezone',async()=>{
 vi.mocked(api).mockImplementation(async path=>(path.startsWith('places/search')?{candidates:[row]}:{timezone:'Asia/Tokyo',source:'일본 표준시',warning:null}) as never)
 const save=vi.fn();render(<PlacePicker initialCountry="JP" onChoose={save}/>);
 fireEvent.change(screen.getByLabelText('도시·숙소·장소 이름'),{target:{value:'도쿄역'}});fireEvent.click(screen.getByRole('button',{name:'장소 검색'}));
 fireEvent.click(await screen.findByRole('button',{name:/東京駅/}));
 expect(await screen.findByText('確認用地図')).toBeVisible();await waitFor(()=>expect(screen.getByRole('button',{name:'이 위치 등록하기'})).toBeEnabled());
 expect(save).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'이 위치 등록하기'}));
 expect(save).toHaveBeenCalledWith(expect.objectContaining({lat:35.68,lon:139.76,timezone:'Asia/Tokyo',approximate:false}));
})
it('does not save an invalid coordinate after the server rejects the metadata check',async()=>{
 vi.mocked(api).mockImplementation(async path=>{if(path.startsWith('places/search'))return {candidates:[row]} as never;throw new Error('국가와 좌표를 확인하세요.')})
 const save=vi.fn();render(<PlacePicker initialCountry="JP" onChoose={save}/>);
 fireEvent.change(screen.getByLabelText('도시·숙소·장소 이름'),{target:{value:'도쿄역'}});fireEvent.click(screen.getByRole('button',{name:'장소 검색'}));
 fireEvent.click(await screen.findByRole('button',{name:/東京駅/}));await screen.findByRole('alert');
 expect(screen.getByRole('button',{name:'이 위치 등록하기'})).toBeDisabled();expect(save).not.toHaveBeenCalled()
})
it('discards a delayed result after the search text changes',async()=>{
 let finish!:(value:unknown)=>void;vi.mocked(api).mockImplementation(()=>new Promise(resolve=>{finish=resolve}) as never)
 render(<PlacePicker initialCountry="JP" onChoose={vi.fn()}/>);
 fireEvent.change(screen.getByLabelText('도시·숙소·장소 이름'),{target:{value:'도쿄역'}});fireEvent.click(screen.getByRole('button',{name:'장소 검색'}));
 fireEvent.change(screen.getByLabelText('도시·숙소·장소 이름'),{target:{value:'오사카역'}});finish({candidates:[row]});
 await waitFor(()=>expect(screen.queryByRole('button',{name:/東京駅/})).not.toBeInTheDocument())
})
