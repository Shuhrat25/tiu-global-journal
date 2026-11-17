import flagUz from '@/assets/images/flag-uz.png'
import flagRu from '@/assets/images/flag-ru.svg'
import flagGb from '@/assets/images/flag-gb.svg'

/**
 * Supported interface languages.
 * `label` is the endonym (the language name written in that language),
 * so it never changes when the interface language changes.
 * `crop` keeps the crescent of the Uzbek flag visible inside the round icon.
 */
export const LOCALES = [
  { code: 'uz-Cyrl', label: 'Ўзбекча', flag: flagUz, crop: true },
  // Latin script per Law OʻRQ-1184 (2026): Ö Ğ Ş Ç — "Oʻzbekcha" in the 1995 spelling
  { code: 'uz-Latn', label: 'Özbekça', flag: flagUz, crop: true },
  { code: 'ru', label: 'Русский', flag: flagRu },
  { code: 'en', label: 'English', flag: flagGb },
]

export const DEFAULT_LOCALE = 'uz-Cyrl'

export const LOCALE_CODES = LOCALES.map((l) => l.code)

export function isSupportedLocale(code) {
  return LOCALE_CODES.includes(code)
}
