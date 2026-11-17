/*
 * Date formatting for the supported locales.
 * Intl.DateTimeFormat has no reliable data for both Uzbek scripts in every
 * browser, so month names and patterns are defined explicitly here.
 */

const MONTHS = {
  'uz-Cyrl': ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  'uz-Latn': ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  ru: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}

// Russian needs the genitive case after a day number: "18 ноября 2025"
const MONTHS_RU_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)

/** Parses "YYYY-MM-DD" without timezone shifts. */
function parse(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return { year, month: month - 1, day }
}

/** 18-ноябрь, 2025 · 18-noyabr, 2025 · 18 ноября 2025 · November 18, 2025 */
export function formatDate(iso, locale) {
  const { year, month, day } = parse(iso)
  switch (locale) {
    case 'ru':
      return `${day} ${MONTHS_RU_GENITIVE[month]} ${year}`
    case 'en':
      return `${MONTHS.en[month]} ${day}, ${year}`
    default:
      return `${day}-${(MONTHS[locale] ?? MONTHS['uz-Cyrl'])[month]}, ${year}`
  }
}

/** Ноябрь 2025 · Noyabr 2025 · November 2025 */
export function formatMonthYear(iso, locale) {
  const { year, month } = parse(iso)
  const months = MONTHS[locale] ?? MONTHS['uz-Cyrl']
  return `${capitalize(months[month])} ${year}`
}
