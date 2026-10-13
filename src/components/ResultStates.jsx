const panel = 'rounded-2xl border bg-white p-6 shadow-sm sm:p-8'

export function EmptyState() {
  return (
    <div className={`${panel} border-dashed border-stone-300 text-center shadow-none`}>
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700">
        <PulseIcon className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-stone-900">הניתוח יופיע כאן</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-stone-500">
        בחרו אחת מהדוגמאות או הדביקו פנייה אמיתית. תוך כמה שניות תקבלו דירוג דחיפות, סיכום ותשובה מוכנה לשליחה.
      </p>
    </div>
  )
}

export function LoadingState() {
  return (
    <div className={`${panel} border-stone-200`} role="status">
      <p className="text-sm font-medium text-stone-500">מנתח את הפנייה...</p>
      <div className="mt-5 animate-pulse space-y-4">
        <div className="h-6 w-2/3 rounded-lg bg-stone-200" />
        <div className="h-4 w-full rounded-lg bg-stone-100" />
        <div className="h-4 w-5/6 rounded-lg bg-stone-100" />
        <div className="h-24 w-full rounded-xl bg-stone-100" />
        <div className="h-12 w-full rounded-xl bg-stone-100" />
      </div>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className={`${panel} border-red-200`} role="alert">
      <h2 className="text-lg font-bold text-stone-900">הניתוח לא הצליח</h2>
      <p className="mt-1 text-sm leading-relaxed text-stone-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl border border-stone-300 px-4 py-2 text-sm font-bold text-stone-900 transition hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-stone-900/20 focus-visible:outline-none"
      >
        נסו שוב
      </button>
    </div>
  )
}

export function PulseIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2 12h4l3-8 5 16 3-8h5" />
    </svg>
  )
}
