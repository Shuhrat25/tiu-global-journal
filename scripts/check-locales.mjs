/**
 * Verifies that every locale has exactly the same keys and {placeholders}
 * as the source locale (uz-Cyrl) and that no message is empty.
 * Cabinet texts (src/locales/cabinet/<locale>/index.js) are checked as the
 * `cabinet` subtree, the same way src/i18n/index.js merges them.
 *
 *   npm run i18n:check            — all locales
 *   npm run i18n:check -- ru en   — only the given locales
 */
import { access, readdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const SOURCE = 'uz-Cyrl'
const localesDir = fileURLToPath(new URL('../src/locales/', import.meta.url))

/** flattens { a: { b: 'x' } } → { 'a.b': 'x' } */
function flatten(object, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(object)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') flatten(value, fullKey, out)
    else out[fullKey] = value
  }
  return out
}

/* unique placeholder names — a plural message repeats {n} once per form */
const placeholders = (message) =>
  [...new Set([...String(message).matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort().join(',')

const exists = (file) => access(file).then(() => true, () => false)
const load = async (file) => (await import(pathToFileURL(file).href)).default

const only = process.argv.slice(2)
let problems = 0
const report = (locale, message) => {
  problems += 1
  console.error(`✖ [${locale}] ${message}`)
}

const files = (await readdir(localesDir)).filter((file) => file.endsWith('.js'))
const locales = {}
for (const file of files) {
  const locale = path.basename(file, '.js')
  const messages = await load(path.join(localesDir, file))
  const cabinetIndex = path.join(localesDir, 'cabinet', locale, 'index.js')
  if (await exists(cabinetIndex)) messages.cabinet = await load(cabinetIndex)
  locales[locale] = flatten(messages)
}

const source = locales[SOURCE]
for (const [locale, messages] of Object.entries(locales)) {
  if (only.length && !only.includes(locale)) continue
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value !== 'string' || !value.trim()) {
      report(locale, `empty message: ${key}`)
      continue
    }
    // "|" separates plural forms (only messages with a {n}/{count} may have them),
    // "@" starts a linked message and "$" a list/modifier in vue-i18n
    const isCount = /\{(n|count)\}/.test(source[key] ?? value)
    if (/[@$]/.test(value) || (value.includes('|') && !isCount)) report(locale, `special character in ${key}: ${value}`)
  }
  if (locale === SOURCE) continue

  for (const key of Object.keys(source)) {
    if (!(key in messages)) report(locale, `missing key: ${key}`)
    else if (placeholders(source[key]) !== placeholders(messages[key])) {
      report(locale, `placeholders differ in ${key}: "${messages[key]}"`)
    }
  }
  for (const key of Object.keys(messages)) {
    if (!(key in source)) report(locale, `unknown key: ${key}`)
  }
}

const count = Object.keys(source).length
const cabinetCount = Object.keys(source).filter((key) => key.startsWith('cabinet.')).length
if (problems) {
  console.error(`\n${problems} problem(s) found.`)
  process.exit(1)
}
const checked = only.length ? only.join(', ') : `${Object.keys(locales).length} locales`
console.log(`✔ ${checked}: ${count} keys each (${cabinetCount} in the cabinet) — all consistent with ${SOURCE}.`)
