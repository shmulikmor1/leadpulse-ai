// The only file that knows which LLM provider is used.
// To switch providers, reimplement generateJson with the same signature.
// Tried in order: the next model is used when one is over quota or overloaded.
// Lite models: fast, and their free-tier quota is the most generous.
const DEFAULT_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-lite-latest']
const RETRYABLE_STATUS = [404, 429, 500, 503]
const TIMEOUT_MS = 10_000

export class LlmError extends Error {}

export async function generateJson({ system, user, schema }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new LlmError('GEMINI_API_KEY is not set')

  const models = process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : DEFAULT_MODELS
  let lastError
  for (const model of models) {
    try {
      return await callModel(model, apiKey, { system, user, schema })
    } catch (err) {
      lastError = err
      if (!err.retryable) break
    }
  }
  throw lastError
}

async function callModel(model, apiKey, { system, user, schema }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    throw retryable(new LlmError(`${model} request failed: ${err.message}`))
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    const error = new LlmError(`${model} returned ${res.status}: ${detail.slice(0, 300)}`)
    throw RETRYABLE_STATUS.includes(res.status) ? retryable(error) : error
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('')
  if (!text) throw new LlmError(`${model} returned no text`)
  return text
}

function retryable(error) {
  error.retryable = true
  return error
}
