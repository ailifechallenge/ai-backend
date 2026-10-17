import { describe, expect, it } from 'vitest'
import { disasterFromEvent, evacuationInstructed } from './evacuation'

describe('evacuationInstructed (임시 규칙)', () => {
  it.each([
    'Move to higher ground now. Act quickly to protect your life.',
    'Residents should EVACUATE immediately.',
    'Follow evacuation orders from local officials.',
    'If told to do so, leave immediately.',
  ])('대피 이동 지시로 본다: %s', (text) => {
    expect(evacuationInstructed(text)).toBe(true)
  })

  it.each([
    'TAKE COVER NOW! Move to a basement or an interior room on the lowest floor of a sturdy building.',
    "Turn around, don't drown when encountering flooded roads.",
    '',
  ])('대피 이동 지시로 보지 않는다: %s', (text) => {
    expect(evacuationInstructed(text)).toBe(false)
  })

  it('null·undefined는 false', () => {
    expect(evacuationInstructed(null)).toBe(false)
    expect(evacuationInstructed(undefined)).toBe(false)
  })
})

describe('disasterFromEvent', () => {
  it.each([
    ['Flash Flood Warning', 'flood'],
    ['Flood Watch', 'flood'],
    ['Tornado Warning', 'tornado'],
    ['Hurricane Warning', 'hurricane'],
    ['Storm Surge Warning', 'storm_surge'],
    ['Tsunami Warning', 'tsunami'],
    ['Heat Advisory', 'general'],
    ['Special Weather Statement', 'general'],
  ])('%s → %s', (event, expected) => {
    expect(disasterFromEvent(event)).toBe(expected)
  })
})
