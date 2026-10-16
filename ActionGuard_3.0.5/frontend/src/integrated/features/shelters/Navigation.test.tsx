import {beforeEach,expect,it,vi} from 'vitest';
import {fireEvent,render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {Workspace} from '../../hooks/workspace';
import Navigation from '../../pages/Navigation';
vi.mock('./NavigationMap',()=>({default:({data}:any)=><div>{data?'route map':'empty route map'}</div>}));
const response={provider:'osrm',mode:'WALK',api_key_required:false,route:{origin:{lat:35.681,lon:139.767},distance_m:1000,duration_s:600,alternatives_evaluated:2,checked_at:'2026-10-15T00:00:00Z',steps:[],attribution:'FOSSGIS'},destination:{lat:35.685,lon:139.77},traffic_verified:false,warnings:['통제·실시간 교통 미반영']};
beforeEach(()=>{vi.restoreAllMocks();vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify(response))));});
function show(){render(<MemoryRouter initialEntries={['/navigation?from=35.681,139.767&to=35.685,139.77&country=JP']}><Workspace><Navigation/></Workspace></MemoryRouter>);}
it('routes Japan coordinates without Google fields or settings',async()=>{show();fireEvent.click(screen.getByText('경로 찾기'));await screen.findByText('route map');expect(JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body))).toEqual({origin:'35.681,139.767',destination:'35.685,139.77',mode:'WALK'});expect(screen.getByText('통제·실시간 교통 미반영')).toBeInTheDocument();expect(screen.queryByText(/Google/)).not.toBeInTheDocument();});
it('clears the route when the source changes',async()=>{show();fireEvent.click(screen.getByText('경로 찾기'));await screen.findByText('route map');fireEvent.change(screen.getByLabelText('출발지'),{target:{value:'35.69,139.77'}});expect(screen.queryByText('route map')).not.toBeInTheDocument();});
it('supports keyless driving',async()=>{show();fireEvent.change(screen.getByLabelText('이동 수단'),{target:{value:'DRIVE'}});fireEvent.click(screen.getByText('경로 찾기'));await screen.findByText('route map');expect(JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body)).mode).toBe('DRIVE');});
