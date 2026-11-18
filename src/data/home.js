/*
 * Home page data. Texts are translated in src/locales/* and looked up
 * by the item `id` (e.g. categories.items.c1.title, news.items.n1).
 */
import news1 from '@/assets/images/news/news-1.jpg'
import news2 from '@/assets/images/news/news-2.jpg'
import news3 from '@/assets/images/news/news-3.jpg'
import news4 from '@/assets/images/news/news-4.jpg'
import news5 from '@/assets/images/news/news-5.jpg'

export const latestIssue = {
  number: 12,
  year: 2025,
  published: '2025-11-01',
}

export const heroStats = [
  { key: 'articles', value: '500+' },
  { key: 'authors', value: '200+' },
  { key: 'countries', value: '15+' },
]

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

export const news = [
  { id: 'n1', image: news1, date: '2025-11-18', views: 238 },
  { id: 'n2', image: news2, date: '2025-11-08', views: 456 },
  { id: 'n3', image: news3, date: '2025-11-03', views: 187 },
  { id: 'n4', image: news4, date: '2025-11-07', views: 67 },
  { id: 'n5', image: news5, date: '2025-11-11', views: 123 },
]

const doiLink = 'https://doi.org/10.35465/ku.v16i.1254'

export const articles = [
  { id: 'a1', pages: [5, 12], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
  { id: 'a2', pages: [13, 22], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
  { id: 'a3', pages: [23, 31], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
  { id: 'a4', pages: [32, 40], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
  { id: 'a5', pages: [41, 48], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
  { id: 'a6', pages: [49, 57], doi: doiLink, date: '2025-11-21', views: 876, downloads: 298 },
]

export const pollOptions = ['o1', 'o2', 'o3', 'o4', 'o5']
