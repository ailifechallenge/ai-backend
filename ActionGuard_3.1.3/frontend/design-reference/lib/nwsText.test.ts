import { describe, expect, it } from 'vitest'
import { unwrapNwsText } from './nwsText'

describe('unwrapNwsText', () => {
  it('한 줄 바꿈은 공백, 빈 줄은 문단 유지', () => {
    expect(unwrapNwsText('For your protection get inside a sturdy structure and stay away from\nwindows.\n\nTurn around.')).toBe(
      'For your protection get inside a sturdy structure and stay away from windows.\n\nTurn around.',
    )
  })
  it('CRLF·앞뒤 공백 정리', () => {
    expect(unwrapNwsText('  a\r\n b  ')).toBe('a b')
  })
})
