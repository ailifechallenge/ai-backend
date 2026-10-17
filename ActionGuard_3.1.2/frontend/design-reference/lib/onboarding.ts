const ONBOARDING_KEY = 'ag.onboarded'

export function isOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === '1'
  } catch {
    return false
  }
}

export function markOnboarded(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, '1')
  } catch {
    /* 저장 실패해도 진행 */
  }
}
