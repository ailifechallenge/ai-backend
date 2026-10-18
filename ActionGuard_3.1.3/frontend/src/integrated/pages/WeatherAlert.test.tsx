import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter,Routes,Route} from 'react-router-dom';
import {Workspace,useWorkspace} from '../hooks/workspace';
import WeatherAlert from './WeatherAlert';
import {api} from '../services/api';
vi.mock('../services/api',()=>({api:vi.fn()}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
function Home(){const ws=useWorkspace();return <p>{ws.messageCountry} · {ws.text}</p>;}
function mount(url='/weather-alert?scope=JP:130000:1310100&event=old'){
 return render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter initialEntries={[url]}><Workspace><Routes><Route path="/weather-alert" element={<WeatherAlert/>}/><Route path="/analyze" element={<Home/>}/></Routes></Workspace></MemoryRouter></QueryClientProvider>);
}
it('never turns a failed source into a cleared or safe state',async()=>{
 vi.mocked(api).mockRejectedValue(new Error('offline'));mount();expect(await screen.findByRole('alert')).toHaveTextContent('해제된 것으로 판단하지 마십시오');expect(screen.queryByText(/유효한 기상경보가 표시되지/)).toBeNull();
});
it('reloads current state and carries the correct country into translation',async()=>{
 vi.mocked(api).mockResolvedValue({rows:{wind:{id:'new',event:'暴風警報',area:'千代田区',sent:'2026-10-15T10:00:00+09:00',status:'active',expires:null}},area_name:'千代田区',checked_at:'2026-10-15T12:00:00Z',country:'JP'});mount();
 expect(await screen.findByText(/알림 당시 발표가 현재 목록에 없거나 갱신/)).toBeVisible();fireEvent.click(screen.getByRole('button',{name:'한국어로 이해하기'}));expect(await screen.findByText(/JP · 気象庁 発表: 暴風警報/)).toBeVisible();
});
