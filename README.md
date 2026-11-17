# TIU Global tadqiqotlar va innovatsiyalar ilmiy jurnali

Responsive website of the Tashkent International University scientific journal,
built with **Vue 3 + Vite** from the Figma design: the public pages and a personal cabinet
(admin panel) for authors, editors and reviewers. Four interface languages.

**Live:** https://tiu-global-journal.vercel.app — deployed on Vercel from `main` (every push redeploys).
The cabinet is at `/login` (demo: choose a role, no password).

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
npm run preview      # serve the production build
npm run i18n:check   # every locale (site + cabinet) has the same keys/placeholders as uz-Cyrl
npm run i18n:latin   # regenerate the Uzbek Latin texts from uz-Cyrl
```

## Stack

- Vue 3 (`<script setup>`, Composition API), Vue Router 4, vue-i18n 11, Pinia 3 (cabinet data)
- Vite 6
- Plain CSS with design tokens (CSS custom properties) and scoped component styles — no UI framework
- Fonts: the platform UI font closest to the design's SF Pro Display (SF Pro on Apple, Segoe UI Variable on Windows),
  with self-hosted Inter (`@fontsource/inter`) as the fallback

## Pages

| Route              | Page                                      |
|--------------------|-------------------------------------------|
| `/`                | Home                                      |
| `/requirements`    | Мақолаларга қўйиладиган талаблар          |
| `/editorial-board` | Таҳририят жамоаси (two tabs)              |
| `/contact`         | Боғланиш (contacts, form, map)            |
| `/login`           | Cabinet sign-in (demo: choose a role)     |
| `/cabinet/...`     | Personal cabinet — see below              |

## Languages

| Code      | Language                                   |
|-----------|--------------------------------------------|
| `uz-Cyrl` | Uzbek, Cyrillic — source language, default |
| `uz-Latn` | Uzbek, Latin script (2026 alphabet) — generated from `uz-Cyrl` |
| `ru`      | Russian                                    |
| `en`      | English                                    |

- All visible text lives in `src/locales/<code>.js` (site) and `src/locales/cabinet/<code>/` (cabinet, merged
  under `cabinet.*`); components only use `t('key')`.
- `uz-Cyrl.js` is the source of truth — `npm run i18n:check` fails if another locale misses a key,
  has an extra one or changes a `{placeholder}`.
- The chosen language is remembered in `localStorage` and applied to `<html lang>`, the page title and
  the meta description.
- Dates are formatted in code (`src/i18n/dates.js`), Russian plural forms use `Intl.PluralRules`.

### Uzbek Latin: the 2026 alphabet

- The Latin version uses the alphabet approved by the Law of the Republic of Uzbekistan **OʻRQ-1184 of 21.10.2026**
  (28 letters and the tutuq belgisi): Oʻ → **Ö**, Gʻ → **Ğ**, Sh → **Ş**, Ch → **Ç**; Ng is no longer a separate
  letter (n + g is still written); the tutuq belgisi **ʼ** stays. The law takes effect on 22.04.2027;
  UzA, gov.uz and kun.uz already publish in the new letters. The language is called **Özbekça** in the switcher.
- `src/locales/uz-Latn.js` and `src/locales/cabinet/uz-Latn/` are **generated** — never edited by hand:
  `npm run i18n:latin` transliterates the Cyrillic source with `scripts/transliterate-uz.mjs`.
- Until new spelling rules are adopted, the rules in force (Cabinet of Ministers Resolution 339) apply with the four
  letters substituted: е → ye at the start of a word and after a vowel, ц → s / ts (after a vowel), ъ → ʼ,
  ь is dropped (y before и/о), сҳ → sʼh, and the official spellings sentabr, oktabr, budjet.
  Examples: Ўзбекча → Özbekça, Боғланиш → Boğlaniş, Мақола юбориш → Maqola yuboriş, АҚШ → AQŞ, мўъжиза → möjiza.
- The 1995 letters are kept next to the new ones in `ALPHABET` (top of the script): switching back is a
  four-value change and `npm run i18n:latin`.

## Personal cabinet (admin panel)

Built from the Figma sections *Muallif*, *Muharrir* and *Retsenzent* and from the comments left on them
(stat cards that filter the table, «Нашрга берилган» card, search, status and calendar filters, pagination,
«Тақриз хулосалари» page, payments for the author and the editor, a reason form when a reviewer declines, …).

**Demo mode.** There is no backend yet: `/login` lets you pick a role, and all data lives in a Pinia store
(`src/stores/journal.js`) persisted to `localStorage` (`tiu-cabinet-v2`), seeded from `src/data/cabinet-seed.js`.
“Reset demo data” on the login page restores the seed. The store's actions are the future API calls.
Open tabs stay in sync (a `storage` listener), and each tab keeps its own signed-in role (`sessionStorage`),
so the author, editor and reviewer can work side by side in three tabs and see each other's actions live.

| Role     | Routes                                                                    | What it does |
|----------|---------------------------------------------------------------------------|--------------|
| Author   | `/cabinet/author`, `/author/payments`, `/author/notifications`            | 3-step submission wizard (validation, 50-word abstract, DOC/DOCX/PDF up to 10 MB), article table with filters, editor comments and revision upload, payment of the publication fee, payment history |
| Editor   | `/cabinet/editor`, `/editor/reviews`, `/editor/payments`, `/editor/notifications` | 6 stat cards, incoming articles; initial check → reject (with reason) / request revision / send to a reviewer; review reports and the final decision; payments and “mark as published” |
| Reviewer | `/cabinet/reviewer`, `/reviewer/notifications`                            | Invitations (accept / decline with a reason), review form with drafts, submitted reviews |

**Article lifecycle** (`ARTICLE_STATUSES` in the store; every action checks the current status):

```
submitted ──initial check──▶ rejected | revision | in_review
in_review ──review──▶ reviewed ──final decision──▶ accepted | revision (minor/major) | rejected
accepted ──author pays──▶ paid ──editor──▶ published
revision ──author uploads a revised file──▶ submitted
```

Every step notifies the other side (notification templates in `src/locales/cabinet/*/notifications.js`).
Routes are guarded: an anonymous visit goes to `/login?redirect=…`, a wrong role is sent back to the login page.

Shared building blocks live in `src/components/cabinet/` (accessible modal with a focus trap and scroll lock,
data table that turns into cards on phones, toolbar with search/status/period filters, pagination, stepper,
file drop, form field, stat card, status badge, notices) and `src/composables/` (`useTableQuery`, `useMediaQuery`).

## Structure

```
src/
├── assets/            images and icons exported from Figma
├── components/
│   ├── ui/            AppIcon, AppLink, BaseButton, SectionHeader, LogoBox
│   ├── layout/        AppHeader, LanguageSwitcher, AppFooter, SocialSidebar, ChatButton
│   ├── home/          one component per home page section
│   ├── page/          PageBanner (breadcrumbs), AboutSidebar, PageWithSidebar
│   └── cabinet/       shared cabinet components + author/, editor/, reviewer/ dialogs and parts
├── composables/       useTableQuery (search, filters, pagination), useMediaQuery
├── data/              structure and non-text data (ids, images, links, numbers), cabinet demo seed
├── i18n/              vue-i18n setup, supported locales, date formatting
├── layouts/           CabinetLayout (sidebar, mobile drawer, language switcher, user block)
├── locales/           translations: uz-Cyrl (source), uz-Latn (generated), ru, en; cabinet/<code>/
├── router/            routes and the cabinet guard
├── stores/            journal.js — cabinet data and actions (Pinia, persisted)
├── styles/            variables.css (design tokens), base.css, cabinet.css
├── utils/             formatting helpers
└── views/             site pages; cabinet/ (login, notifications, author/, editor/, reviewer/)
```

## Responsive behaviour

| Width       | Layout                                                                 |
|-------------|------------------------------------------------------------------------|
| ≥ 1280px    | Design layout (1920px frame, 1500px container), full desktop menu       |
| 1024–1279px | Burger menu, 2-column categories, news as a swipeable row               |
| 768–1023px  | 1-column articles, stacked form/poll and page sidebars, no social rail |
| < 768px     | Mobile: compact header, 1–2 column grids, 2 logos per carousel slide    |

## Interactive parts

- Header dropdown menus (hover/click, Esc and outside click close them), mobile accordion menu, search panel,
  working language switcher, sticky navigation, active menu item for the current page
- Indexing carousel: infinite loop, arrows, dots, autoplay (paused on hover/focus and with `prefers-reduced-motion`)
- Contact form: validation (messages follow the language), `+998 XX XXX XX XX` phone mask, drag & drop file input
- Poll with selectable options, editorial board tabs with keyboard navigation, embedded map
- “Submit an article” buttons open the author's submission wizard (through the sign-in page when needed)
