import { i18n } from '@/i18n'

// API настоящего сайта журнала: https://journal.tiu.uz
const API_URL = 'https://journal.tiu.uz/api/v1'

// API знает только узбекский: uz — кириллица, oz — латиница.
// Для русского и английского текстов в API нет, поэтому берём латиницу.
function getLang() {
  return i18n.global.locale.value === 'uz-Cyrl' ? 'uz' : 'oz'
}

// Общий GET-запрос. Без Accept-Language API отдаёт title = null
async function getData(path, lang = getLang()) {
  const response = await fetch(`${API_URL}/${path}`, {
    headers: { 'Accept-Language': lang },
  })
  return response.json()
}

// Международные базы индексации (карусель на главной)
export async function getBases() {
  const json = await getData('main/bases')
  return json.data
}

// Партнёры (блок «Ҳамкорлар»)
export async function getPartners() {
  const json = await getData('main/partners')
  return json.data
}

// Цифры в первом блоке (статьи, авторы, страны)
export async function getStats() {
  const json = await getData('main/stats')
  return json.data
}

// Направления журнала
export async function getCategories() {
  const json = await getData('main/category?limit=8&offset=0')
  return json.data
}

// Последний номер журнала (баннер с обложкой)
export async function getGallery() {
  const json = await getData('gallery')
  return json.data[0]
}

// Новости. Заголовки у новостей есть только на латинице (oz)
export async function getNews() {
  const json = await getData('news/list/news?limit=5&offset=0', 'oz')
  return json.data
}

// Последние статьи. Заголовки у статей тоже только на латинице (oz)
export async function getPosts() {
  const json = await getData('posts?limit=6&offset=0', 'oz')
  return json.data
}

// Соцсети (боковая панель слева)
export async function getSocials() {
  const json = await getData('main/social')
  return json.data
}

// Почта и телефон журнала (из общих данных сайта pages)
export async function getContacts() {
  const pages = await getData('pages')
  return {
    email: pages.email,
    phone: pages.phone,
    phoneHref: '+' + pages.phone.replace(/\D/g, ''), // "+998 (95) 449-21-26" → "+998954492126"
  }
}

// Результаты опроса: { result_1: 103, result_2: 22, ... }
export async function getPollResults() {
  const json = await getData('polls/show')
  return json.results
}

// Отправить голос в опросе. option — номер ответа от 1 до 5
export async function sendVote(option) {
  const response = await fetch(`${API_URL}/polls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ option }),
  })
  if (!response.ok) throw new Error('Голос не отправлен')
}

// Отправить вопрос из формы «Саволларингиз борми?»
export async function sendFeedback(formData) {
  const response = await fetch(`${API_URL}/feedback-send`, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) throw new Error('Вопрос не отправлен')
}

// Даты в API приходят как "09.09.2026", а нам нужно "2026-09-09"
export function toIsoDate(date) {
  return date.split('.').reverse().join('-')
}

// ---------- Меню и страницы меню ----------

// Меню сайта: разделы, у разделов есть children (подпункты)
export async function getMenu() {
  const json = await getData('menu')
  return json.data
}

// Куда ведёт пункт меню. У обычных страниц есть только alias,
// а у некоторых пунктов есть inner_link — ссылка на свою страницу сайта
export function menuLink(item) {
  if (item.inner_link === 'manage') return '/editorial-board'
  if (item.inner_link === 'contacts') return '/contact'
  if (item.inner_link === 'lists/magazines') return '/issues'
  return '/menu/' + item.alias
}

// Страница меню (например «Умумий маълумот»): title и content (HTML)
export async function getMenuPage(alias) {
  const json = await getData('menu/' + alias)
  return json.data
}

// ---------- Новости ----------

// Новости по страницам: по 9 штук. Возвращает { data, total }
export async function getNewsPage(page) {
  const offset = (page - 1) * 9
  return getData(`news/list/news?limit=9&offset=${offset}&order=date+desc`, 'oz')
}

// Одна новость по alias
export async function getNewsItem(alias) {
  const json = await getData('news/news/' + alias, 'oz')
  return json.data
}

// ---------- Статьи ----------

// Одна статья по alias (API при этом засчитывает просмотр)
export async function getPost(alias) {
  const json = await getData('posts/' + alias, 'oz')
  return json.data
}

// Статьи одного номера журнала
export async function getIssuePosts(issueId) {
  const json = await getData(`posts?issue=${issueId}&limit=100`, 'oz')
  return json.data
}

// Скачать статью. Так же делает настоящий сайт: POST на download_url
// (API засчитывает скачивание и отдаёт файл), потом сохраняем файл на компьютер
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

// ---------- Номера журнала ----------

// Все номера журнала
export async function getIssues() {
  const json = await getData('main/numbers?limit=100')
  return json.data
}

// Один номер журнала по alias
export async function getIssue(alias) {
  const json = await getData('main/numbers/' + alias)
  return json.data
}

// ---------- Направления (категории) ----------

// Направления по страницам: по 12 штук. Возвращает { data, total }
export async function getCategoriesPage(page) {
  const offset = (page - 1) * 12
  return getData(`main/category?limit=12&offset=${offset}&order=date+desc`)
}

// Одно направление по alias. Берём на латинице (oz), как и статьи,
// чтобы название направления совпадало с category.title у статей
export async function getCategory(alias) {
  const json = await getData('main/category/' + alias, 'oz')
  return json.data
}

// Статьи одного направления. API не умеет фильтровать статьи по направлению,
// поэтому берём все статьи и оставляем только те, у которых такое же название направления
export async function getCategoryPosts(categoryTitle) {
  const json = await getData('posts?limit=100', 'oz')
  return json.data.filter((post) => post.category && post.category.title === categoryTitle)
}

// ---------- Редакция ----------

// Таҳририят жамоаси: option 1 — состав совета, option 2 — члены совета
export async function getEditorial(option) {
  const json = await getData(`main/manage?option=${option}&limit=100&offset=0&order=id+desc&lang=${getLang()}`)
  return json.data
}

// ---------- Поиск ----------

// Поиск по новостям и статьям. Возвращает { data, total }
export async function search(query) {
  return getData(`search?query=${encodeURIComponent(query)}&limit=27&offset=0&lang=oz`, 'oz')
}
