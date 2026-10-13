// Best-effort limiter: state lives in the function instance's memory, so it
// resets on cold starts and is not shared between instances. Enough to stop a
// single visitor from draining the free LLM quota; not a security boundary.
export function createRateLimiter({ limit, windowMs, now = Date.now }) {
  const hits = new Map()

  return function isAllowed(key) {
    const t = now()
    const recent = (hits.get(key) ?? []).filter((ts) => t - ts < windowMs)
    if (recent.length >= limit) {
      hits.set(key, recent)
      return false
    }
    recent.push(t)
    hits.set(key, recent)
    if (hits.size > 5000) hits.clear()
    return true
  }
}

export function clientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress ?? 'unknown'
}
