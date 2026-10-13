import { CATEGORIES } from './prompt.js'

export const MAX_MESSAGE_LENGTH = 2000

const EXTRACTED_FIELDS = ['name', 'phone', 'product', 'budget', 'timeframe']

export function validateInput(body) {
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  if (!message) return { ok: false, error: 'חסרה פנייה לניתוח' }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `הפנייה ארוכה מדי (עד ${MAX_MESSAGE_LENGTH} תווים)` }
  }
  return { ok: true, message }
}

// Parses and checks the model's JSON. Throws if it does not match the contract,
// so a malformed answer never reaches the client.
export function parseAnalysis(text) {
  let raw
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('Model output is not valid JSON')
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Model output is not an object')
  }

  const str = (key, { allowEmpty = false } = {}) => {
    const value = raw[key]
    if (typeof value !== 'string' || (!allowEmpty && !value.trim())) {
      throw new Error(`Model output: bad "${key}"`)
    }
    return value.trim()
  }

  if (!CATEGORIES.includes(raw.category)) throw new Error('Model output: bad "category"')
  if (!Number.isInteger(raw.urgency) || raw.urgency < 1 || raw.urgency > 5) {
    throw new Error('Model output: bad "urgency"')
  }

  const extracted = {}
  for (const field of EXTRACTED_FIELDS) {
    const value = raw.extracted?.[field]
    extracted[field] = typeof value === 'string' && value.trim() ? value.trim() : null
  }

  return {
    intent: str('intent'),
    category: raw.category,
    urgency: raw.urgency,
    urgencyReason: str('urgencyReason'),
    summary: str('summary'),
    extracted,
    suggestedReply: str('suggestedReply', { allowEmpty: true }),
    nextAction: str('nextAction'),
  }
}
