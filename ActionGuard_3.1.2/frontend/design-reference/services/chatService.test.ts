import { describe, expect, it } from 'vitest'
import type { ChatMessage, ScheduleItem } from '@/types'
import { buildChatBody, mapChatAnswer, mapChatPath, pickStayItem, toHistory } from './chatService'
import { mapAlert } from './mappers/alert'
import { API_ALERT } from './mappers/fixtures'

const alert = mapAlert(API_ALERT, new Date('2026-10-15T19:20:00Z'))

const items: ScheduleItem[] = [
  { id: 'stay', kind: 'stay', title: '호텔', startUtc: '2026-10-15T20:00:00Z', endUtc: '2026-10-16T16:00:00Z', latitude: 29.76, longitude: -95.37, timezone: 'America/Chicago', country: 'US' },
  { id: 'move', kind: 'move', title: '공항 이동', startUtc: '2026-10-16T14:00:00Z' },
]

const msg = (role: 'user' | 'bot', text: string, local = false): ChatMessage => ({ id: text, role, text, local })

describe('toHistory', () => {
  it('인사말·오류(local) 제외, bot→assistant', () => {
    expect(toHistory([msg('bot', '안녕하세요', true), msg('user', 'q1'), msg('bot', 'a1'), msg('bot', '오류', true)])).toEqual([
      { role: 'user', text: 'q1' },
      { role: 'assistant', text: 'a1' },
    ])
  })
  it('최근 8개, 1800자', () => {
    const many = Array.from({ length: 12 }, (_, i) => msg('user', `q${i}`))
    const h = toHistory([...many, msg('bot', 'x'.repeat(2000))])
    expect(h).toHaveLength(8)
    expect(h[7].text).toHaveLength(1800)
    expect(h[0].text).toBe('q5')
  })
})

describe('pickStayItem', () => {
  it('공항/내일 → 이동 일정', () => {
    expect(pickStayItem('내일 아침 공항 이동은 괜찮아?', items)?.id).toBe('move')
  })
  it('숙소 → 숙박 일정', () => {
    expect(pickStayItem('내 숙소가 경보와 겹쳐?', items)?.id).toBe('stay')
  })
  it('숙박 일정이 없으면 제목에 호텔이 있는 일정', () => {
    expect(pickStayItem('호텔은 괜찮아?', [{ ...items[1], id: 'h', kind: 'visit', title: '휴스턴 호텔' }])?.id).toBe('h')
  })
  it('그 외 → 없음', () => {
    expect(pickStayItem('이 경보는 언제 끝나나요?', items)).toBeUndefined()
  })
})

describe('buildChatBody', () => {
  it('정의된 필드만, 질문 1000자', () => {
    const body = buildChatBody('a'.repeat(1200), alert, items, [])
    expect(Object.keys(body).sort()).toEqual(['alert_id', 'history', 'location', 'question', 'text'])
    expect(body.location).toEqual({ country: 'US', lat: 29.7604, lon: -95.3698, name: 'Houston, TX' })
    expect(body.question).toHaveLength(1000)
  })
  it('겹침 질문이면 stay 포함', () => {
    const body = buildChatBody('내 숙소가 경보와 겹쳐?', alert, items, [])
    expect(body.stay).toMatchObject({ name: '호텔', timezone: 'America/Chicago', start: '2026-10-15T15:00' })
  })
})

describe('previous_intent', () => {
  it('직전 봇 답변의 intent를 보낸다', () => {
    const history: ChatMessage[] = [msg('user', 'q'), { ...msg('bot', 'a'), intent: 'shelters' }, msg('user', 'q2')]
    expect(buildChatBody('그럼 더 멀리는?', alert, items, history).previous_intent).toBe('shelters')
  })
  it('없으면 보내지 않는다', () => {
    expect('previous_intent' in buildChatBody('q', alert, items, [])).toBe(false)
  })
})

describe('mapChatPath', () => {
  it('이 앱에 있는 화면만 바꾼다', () => {
    expect(mapChatPath('/')).toBe('/home')
    expect(mapChatPath('/itinerary')).toBe('/schedule')
    expect(mapChatPath('/shelters?country=US&lat=1')).toBeNull()
    expect(mapChatPath('/notifications')).toBeNull()
    expect(mapChatPath('/chat')).toBeNull()
  })
})

describe('mapChatAnswer', () => {
  it('새 응답 필드 매핑 (live 조회 결과)', () => {
    const m = mapChatAnswer({
      answer: '반경 10km에서 시설을 찾았어요.',
      sources: [{ title: '공식 대피시설 자료', quote: 'note', url: null }],
      checked_at: 'x',
      mode: 'live',
      intent: 'shelters',
      items: [{ kind: 'shelter', title: 'GRB', detail: '1001 Avenida', status: 'FEMA 데이터상 현재 운영 중', source: 's', path: '/shelters?x', distance_m: 1234 }],
      actions: [
        { label: '시설 지도에서 확인', path: '/shelters?country=US' },
        { label: '일정 상세', path: '/itinerary' },
      ],
      scope_note: '등록한 위치 기준 · 직선거리 순',
      ai_used: true,
    })
    expect(m.mode).toBe('live')
    expect(m.intent).toBe('shelters')
    expect(m.items).toEqual([{ kind: 'shelter', title: 'GRB', detail: '1001 Avenida', status: 'FEMA 데이터상 현재 운영 중', distanceLabel: '약 1.2km' }])
    expect(m.actions).toEqual([{ label: '일정 상세', path: '/schedule' }])
    expect(m.scopeNote).toBe('등록한 위치 기준 · 직선거리 순')
    expect(m.aiUsed).toBe(true)
    expect(m.sources?.[0].url).toBeUndefined()
  })
  it('예전 응답(새 필드 없음)도 읽힌다', () => {
    const m = mapChatAnswer({ answer: 'a', sources: [], checked_at: 'x', mode: 'rule' })
    expect(m.items).toEqual([])
    expect(m.actions).toEqual([])
    expect(m.aiUsed).toBe(false)
  })
})
