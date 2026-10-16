import type { ChatMessage } from '@/types'

export const CHAT_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'bot',
  text: '안녕하세요. 받은 경보나 일정에 대해 물어보세요. 근거를 확인할 수 없으면 확인할 수 없다고 말씀드려요.',
  meta: 'ActionGuard 안내',
  local: true,
}

/** mock 데모 대화 시드 질문 (답변은 chatService가 현재 경보·일정으로 생성) */
export const CHAT_SEED_QUESTION = '내일 아침 공항 이동은 괜찮아?'

/**
 * live 추천 질문 — 자동 호출하지 않고 눌렀을 때만 보낸다 (AI 한도).
 * "언제 끝나나요"는 서버가 규칙으로 답해 AI를 쓰지 않는다.
 */
export const CHAT_SUGGESTIONS = ['이 경보는 언제 끝나나요?', '지금 무엇을 해야 하나요?', '내 숙소가 경보와 겹쳐?']
