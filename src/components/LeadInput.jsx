import { EXAMPLES } from '../data/examples.js'

const MAX_LENGTH = 2000

export default function LeadInput({ value, onChange, onSubmit, loading }) {
  const canSubmit = !loading && value.trim().length > 0

  function handleSubmit(e) {
    e.preventDefault()
    if (canSubmit) onSubmit()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <label htmlFor="lead-message" className="block text-sm font-bold text-stone-900">
        פנייה של לקוח
      </label>
      <p className="mt-0.5 text-sm text-stone-500">הדביקו הודעת וואטסאפ, מייל או טופס מהאתר.</p>

      <textarea
        id="lead-message"
        dir={value ? 'auto' : 'rtl'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={MAX_LENGTH}
        rows={6}
        placeholder="לדוגמה: היי, אני מחפש הצעת מחיר ל..."
        className="mt-3 block w-full resize-y rounded-xl border border-stone-300 bg-stone-50 p-3.5 text-base leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:outline-none"
      />

      <div className="mt-3">
        <span className="text-xs font-medium text-stone-500">או נסו דוגמה:</span>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => onChange(example.message)}
              className="rounded-full border border-stone-300 bg-white px-3 py-1 text-sm text-stone-700 transition hover:border-teal-600 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600/30 focus-visible:outline-none"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-2.5 text-base font-bold text-white transition hover:bg-stone-700 focus-visible:ring-2 focus-visible:ring-stone-900/30 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {loading ? 'מנתח...' : 'נתח פנייה'}
        </button>
        <span className="text-xs text-stone-400 tabular-nums">
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
    </form>
  )
}
