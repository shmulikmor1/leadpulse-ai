import { CATEGORY_LABELS, URGENCY } from '../data/labels.js'

export default function HistoryList({ items, activeId, onSelect }) {
  if (items.length === 0) return null

  // Most urgent first; newer first within the same urgency.
  const sorted = [...items].sort((a, b) => b.result.urgency - a.result.urgency || b.id - a.id)

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-bold text-stone-900">פניות שנותחו</h2>
        <span className="text-xs text-stone-500">{items.length} · הדחופות למעלה</span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {sorted.map((item) => {
          const style = URGENCY[item.result.urgency]
          const active = item.id === activeId
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={active}
                className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-start transition focus-visible:ring-2 focus-visible:ring-teal-600/30 focus-visible:outline-none ${
                  active ? 'bg-stone-100' : 'hover:bg-stone-50'
                }`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold ${style.soft} ${style.text}`}>
                  {item.result.urgency}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-stone-900">{item.result.summary}</span>
                  <span className="block text-xs text-stone-500">{CATEGORY_LABELS[item.result.category]}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
