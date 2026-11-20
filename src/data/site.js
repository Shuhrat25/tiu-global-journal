/*
 * Site-wide structure. Visible texts live in src/locales/*.
 * The menu (header, footer, page sidebar) comes from the journal API — see src/api/index.js.
 */

/* "Submit an article" buttons open the author's cabinet with the submission wizard */
export const SUBMIT_ROUTE = { name: 'author', query: { submit: '1' } }

/* keys → footer.<key> */
export const legalLinks = [
  { key: 'terms', href: '#' },
  { key: 'privacyPolicy', href: '#' },
  { key: 'sitemap', href: '#' },
]

/* Contact page social buttons (icons are rendered by AppIcon) */
export const contactSocials = [
  { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { name: 'Telegram', href: 'https://t.me', icon: 'telegram' },
  { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  { name: 'X', href: 'https://x.com', icon: 'x' },
]

/* Footer round social links (icons are rendered by AppIcon) */
export const footerSocials = [
  { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
]
