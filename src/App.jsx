import { useState } from 'react'
import { analyzeLead } from './api.js'

export default function App() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      setResult(await analyzeLead(message))
    } catch (err) {
      setResult(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10 font-sans text-slate-900">
      <h1 className="text-3xl font-bold">LeadPulse AI</h1>
      <p className="mt-1 text-slate-600">ניתוח פניות לקוחות בשניות</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="הדביקו כאן פנייה של לקוח..."
          className="w-full rounded-lg border border-slate-300 p-3"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? 'מנתח...' : 'נתח'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {result && (
        <pre dir="ltr" className="mt-6 overflow-x-auto rounded-lg bg-slate-100 p-4 text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  )
}
