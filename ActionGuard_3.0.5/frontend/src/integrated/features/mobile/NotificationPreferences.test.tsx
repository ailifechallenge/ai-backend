import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter} from 'react-router-dom';
import NotificationPreferences from './NotificationPreferences';
vi.mock('../../services/api',()=>({api:vi.fn(async(path:string)=>path==='push/hazards'?{hazards:[{code:'wind',name:'강풍'}]}:path==='japan/areas'?{areas:[{code:'130000',name:'東京都'}]}:{areas:[{code:'1310100',name:'千代田区',type:'city'}]})}));
beforeEach(()=>localStorage.clear());afterEach(()=>{cleanup();localStorage.clear();});
it('saves an explicit local draft without claiming device push is enabled',async()=>{
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><NotificationPreferences/></MemoryRouter></QueryClientProvider>);
 await screen.findByRole('option',{name:/千代田区/});fireEvent.change(screen.getByLabelText('시·구·정·촌'),{target:{value:'1310100'}});fireEvent.click(screen.getByRole('button',{name:'선택 지역 추가'}));
 fireEvent.click(await screen.findByLabelText('강풍'));fireEvent.click(screen.getByRole('button',{name:'이 브라우저에 선택 저장'}));
 expect(screen.getByRole('status').textContent).toContain('휴대폰 푸시 구독 연결은 아직 완료되지 않았어요');
 expect(JSON.parse(localStorage.getItem('actionguard-notification-draft-v1')!)).toEqual({regions:[{scope:'JP:130000:1310100',name:'千代田区'}],hazards:['wind']});
});
it('shows Korean region labels while submitting official Japanese codes and names',async()=>{
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><NotificationPreferences/></MemoryRouter></QueryClientProvider>);
 expect(await screen.findByRole('option',{name:'도쿄도 (東京都)'})).toHaveValue('130000');
 expect(await screen.findByRole('option',{name:/지요다구 \(千代田区\)/})).toHaveValue('1310100');
});
it('lets users choose a US state by name instead of typing its code',async()=>{
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><NotificationPreferences/></MemoryRouter></QueryClientProvider>);
 fireEvent.change(screen.getByLabelText('국가'),{target:{value:'US'}});
 const state=screen.getByLabelText('미국 주·특별구·영토');
 expect(screen.getByRole('option',{name:'뉴욕주 · New York (NY)'})).toHaveValue('NY');
 fireEvent.change(state,{target:{value:'NY'}});expect(state).toHaveValue('NY');
});
