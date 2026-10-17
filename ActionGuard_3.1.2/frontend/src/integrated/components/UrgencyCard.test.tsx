import {MemoryRouter} from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import {afterEach} from 'vitest';
import UrgencyCard from './UrgencyCard';
import type { UrgencyAssessment } from '../types';

const assessment: UrgencyAssessment = {
  level: 4, label: '대피', action_kind: 'shelter', headline: '지금 실내로 대피하세요',
  meaning: '토네이도로부터 몸을 보호하세요.', actions: ['창문에서 떨어지세요.'],
  evidence: [{ quote: 'Tornado Warning', explanation: '실내 대피가 필요한 경보예요.' }],
  sources: [{ title: 'NWS', url: 'https://www.weather.gov/safety/tornado-ww' }],
  provenance: 'example', applicability: '대상 지역에 있다면', notice: '가상 예시입니다.',
  inactive: false, rule_version: 'us-action-scale-1',
};

describe('action urgency card', () => {
  afterEach(cleanup);
  it('shows a single stage badge, exact evidence and an explicit demo label', () => {
    render(<MemoryRouter><UrgencyCard assessment={assessment} /></MemoryRouter>);
    expect(screen.getByText('가상 예시 · 실제 경보 아님')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '지금 실내로 대피하세요' })).toBeInTheDocument();
    expect(screen.getByText('Tornado Warning')).toBeInTheDocument();
    expect(screen.getAllByText('원문 행동 확인')).toHaveLength(1);
    expect(screen.queryByRole('list',{name:'앱 행동 척도: 정보, 주의, 대비, 대피'})).toBeNull();
    fireEvent.click(screen.getByText('판단 근거와 척도 안내'));
    expect(screen.getByRole('link', { name: 'NWS' })).toHaveAttribute('href', assessment.sources[0].url);
  });
  it('leaves all steps unselected for unknown input', () => {
    render(<MemoryRouter><UrgencyCard assessment={{ ...assessment, level: null, label: '확인 필요', action_kind: 'unknown', evidence: [], sources: [] }} /></MemoryRouter>);
    expect(screen.getByText('원문 행동 확인')).toBeInTheDocument();
    expect(screen.queryByText('1단계 · 정보')).toBeNull();
  });
  it('does not highlight an information stage for expired or cancelled messages', () => {
    render(<MemoryRouter><UrgencyCard assessment={{...assessment,level:1,label:'정보',inactive:true,headline:'이 메시지의 유효 시각이 지났어요'}} /></MemoryRouter>);
    expect(screen.getByText('비활성 메시지')).toBeVisible();
    expect(screen.queryByText('1단계 · 정보')).toBeNull();
  });
});
