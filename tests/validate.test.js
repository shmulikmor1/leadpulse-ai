import { describe, it, expect } from 'vitest'
import { validateInput, parseAnalysis, MAX_MESSAGE_LENGTH } from '../api/_lib/validate.js'

const valid = {
  intent: 'בקשת שירות',
  category: 'service',
  urgency: 4,
  urgencyReason: 'תקלה פעילה',
  summary: 'לקוח מבקש טכנאי',
  extracted: { name: 'דני', phone: null, product: 'מזגן', budget: null, timeframe: 'היום' },
  suggestedReply: 'נחזור אליך בהקדם',
  nextAction: 'להתקשר ללקוח',
}
const json = (overrides) => JSON.stringify({ ...valid, ...overrides })

describe('validateInput', () => {
  it('accepts a message and trims it', () => {
    expect(validateInput({ message: '  שלום  ' })).toEqual({ ok: true, message: 'שלום' })
  })

  it.each([undefined, null, {}, { message: '' }, { message: '   ' }, { message: 42 }])(
    'rejects missing or empty message: %j',
    (body) => {
      expect(validateInput(body).ok).toBe(false)
    },
  )

  it('rejects a message over the length limit', () => {
    expect(validateInput({ message: 'א'.repeat(MAX_MESSAGE_LENGTH + 1) }).ok).toBe(false)
    expect(validateInput({ message: 'א'.repeat(MAX_MESSAGE_LENGTH) }).ok).toBe(true)
  })
})

describe('parseAnalysis', () => {
  it('returns the analysis for valid output', () => {
    expect(parseAnalysis(json())).toEqual(valid)
  })

  it('drops fields that are not part of the contract', () => {
    expect(parseAnalysis(json({ extra: 'x' }))).not.toHaveProperty('extra')
  })

  it('normalises missing or blank extracted fields to null', () => {
    const result = parseAnalysis(json({ extracted: { name: '  ', phone: '050-1234567' } }))
    expect(result.extracted).toEqual({ name: null, phone: '050-1234567', product: null, budget: null, timeframe: null })
  })

  it('allows an empty suggested reply (spam)', () => {
    expect(parseAnalysis(json({ category: 'spam', urgency: 1, suggestedReply: '' })).suggestedReply).toBe('')
  })

  it.each([
    ['non-JSON text', 'not json'],
    ['an array', '[]'],
    ['unknown category', json({ category: 'other' })],
    ['urgency out of range', json({ urgency: 6 })],
    ['non-integer urgency', json({ urgency: 3.5 })],
    ['urgency as string', json({ urgency: '3' })],
    ['empty summary', json({ summary: '' })],
    ['missing intent', json({ intent: undefined })],
  ])('throws on %s', (_name, text) => {
    expect(() => parseAnalysis(text)).toThrow()
  })
})
