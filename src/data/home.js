/*
 * Home page data. Texts are translated in src/locales/* and looked up
 * by the item `id` (e.g. categories.items.c1.title, news.items.n1).
 */
import news1 from '@/assets/images/news/news-1.jpg'
import news2 from '@/assets/images/news/news-2.jpg'
import news3 from '@/assets/images/news/news-3.jpg'
import news4 from '@/assets/images/news/news-4.jpg'
import news5 from '@/assets/images/news/news-5.jpg'

import base from '@/assets/images/indexing/base.png'
import doi from '@/assets/images/indexing/doi.png'
import googleScholar from '@/assets/images/indexing/google-scholar.png'
import inLibrary from '@/assets/images/indexing/inlibrary.png'
import crossref from '@/assets/images/indexing/crossref.png'

import jurnalTv from '@/assets/images/partners/jurnal-tv.png'
import jurnalMekari from '@/assets/images/partners/jurnal-mekari.png'
import digitalJournal from '@/assets/images/partners/digital-journal.png'
import jurnalIlmiah from '@/assets/images/partners/jurnal-ilmiah.png'
import journalStories from '@/assets/images/partners/journal-stories.png'
import rumahJurnal from '@/assets/images/partners/rumah-jurnal.png'

export const latestIssue = {
  number: 12,
  year: 2025,
  published: '2025-11-01',
}

/* key → hero.stats.<key> */
export const heroStats = [
  { key: 'articles', value: '500+' },
  { key: 'authors', value: '200+' },
  { key: 'countries', value: '15+' },
]

/* id → categories.items.<id> */
export const categories = [
  { id: 'c1', icon: 'trending-up', count: 124 },
  { id: 'c2', icon: 'book-open', count: 98 },
  { id: 'c3', icon: 'users', count: 156 },
  { id: 'c4', icon: 'trending-up', count: 112 },
  { id: 'c5', icon: 'microscope', count: 87 },
  { id: 'c6', icon: 'globe', count: 112 },
  { id: 'c7', icon: 'graduation-cap', count: 93 },
  { id: 'c8', icon: 'book-open', count: 45 },
]

export const featuredIssue = {
  href: '#',
}

/* id → news.items.<id> */
export const news = [
  { id: 'n1', image: news1, date: '2025-11-18', views: 238 },
  { id: 'n2', image: news2, date: '2025-11-08', views: 456 },
  { id: 'n3', image: news3, date: '2025-11-03', views: 187 },
  { id: 'n4', image: news4, date: '2025-11-07', views: 67 },
  { id: 'n5', image: news5, date: '2025-11-11', views: 123 },
]

const doiLink = 'https://doi.org/10.35465/ku.v16i.1254'

/* id → articles.items.<id> */
export const articles = [
  { id: 'a1', pages: [5, 12], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
  { id: 'a2', pages: [13, 22], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
  { id: 'a3', pages: [23, 31], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
  { id: 'a4', pages: [32, 40], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
  { id: 'a5', pages: [41, 48], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
  { id: 'a6', pages: [49, 57], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
]

/*
 * Logo placement inside its card is copied from Figma (percentages of the
 * inner logo box), so the logos keep their exact visual size at any width.
 * Names are brand names and are not translated.
 */
export const indexingBases = [
  { name: 'BASE', href: 'https://www.base-search.net', logo: base, fit: 'contain' },
  { name: 'DOI', href: 'https://www.doi.org', logo: doi, box: { w: 46.15, h: 80.77, x: 26.92, y: 9.62 } },
  { name: 'Google Scholar', href: 'https://scholar.google.com', logo: googleScholar, box: { w: 70.33, h: 123.08, x: 14.84, y: -11.54 } },
  { name: 'inLibrary', href: 'https://inlibrary.uz', logo: inLibrary, box: { w: 89.01, h: 155.77, x: 5.49, y: -27.88 } },
  { name: 'Crossref', href: 'https://www.crossref.org', logo: crossref, box: { w: 87.48, h: 51.92, x: 6.26, y: 24.04 } },
]

export const partners = [
  { name: 'Jurnal TV', logo: jurnalTv, box: { w: 88.11, h: 41.18, x: 5.94, y: 29.41 } },
  { name: 'Jurnal by Mekari', logo: jurnalMekari, box: { w: 87.03, h: 42.65, x: 6.48, y: 28.68 } },
  { name: 'Digital Journal', logo: digitalJournal, box: { w: 74.88, h: 113.97, x: 12.56, y: -6.99 } },
  { name: 'Jurnal Ilmiah', logo: jurnalIlmiah, box: { w: 90.8, h: 42.65, x: 4.6, y: 28.68 } },
  { name: 'Journal Stories', logo: journalStories, box: { w: 89.19, h: 38.24, x: 5.41, y: 30.88 } },
  { name: 'Rumah Jurnal', logo: rumahJurnal, box: { w: 90.94, h: 41.18, x: 4.53, y: 29.41 } },
]

/* key → poll.options.<key> */
export const pollOptions = ['o1', 'o2', 'o3', 'o4', 'o5']
