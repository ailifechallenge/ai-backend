import {it,expect} from 'vitest'
import {render,screen} from '@testing-library/react'
import {alertName,ResponseBadge} from './AlertIdentity'
it('names typhoons in Korean while retaining distinct hurricane terminology',()=>{expect(alertName('Typhoon Warning')).toBe('태풍 경보');expect(alertName('Typhoon Watch')).toBe('태풍 예비경보');expect(alertName('Hurricane Warning')).toBe('허리케인 경보');expect(alertName('Heat Advisory')).toBe('폭염 주의보')})
it('shows one assessed badge without four duplicate stage tiles',()=>{render(<ResponseBadge assessment={{level:3,inactive:false} as never}/>);expect(screen.getAllByText('3단계 · 대비')).toHaveLength(1);expect(screen.queryByRole('list')).toBeNull()})
it('does not guess a stage when a message is inactive',()=>{render(<ResponseBadge assessment={{level:4,inactive:true} as never}/>);expect(screen.getByText('단계 미표시')).toBeVisible();expect(screen.queryByText('4단계 · 대피')).toBeNull()})
