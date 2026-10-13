import { URGENCY } from '../data/labels.js'

export default function UrgencyMeter({ level }) {
  const style = URGENCY[level]
  return (
    <div className="shrink-0" role="img" aria-label={`דחיפות ${level} מתוך 5: ${style.label}`}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs font-medium text-stone-500">דחיפות</span>
        <span className={`text-sm font-bold ${style.text}`}>{style.label}</span>
      </div>
      <div className="mt-1.5 flex gap-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <span key={step} className={`h-2 w-7 rounded-full ${step <= level ? style.bar : 'bg-stone-200'}`} />
        ))}
      </div>
    </div>
  )
}
