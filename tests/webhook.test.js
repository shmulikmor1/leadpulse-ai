import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { notifyAutomation } from '../api/_lib/webhook.js'

const lead = { message: 'שלום', urgency: 5, category: 'service' }

describe('notifyAutomation', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('does nothing when no webhook URL is configured', async () => {
    vi.stubEnv('AUTOMATION_WEBHOOK_URL', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    expect(await notifyAutomation(lead)).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts the lead as JSON to the configured URL', async () => {
    vi.stubEnv('AUTOMATION_WEBHOOK_URL', 'https://hook.example/abc')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', fetchMock)

    expect(await notifyAutomation(lead)).toBe(true)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://hook.example/abc')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual(lead)
  })

  it('returns false instead of throwing when the webhook is down', async () => {
    vi.stubEnv('AUTOMATION_WEBHOOK_URL', 'https://hook.example/abc')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    expect(await notifyAutomation(lead)).toBe(false)

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    expect(await notifyAutomation(lead)).toBe(false)
  })
})
