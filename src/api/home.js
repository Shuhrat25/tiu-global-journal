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
