import { i18n } from '@/i18n'

const API_URL = 'https://journal.tiu.uz/api/v1'

function getLang() {
  return i18n.global.locale.value === 'uz-Cyrl' ? 'uz' : 'oz'
}

async function getData(path, lang = getLang()) {
  const response = await fetch(`${API_URL}/${path}`, {
    headers: { 'Accept-Language': lang },
  })
  return response.json()
}

export async function getBases() {
  const json = await getData('main/bases')
  return json.data
}

export async function getPartners() {
  const json = await getData('main/partners')
  return json.data
}

export async function getStats() {
  const json = await getData('main/stats')
  return json.data
}

export async function getCategories() {
  const json = await getData('main/category?limit=8&offset=0')
  return json.data
}

export async function getGallery() {
  const json = await getData('gallery')
  return json.data[0]
}

export async function getNews() {
  const json = await getData('news/list/news?limit=5&offset=0', 'oz')
  return json.data
}

export async function getPosts() {
  const json = await getData('posts?limit=6&offset=0', 'oz')
  return json.data
}

export async function getSocials() {
  const json = await getData('main/social')
  return json.data
}

export async function getContacts() {
  const pages = await getData('pages')
  return {
    email: pages.email,
    phone: pages.phone,
    phoneHref: '+' + pages.phone.replace(/\D/g, ''),
  }
}

export async function getPollResults() {
  const json = await getData('polls/show')
  return json.results
}

export async function sendVote(option) {
  const response = await fetch(`${API_URL}/polls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ option }),
  })
  if (!response.ok) throw new Error('Голос не отправлен')
}

export async function sendFeedback(formData) {
  const response = await fetch(`${API_URL}/feedback-send`, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) throw new Error('Вопрос не отправлен')
}

export function toIsoDate(date) {
  return date.split('.').reverse().join('-')
}

export async function getMenu() {
  const json = await getData('menu')
  return json.data
}

export function menuLink(item) {
  if (item.inner_link === 'manage') return '/editorial-board'
  if (item.inner_link === 'contacts') return '/contact'
  if (item.inner_link === 'lists/magazines') return '/issues'
  return '/menu/' + item.alias
}

export async function getMenuPage(alias) {
  const json = await getData('menu/' + alias)
  return json.data
}

export async function getNewsPage(page) {
  const offset = (page - 1) * 9
  return getData(`news/list/news?limit=9&offset=${offset}&order=date+desc`, 'oz')
}

export async function getNewsItem(alias) {
  const json = await getData('news/news/' + alias, 'oz')
  return json.data
}

export async function getPost(alias) {
  const json = await getData('posts/' + alias, 'oz')
  return json.data
}

export async function getIssuePosts(issueId) {
  const json = await getData(`posts?issue=${issueId}&limit=100`, 'oz')
  return json.data
}

export async function downloadPost(post) {
  const response = await fetch(post.download_url, { method: 'POST' })
  if (!response.ok) throw new Error('Файл не скачался')
  const blob = await response.blob()

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = post.title + '.pdf'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(link.href)
}

export async function getIssues() {
  const json = await getData('main/numbers?limit=100')
  return json.data
}

export async function getIssue(alias) {
  const json = await getData('main/numbers/' + alias)
  return json.data
}

export async function getCategoriesPage(page) {
  const offset = (page - 1) * 12
  return getData(`main/category?limit=12&offset=${offset}&order=date+desc`)
}

export async function getCategory(alias) {
  const json = await getData('main/category/' + alias, 'oz')
  return json.data
}

export async function getCategoryPosts(categoryTitle) {
  const json = await getData('posts?limit=100', 'oz')
  return json.data.filter((post) => post.category && post.category.title === categoryTitle)
}

export async function getEditorial(option) {
  const json = await getData(`main/manage?option=${option}&limit=100&offset=0&order=id+desc&lang=${getLang()}`)
  return json.data
}

export async function search(query) {
  return getData(`search?query=${encodeURIComponent(query)}&limit=27&offset=0&lang=oz`, 'oz')
}
