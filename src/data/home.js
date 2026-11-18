/*
 * Home page data. Texts are translated in src/locales/*.
 * Most of the home page now comes from the journal API (src/api/home.js).
 */

export const latestIssue = {
  number: 12,
  year: 2025,
  published: '2025-11-01',
}

/* key → poll.options.<key>; in the API the same answers are numbered 1–5 */
export const pollOptions = ['o1', 'o2', 'o3', 'o4', 'o5']
