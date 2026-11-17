/*
 * Calendar dates of the cabinet data ("YYYY-MM-DD" strings: submittedAt, history, paidAt…).
 *
 * They are always the visitor's LOCAL calendar date. toISOString() gives the UTC date, which in
 * Tashkent (UTC+5) is still "yesterday" between 00:00 and 05:00 — so never use it for these strings.
 */

const pad = (value) => String(value).padStart(2, '0')

/** Local calendar date of `date` as "YYYY-MM-DD" (today by default). */
export function localIsoDate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Local calendar date `days` days before today, "YYYY-MM-DD" (calendar days, not 24-hour steps). */
export function isoDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return localIsoDate(date)
}
