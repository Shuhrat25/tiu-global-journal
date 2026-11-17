import { i18n } from '@/i18n'

/**
 * 300000 → "300 000" (Uzbek, Russian) · "300,000" (English); the interface language by default.
 * The space is a no-break one (U+00A0, written as an escape so that it stays visible here),
 * so a sum never wraps between its groups; in '{amount} сўм' the line may still break before
 * the currency.
 */
export function formatAmount(value, locale = i18n.global.locale.value) {
  const separator = locale === 'en' ? ',' : ' '
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

/**
 * Demo download: there is no file storage yet, so a small text file with the
 * article details is generated in the browser and saved under the original name.
 */
export function downloadTextFile(fileName, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName.replace(/\.(docx?|pdf)$/i, '') + '.txt'
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
