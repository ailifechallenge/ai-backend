import {Workspace} from '../hooks/workspace';
import {render,screen,cleanup} from '@testing-library/react';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import Notifications from './Notifications';
import {api} from '../services/api';
vi.mock('../services/api',()=>({api:vi.fn()}));
vi.mock('../features/mobile/MobileRuntime',()=>({useMobile:()=>null}));
beforeEach(()=>vi.clearAllMocks());afterEach(cleanup);
function show(){render(<QueryClientProvider client={new QueryClient()}><MemoryRouter><Workspace><Notifications/></Workspace></MemoryRouter></QueryClientProvider>);}
it('makes dry runs visibly distinct from real delivery',async()=>{vi.mocked(api).mockResolvedValue({mode:'dry_run',worker_recent:true,worker_checked_at:new Date().toISOString()});show();expect(await screen.findByText('모의 발송 모드')).toBeInTheDocument();expect(screen.getByText('웹 미리보기 · 휴대폰 푸시 연결 안 됨')).toBeInTheDocument();});
it('does not call a configured but stopped worker active',async()=>{vi.mocked(api).mockResolvedValue({mode:'live',worker_recent:false,worker_checked_at:null});show();expect(await screen.findByText('최근 경보 조회 작업 확인 필요')).toBeInTheDocument();expect(screen.queryByText('서버 발송 작업 실행 중 · 기기 수신 미확인')).toBeNull();});
it('treats status failures as unknown, not no alerts',async()=>{vi.mocked(api).mockRejectedValue(new Error('offline'));show();expect(await screen.findByText('서버 조회 실패')).toBeInTheDocument();});
