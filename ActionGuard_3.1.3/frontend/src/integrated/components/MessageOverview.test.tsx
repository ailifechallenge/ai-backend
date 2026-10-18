import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {it,expect} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {Workspace} from '../hooks/workspace';
import MessageOverview from './MessageOverview';
import type {Verification} from '../types';
it('does not present incomplete verification as success',()=>{
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Workspace><MessageOverview busy={false} guidance={null} translation={{translation:'번역',hazard_explanation:'내용',summary:[],glossary:[]}} verification={{status:'검증 불가',issues:[]} as unknown as Verification}/></Workspace></MemoryRouter></QueryClientProvider>);
 expect(screen.getByText(/일부 내용을 원문과 대조하지 못했습니다/)).toBeInTheDocument();
});
it('shows all time and location facts immediately without an expandable disclosure',()=>{
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Workspace><MessageOverview busy={false} guidance={null} translation={{translation:'번역',hazard_explanation:'강풍이 붑니다.',summary:['대상: 괌','발표: 현지 오후 3시','유효: 오후 8시까지','행동: 창문에서 떨어지십시오.'],glossary:[]}} verification={null}/></Workspace></MemoryRouter></QueryClientProvider>);
 const facts=screen.getByRole('region',{name:'시간·지역 등 핵심 정보'});expect(facts.closest('details')).toBeNull();expect(screen.getByText('대상: 괌')).toBeVisible();expect(screen.getByText('행동: 창문에서 떨어지십시오.')).toBeVisible();
});

it('places concrete official instructions before optional applicability and AI evidence',()=>{
 const assessment={level:3,label:'대비',action_kind:'protect',headline:'지금 보호행동을 시작하십시오',meaning:'원문 확인',actions:['원문의 보호행동을 실행하십시오.'],evidence:[],sources:[],provenance:'official',applicability:'대상 지역',notice:'공식 자료 확인',inactive:false,method:'ai'};
 const official={category:'official',text:'Stay away from shore.',condition:'대상 해안',agency:'NWS',url:'https://www.weather.gov/'};
 const general={...official,category:'general',text:'침수된 도로에 들어가지 마십시오.'};
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Workspace><MessageOverview busy={false} urgency={assessment as never} guidance={{cards:[general,official]} as never} translation={{translation:'번역',hazard_explanation:'해안 침수',instruction_translation_ko:'해안에서 멀리 떨어지십시오.',summary:['대상: 괌'],glossary:[]}} verification={null}/></Workspace></MemoryRouter></QueryClientProvider>);
 const situation=screen.getByRole('article',{name:'경보 상황'}),actions=screen.getByRole('article',{name:'지금 할 행동'}),scope=screen.getByText('등록 위치와 적용 범위').closest('details')!,evidence=screen.getByText('AI 판단 근거 · 공식 등급 안내').closest('details')!;
 expect(situation.nextElementSibling).toBe(actions);expect(actions.compareDocumentPosition(scope)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();expect(scope.open).toBe(false);expect(evidence.open).toBe(false);
 expect(screen.queryByRole('heading',{name:'지금 보호행동을 시작하십시오'})).toBeNull();
 expect(screen.getByText('해안에서 멀리 떨어지십시오.').compareDocumentPosition(screen.getByText('침수된 도로에 들어가지 마십시오.'))&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 fireEvent.click(screen.getByText('등록 위치와 적용 범위'));expect(scope.open).toBe(true);
});
it('still shows translated official instructions when guidance is unavailable',()=>{
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Workspace><MessageOverview busy={false} guidance={null} translation={{translation:'번역',hazard_explanation:'강풍',instruction_translation_ko:'창문에서 떨어지십시오.',summary:[],glossary:[]}} verification={null}/></Workspace></MemoryRouter></QueryClientProvider>);
 expect(screen.getByText('창문에서 떨어지십시오.')).toBeVisible();
});
