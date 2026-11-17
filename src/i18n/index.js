import { createI18n } from 'vue-i18n'

import uzCyrl from '@/locales/uz-Cyrl'
import uzLatn from '@/locales/uz-Latn'
import ru from '@/locales/ru'
import en from '@/locales/en'
import { DEFAULT_LOCALE, isSupportedLocale } from './locales'

/* Cabinet texts live in src/locales/cabinet/<locale>/ and are merged under the `cabinet` key */
const cabinetModules = import.meta.glob('../locales/cabinet/*/index.js', { eager: true, import: 'default' })
const cabinetMessages = Object.fromEntries(
  Object.entries(cabinetModules).map(([path, messages]) => [path.split('/').at(-2), messages]),
)
const withCabinet = (locale, messages) => ({ ...messages, cabinet: cabinetMessages[locale] ?? {} })

const STORAGE_KEY = 'tiu-locale'

function readStoredLocale() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return isSupportedLocale(value) ? value : null
  } catch {
    return null // storage can be unavailable (private mode, blocked cookies)
  }
}

/* Russian has three plural forms: 1 статья · 2 статьи · 5 статей */
const russianPluralIndex = { one: 0, few: 1, many: 2, other: 2 }
function russianPlural(choice, choicesLength) {
  const index = russianPluralIndex[new Intl.PluralRules('ru').select(choice)]
  return Math.min(index, choicesLength - 1)
}

export const i18n = createI18n({
  legacy: false,
  locale: readStoredLocale() ?? DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    'uz-Cyrl': withCabinet('uz-Cyrl', uzCyrl),
    'uz-Latn': withCabinet('uz-Latn', uzLatn),
    ru: withCabinet('ru', ru),
    en: withCabinet('en', en),
  },
  pluralRules: { ru: russianPlural },
  missingWarn: import.meta.env.DEV,
  fallbackWarn: false,
})

export function setLocale(code) {
  if (!isSupportedLocale(code)) return
  i18n.global.locale.value = code
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* the choice just won't be remembered */
  }
}
