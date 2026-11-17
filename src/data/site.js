/*
 * Site-wide structure. Visible texts live in src/locales/* —
 * here every item only references its translation key (`key` → `nav.<key>`).
 * Items with `to` are internal routes, items with `href` are external/placeholder links.
 */
import instagramIcon from '@/assets/icons/social-instagram.svg'
import telegramIcon from '@/assets/icons/social-telegram.svg'
import facebookIcon from '@/assets/icons/social-facebook.svg'
import youtubeIcon from '@/assets/icons/social-youtube.svg'
import xIcon from '@/assets/icons/social-x.svg'

/* "Submit an article" buttons open the author's cabinet with the submission wizard */
export const SUBMIT_ROUTE = { name: 'author', query: { submit: '1' } }

export const contacts = {
  email: 'info@tiuglobal.uz',
  phone: '+998 71 244-44-44',
  phoneHref: '+998712444444',
}

export const aboutLinks = [
  { key: 'requirements', to: { name: 'requirements' } },
  { key: 'editorial', to: { name: 'editorial' } },
  { key: 'privacy', href: '#' },
  { key: 'archive', href: '#' },
]

export const authorLinks = [
  { key: 'template', href: '#' },
  { key: 'reviewGuide', href: '#' },
  { key: 'payment', href: '#' },
  { key: 'ethics', href: '#' },
  { key: 'plagiarism', href: '#' },
]

export const reviewerLinks = [
  { key: 'reviewProcess', href: '#' },
  { key: 'reviewPolicy', href: '#' },
  { key: 'reviewerEthics', href: '#' },
  { key: 'motivation', href: '#' },
]

export const mainMenu = [
  { key: 'about', children: aboutLinks },
  { key: 'authors', children: authorLinks },
  { key: 'reviewers', children: reviewerLinks },
  { key: 'contact', to: { name: 'contact' } },
]

export const footerColumns = [
  { key: 'about', links: aboutLinks },
  { key: 'authors', links: authorLinks },
  { key: 'reviewers', links: reviewerLinks },
]

/* keys → footer.<key> */
export const legalLinks = [
  { key: 'terms', href: '#' },
  { key: 'privacyPolicy', href: '#' },
  { key: 'sitemap', href: '#' },
]

/* Floating sidebar (left edge of the page) */
export const sidebarSocials = [
  { name: 'Instagram', href: 'https://instagram.com', icon: instagramIcon },
  { name: 'Telegram', href: 'https://t.me', icon: telegramIcon },
  { name: 'Facebook', href: 'https://facebook.com', icon: facebookIcon },
  { name: 'YouTube', href: 'https://youtube.com', icon: youtubeIcon },
  { name: 'X', href: 'https://x.com', icon: xIcon },
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
