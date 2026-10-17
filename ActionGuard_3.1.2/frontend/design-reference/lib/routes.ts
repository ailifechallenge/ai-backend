/** live 경보 id는 URL(슬래시·콜론 포함)이라 경로 한 칸으로 인코딩한다. useParams는 디코딩된 값을 준다 */
export function alertPath(id: string): string {
  return `/alert/${encodeURIComponent(id)}`
}

/** 대비 화면 (일정 카드에서 넘어오면 그 일정 id를 함께 넘긴다) */
export function preparePath(scheduleItemId?: string): string {
  return scheduleItemId ? `/prepare?from=${encodeURIComponent(scheduleItemId)}` : '/prepare'
}

export function evacuationPath(id: string): string {
  return `${alertPath(id)}/evacuation`
}
