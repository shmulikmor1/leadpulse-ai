export const CATEGORY_LABELS = {
  sales: 'מכירה',
  service: 'שירות',
  support: 'תמיכה',
  complaint: 'תלונה',
  info: 'מידע כללי',
  spam: 'ספאם',
}

// Class names are written out in full so Tailwind can find them.
export const URGENCY = {
  1: { label: 'לא דורש מענה', bar: 'bg-stone-400', text: 'text-stone-600', soft: 'bg-stone-100', ring: 'ring-stone-300' },
  2: { label: 'נמוכה', bar: 'bg-sky-500', text: 'text-sky-700', soft: 'bg-sky-50', ring: 'ring-sky-200' },
  3: { label: 'בינונית', bar: 'bg-amber-500', text: 'text-amber-700', soft: 'bg-amber-50', ring: 'ring-amber-200' },
  4: { label: 'גבוהה', bar: 'bg-orange-500', text: 'text-orange-700', soft: 'bg-orange-50', ring: 'ring-orange-200' },
  5: { label: 'דחוף', bar: 'bg-red-600', text: 'text-red-700', soft: 'bg-red-50', ring: 'ring-red-200' },
}

export const EXTRACTED_LABELS = {
  name: 'שם',
  phone: 'טלפון',
  product: 'מוצר / שירות',
  budget: 'תקציב',
  timeframe: 'מועד',
}
