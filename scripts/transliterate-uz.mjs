/**
 * Generates src/locales/uz-Latn.js from src/locales/uz-Cyrl.js.
 *
 *   npm run i18n:latin
 *
 * Letters: the Latin alphabet of Law OʻRQ-1184 (21.10.2026) — ў → ö, ғ → ğ, ш → ş, ч → ç,
 * ъ → ʼ (tutuq belgisi). Spelling: the rules in force ("Oʻzbek tilining asosiy imlo
 * qoidalari", Cabinet Res. 339) with those four letters substituted, until new rules
 * are adopted:
 *   е → ye at the start of a word and after vowels/ъ/ь, otherwise e;
 *   ц → s at the start/after consonants, ts after vowels;
 *   ъ → ʼ (not written before е/ё/ю/я in Russian loans or after ў: мўъжиза → möjiza);
 *   ь is dropped (y before и/о); сҳ → sʼh; сентябрь/октябрь/бюджет → sentabr/oktabr/budjet.
 * Latin fragments (brand names, Microsoft Word…) and {placeholders} are left untouched.
 *
 * The letters that differ between alphabet editions are configured in ALPHABET.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

/*
 * Letters of the Latin alphabet used by the site: the alphabet approved by
 * Law OʻRQ-1184 of 21.10.2026 (Ö Ğ Ş Ç; in force from 22.04.2027, already used by
 * UzA, gov.uz and kun.uz). The 1995 letters are kept in comments for reference.
 */
export const ALPHABET = {
  o: 'ö', // ў   — 1995: oʻ
  g: 'ğ', // ғ   — 1995: gʻ
  sh: 'ş', // ш  — 1995: sh
  ch: 'ç', // ч  — 1995: ch
  tutuq: 'ʼ', // ъ — tutuq belgisi U+02BC, unchanged
}

const VOWELS = new Set('аеёиоуэюяў')

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)

function mapLetter(char, prev, next) {
  switch (char) {
    case 'а': return 'a'
    case 'б': return 'b'
    case 'в': return 'v'
    case 'г': return 'g'
    case 'д': return 'd'
    case 'е': return !prev || VOWELS.has(prev) || prev === 'ъ' || prev === 'ь' ? 'ye' : 'e'
    case 'ё': return 'yo'
    case 'ж': return 'j'
    case 'з': return 'z'
    case 'и': return 'i'
    case 'й': return 'y'
    case 'к': return 'k'
    case 'л': return 'l'
    case 'м': return 'm'
    case 'н': return 'n'
    case 'о': return 'o'
    case 'п': return 'p'
    case 'р': return 'r'
    case 'с': return 's'
    case 'т': return 't'
    case 'у': return 'u'
    case 'ф': return 'f'
    case 'х': return 'x'
    case 'ц': return prev && VOWELS.has(prev) ? 'ts' : 's'
    case 'ч': return ALPHABET.ch
    case 'ш': return ALPHABET.sh
    case 'щ': return ALPHABET.sh + ALPHABET.ch // Russian names only (1995: shch)
    // ъ before е/ё/ю/я (Russian loanwords: объект → obyekt) is absorbed by the "y";
    // after ў it is not written (мўъжиза → moʻjiza); otherwise it is the glottal stop.
    case 'ъ': return next && 'еёюя'.includes(next) ? '' : prev === 'ў' ? '' : ALPHABET.tutuq
    case 'ы': return 'i'
    // ь is not written, but before и/о it becomes y: бульон → bulyon (before е/ё/ю/я the y comes from the vowel)
    case 'ь': return next && 'ио'.includes(next) ? 'y' : ''
    case 'э': return 'e'
    case 'ю': return 'yu'
    case 'я': return 'ya'
    case 'ў': return ALPHABET.o
    case 'қ': return 'q'
    case 'ғ': return ALPHABET.g
    // сҳ keeps the tutuq (Исҳоқ → Isʼhoq, Res. 339 §17) until the new spelling rules say otherwise
    case 'ҳ': return prev === 'с' ? `${ALPHABET.tutuq}h` : 'h'
    default: return null // not a Cyrillic letter
  }
}

/* Words whose official Latin spelling is not letter-by-letter (matched as word stems) */
const EXCEPTIONS = {
  сентябр: 'sentabr', // Res. 339 §1; OʻRQ-1184: «10-sentabrda»
  октябр: 'oktabr', // OʻRQ-1184: «21-oktabr»
  бюджет: 'budjet', // Budget Code, OʻRQ-1105: «Davlat budjeti»
}

/** Transliterates one word made of Cyrillic letters. */
function transliterateWord(word) {
  const lower = word.toLowerCase()
  const isAllCaps = word.length > 1 && word === word.toUpperCase() && word !== lower
  const stem = Object.keys(EXCEPTIONS).find((s) => lower.startsWith(s))
  let result = stem ? EXCEPTIONS[stem] : ''
  if (stem && word[0] !== lower[0] && !isAllCaps) result = capitalize(result)
  for (let i = stem ? stem.length : 0; i < lower.length; i += 1) {
    const latin = mapLetter(lower[i], lower[i - 1], lower[i + 1]) ?? lower[i]
    const isUpper = word[i] !== lower[i]
    result += isUpper && !isAllCaps ? capitalize(latin) : latin
  }
  return isAllCaps ? result.toUpperCase() : result
}

/** Transliterates a message, keeping {placeholders} and non-Cyrillic text intact. */
export function transliterate(message) {
  return message
    .split(/(\{\w+\})/)
    .map((part) => (/^\{\w+\}$/.test(part) ? part : part.replace(/[Ѐ-ӿ]+/g, (word) => transliterateWord(word))))
    .join('')
}

function convert(value) {
  if (typeof value === 'string') return transliterate(value)
  return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, convert(inner)]))
}

const BANNER = (from) => `/*
 * Uzbek (Latin script).
 * AUTO-GENERATED from ${from} by \`npm run i18n:latin\` — do not edit by hand:
 * change the Cyrillic source (or the alphabet table in scripts/transliterate-uz.mjs) and regenerate.
 */
`

async function generate(sourceUrl, targetUrl, label) {
  const { default: source } = await import(sourceUrl.href)
  await writeFile(fileURLToPath(targetUrl), `${BANNER(label)}export default ${JSON.stringify(convert(source), null, 2)}\n`, 'utf8')
  console.log(`✔ ${fileURLToPath(targetUrl)}`)
}

/* Run as a script: regenerate the site and cabinet Latin locales */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const locales = new URL('../src/locales/', import.meta.url)
  await generate(new URL('uz-Cyrl.js', locales), new URL('uz-Latn.js', locales), 'uz-Cyrl.js')

  // cabinet texts: one file per section, plus the same index.js aggregator
  const cabinetSource = new URL('cabinet/uz-Cyrl/', locales)
  const cabinetTarget = new URL('cabinet/uz-Latn/', locales)
  await mkdir(cabinetTarget, { recursive: true })
  for (const file of await readdir(cabinetSource)) {
    if (!file.endsWith('.js')) continue
    if (file === 'index.js') {
      const index = await readFile(new URL(file, cabinetSource), 'utf8')
      await writeFile(new URL(file, cabinetTarget), index.replace('(Uzbek, Cyrillic)', '(Uzbek, Latin — generated)'), 'utf8')
      continue
    }
    await generate(new URL(file, cabinetSource), new URL(file, cabinetTarget), `cabinet/uz-Cyrl/${file}`)
  }
}
