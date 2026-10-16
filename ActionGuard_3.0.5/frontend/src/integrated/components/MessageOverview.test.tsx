import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {it,expect} from 'vitest';
import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {Workspace} from '../hooks/workspace';
import MessageOverview from './MessageOverview';
import type {Verification} from '../types';
it('does not present incomplete verification as success',()=>{
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Workspace><MessageOverview busy={false} guidance={null} translation={{translation:'번역',hazard_explanation:'내용',summary:[],glossary:[]}} verification={{status:'검증 불가',issues:[]} as unknown as Verification}/></Workspace></MemoryRouter></QueryClientProvider>);
 expect(screen.getByText(/일부 내용을 원문과 대조하지 못했어요/)).toBeInTheDocument();
});
