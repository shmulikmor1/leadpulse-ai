const TIMEOUT_MS = 3000

// Forwards an analysed lead to the automation scenario (Make).
// Never throws: a failed notification must not fail the analysis itself.
// Returns true when the webhook accepted the lead.
export async function notifyAutomation(lead) {
  const url = process.env.AUTOMATION_WEBHOOK_URL
  if (!url) return false

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) console.error(`Automation webhook returned ${res.status}`)
    return res.ok
  } catch (err) {
    console.error(`Automation webhook failed: ${err.message}`)
    return false
  }
}
