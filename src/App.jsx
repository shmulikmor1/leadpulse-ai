import { useRef, useState } from 'react'
import { analyzeLead } from './api.js'
import LeadInput from './components/LeadInput.jsx'
import ResultCard from './components/ResultCard.jsx'
import HistoryList from './components/HistoryList.jsx'
import { EmptyState, ErrorState, LoadingState, PulseIcon } from './components/ResultStates.jsx'

export default function App() {
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const resultRef = useRef(null)

  const active = history.find((item) => item.id === activeId)

  function showResult() {
    // On narrow screens the result sits below the form.
    if (window.matchMedia('(max-width: 1023px)').matches) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  async function handleSubmit() {
    const text = message.trim()
    setError('')
    setLoading(true)
    showResult()
    try {
      const result = await analyzeLead(text)
      const id = Date.now()
      setHistory((items) => [...items, { id, message: text, result }])
      setActiveId(id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(id) {
    setError('')
    setActiveId(id)
    showResult()
  }

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-12 sm:px-6 sm:pt-10">
        <header className="max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-stone-900 text-teal-300">
              <PulseIcon className="h-5 w-5" />
            </span>
            <span dir="ltr" className="text-lg font-bold tracking-tight">
              LeadPulse AI
            </span>
            <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600">דמו</span>
          </div>
          <h1 className="mt-6 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">איזו פנייה לא יכולה לחכות?</h1>
          <p className="mt-3 text-base leading-relaxed text-stone-600 sm:text-lg">
            סוכן AI שקורא כל פנייה שנכנסת לעסק, מדרג כמה היא דחופה ומכין תשובה ללקוח, כדי שהלידים החמים יקבלו מענה ראשונים.
          </p>
        </header>

        {/* DOM order is form, result, history so the result follows the form on mobile. */}
        <main className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-[auto_1fr]">
          <LeadInput value={message} onChange={setMessage} onSubmit={handleSubmit} loading={loading} />

          <div ref={resultRef} className="scroll-mt-4 lg:col-start-2 lg:row-span-2 lg:row-start-1" aria-live="polite">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} onRetry={handleSubmit} />
            ) : active ? (
              <ResultCard message={active.message} result={active.result} />
            ) : (
              <EmptyState />
            )}
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <HistoryList items={history} activeId={activeId} onSelect={handleSelect} />
          </div>
        </main>

        <footer className="mt-10 text-center text-xs text-stone-500">
          הדגמה בלבד. הפניות נשלחות לניתוח ואינן נשמרות. ·{' '}
          <a href="/spec.html" className="font-medium text-teal-700 underline-offset-2 hover:underline">
            מסמך האפיון
          </a>{' '}
          ·{' '}
          <a href="https://github.com/shmulikmor1/leadpulse-ai" className="font-medium text-teal-700 underline-offset-2 hover:underline">
            הקוד ב-GitHub
          </a>
        </footer>
      </div>
    </div>
  )
}
