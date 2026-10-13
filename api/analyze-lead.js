// POST /api/analyze-lead
// Skeleton stage: returns a fixed analysis so the UI can be wired end to end.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!message) {
    return res.status(400).json({ error: 'חסרה פנייה לניתוח' })
  }

  return res.status(200).json({
    intent: 'בקשת שירות דחופה – תיקון מזגן',
    category: 'service',
    urgency: 5,
    urgencyReason: 'תקלה פעילה, מבקש טיפול היום',
    summary: 'דני מבקש טכנאי היום לנזילה במזגן שנמשכת יומיים',
    extracted: { name: 'דני', phone: '050-1234567', product: 'מזגן', budget: null, timeframe: 'היום' },
    suggestedReply: 'היי דני, קיבלנו את הפנייה ואנחנו על זה. טכנאי יחזור אליך בשעה הקרובה לתיאום הגעה עוד היום.',
    nextAction: 'להתקשר ללקוח בשעה הקרובה ולתאם טכנאי',
  })
}
