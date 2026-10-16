import {render,screen,cleanup} from '@testing-library/react';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import Notifications from './Notifications';
import {api} from '../services/api';
vi.mock('../services/api',()=>({api:vi.fn()}));
vi.mock('../features/mobile/MobileRuntime',()=>({useMobile:()=>null}));
beforeEach(()=>vi.clearAllMocks());afterEach(cleanup);
function show(){render(<QueryClientProvider client={new QueryClient()}><MemoryRouter><Notifications/></MemoryRouter></QueryClientProvider>);}
it('makes dry runs visibly distinct from real delivery',async()=>{vi.mocked(api).mockResolvedValue({mode:'dry_run',worker_recent:true,worker_checked_at:new Date().toISOString()});show();expect(await screen.findByText('모의 발송 점검 모드예요')).toBeVisible();expect(screen.getByText('발송 대상과 중복 여부만 점검하며 휴대폰으로 보내지 않습니다.')).toBeVisible();});
it('does not call a configured but stopped worker active',async()=>{vi.mocked(api).mockResolvedValue({mode:'live',worker_recent:false,worker_checked_at:null});show();expect(await screen.findByText('발송 작업의 최근 실행을 확인해야 해요')).toBeVisible();expect(screen.queryByText('서버 발송 작업 실행 중 · 기기 수신 미확인')).toBeNull();});
it('treats status failures as unknown, not no alerts',async()=>{vi.mocked(api).mockRejectedValue(new Error('offline'));show();expect(await screen.findByText('서버 상태를 확인하지 못했어요')).toBeVisible();});
