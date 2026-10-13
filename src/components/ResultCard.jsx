import { useState } from 'react'
import UrgencyMeter from './UrgencyMeter.jsx'
import { CATEGORY_LABELS, EXTRACTED_LABELS, URGENCY } from '../data/labels.js'

export default function ResultCard({ message, result }) {
  const style = URGENCY[result.urgency]
  const details = Object.entries(EXTRACTED_LABELS).filter(([key]) => result.extracted[key])

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <header className={`${style.soft} px-5 py-4 sm:px-6`}>
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <span className={`inline-block rounded-full bg-white px-2.5 py-0.5 text-xs font-bold ring-1 ${style.text} ${style.ring}`}>
              {CATEGORY_LABELS[result.category]}
            </span>
            <h2 className="mt-2 text-xl leading-snug font-bold text-stone-900">{result.intent}</h2>
          </div>
          <UrgencyMeter level={result.urgency} />
        </div>
        <p className="mt-2 text-sm text-stone-600">{result.urgencyReason}</p>
      </header>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <Section title="סיכום">
          <p className="text-base leading-relaxed text-stone-900">{result.summary}</p>
          <blockquote dir="auto" className="mt-2 border-s-2 border-stone-200 ps-3 text-sm leading-relaxed text-stone-500">
            {message}
          </blockquote>
        </Section>

        {details.length > 0 && (
          <Section title="פרטים שחולצו">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
              {details.map(([key, label]) => (
                <div key={key}>
                  <dt className="text-xs text-stone-500">{label}</dt>
                  <dd className="text-sm font-medium text-stone-900">
                    <bdi>{result.extracted[key]}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        <Section title="תשובה מוצעת ללקוח" action={result.suggestedReply && <CopyButton text={result.suggestedReply} />}>
          {result.suggestedReply ? (
            <p className="rounded-xl bg-stone-50 p-4 text-base leading-relaxed whitespace-pre-line text-stone-900 ring-1 ring-stone-200">
              {result.suggestedReply}
            </p>
          ) : (
            <p className="text-sm text-stone-500">אין צורך לענות לפנייה הזו.</p>
          )}
        </Section>

        <div className="flex items-start gap-3 rounded-xl bg-teal-50 p-4 ring-1 ring-teal-100">
          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 rtl:-scale-x-100" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 0 1 .75-.75h10.64l-3.2-3.2a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.2-3.2H3.75A.75.75 0 0 1 3 10Z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-xs font-bold text-teal-800">הצעד הבא</h3>
            <p className="mt-0.5 text-sm leading-relaxed text-stone-900">{result.nextAction}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function Section({ title, action, children }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-xs font-bold tracking-wide text-stone-500">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be blocked; the text stays selectable.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg px-2.5 py-1 text-xs font-bold text-teal-700 transition hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-teal-600/30 focus-visible:outline-none"
    >
      {copied ? 'הועתק ✓' : 'העתק'}
    </button>
  )
}
