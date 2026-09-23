import { describe, expect, it } from 'vitest'
import { toWhatsappNumber } from './phone'

describe('toWhatsappNumber', () => {
  it('keeps E.164 without plus', () => {
    expect(toWhatsappNumber('+54 9 291 402-0624')).toBe('5492914020624')
  })

  it('adds 54 9 for a 10-digit local mobile', () => {
    expect(toWhatsappNumber('2914020624')).toBe('5492914020624')
  })
})
