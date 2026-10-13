import { generateJson, LlmError } from './_lib/llm.js'
import { SYSTEM_INSTRUCTION, RESPONSE_SCHEMA, buildUserPrompt } from './_lib/prompt.js'
import { validateInput, parseAnalysis } from './_lib/validate.js'
import { createRateLimiter, clientIp } from './_lib/rateLimit.js'
import { notifyAutomation } from './_lib/webhook.js'

const isAllowed = createRateLimiter({ limit: 10, windowMs: 60_000 })
const MAX_ATTEMPTS = 2

// POST /api/analyze-lead  { message } -> lead analysis (see public/spec.html, "חוזה ה-API")
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isAllowed(clientIp(req))) {
    return res.status(429).json({ error: 'יותר מדי בקשות, נסו שוב בעוד דקה' })
  }

  const input = validateInput(req.body)
  if (!input.ok) return res.status(400).json({ error: input.error })

  let lastError
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const text = await generateJson({
        system: SYSTEM_INSTRUCTION,
        user: buildUserPrompt(input.message),
        schema: RESPONSE_SCHEMA,
      })
      const analysis = parseAnalysis(text)
      // Awaited: a serverless function may be frozen once the response is sent.
      await notifyAutomation({ ...analysis, message: input.message, receivedAt: new Date().toISOString() })
      return res.status(200).json(analysis)
    } catch (err) {
      lastError = err
      // Only a malformed answer is worth asking for again; llm.js already
      // handled provider failures by falling back to another model.
      if (err instanceof LlmError) break
    }
  }

  console.error('analyze-lead failed:', lastError)
  return res.status(502).json({ error: 'הניתוח נכשל כרגע, נסו שוב בעוד רגע' })
}
