export async function analyzeLead(message) {
  const res = await fetch('/api/analyze-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'משהו השתבש, נסו שוב')
  return data
}
