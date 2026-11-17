/*
 * Demo data for the personal cabinets (author / editor / reviewer).
 * There is no backend yet, so the store starts from this seed and keeps
 * all changes in localStorage. Dates are relative to "today" (the local calendar date)
 * so the period filters (last week / last month) always have something to show.
 *
 * Article titles, abstracts, comments, reviews and file names are user content —
 * they stay in the language they were written in: Uzbek in the site's Latin script,
 * the 2026 alphabet of Law OʻRQ-1184 (ö ğ ş ç, the tutuq ʼ), like src/locales/uz-Latn.js.
 *
 * After changing this data, bump STORAGE_KEY in src/stores/journal.js:
 * browsers that saved the old demo data then start from the new seed.
 */
import { isoDaysAgo as daysAgo } from '@/utils/date'

export const ARTICLE_FEE = 300000 // so'm

export const PAYMENT_METHODS = ['click', 'payme', 'card', 'bank']

export const USERS = [
  { id: 'u-author', name: 'Aziz Halikov', role: 'author' },
  { id: 'u-editor', name: 'Nurbek Alimov', role: 'editor' },
  { id: 'u-reviewer', name: 'Dr. Sarvar Sarvarov', role: 'reviewer' },
  { id: 'u-reviewer-2', name: 'Dr. Rustam Rustamov', role: 'reviewer' },
]

/* Users you can sign in as on the demo login page */
export const DEMO_ACCOUNTS = { author: 'u-author', editor: 'u-editor', reviewer: 'u-reviewer' }

export function createSeed() {
  const articles = [
    {
      id: 'a1',
      authorId: 'u-author',
      title: 'Iqlimni başorat qilişda maşina örganiş usullari',
      authors: 'Aziz Azizov, Malika Malikova',
      abstract:
        'Maqolada iqlim özgarişini başorat qiliş modellarining aniqligini oşiriş uçun maşina örganiş usullari tahlil qilingan.',
      keywords: 'maşina örganiş, iqlim, başorat',
      conflict: 'Yöq',
      fileName: 'iqlim-başorati.docx',
      submittedAt: daysAgo(2),
      status: 'submitted',
      history: [{ status: 'submitted', date: daysAgo(2) }],
    },
    {
      id: 'a2',
      authorId: 'u-author',
      title: 'Kvant hisoblaş kriptografiyada qöllanilişi',
      authors: 'Bobur Boburov',
      abstract: 'Tadqiqotda kvant algoritmlarining zamonaviy şifrlaş tizimlari xavfsizligiga taʼsiri körib çiqilgan.',
      keywords: 'kvant hisoblaş, kriptografiya, xavfsizlik',
      conflict: 'Yöq',
      fileName: 'kvant-kriptografiya.docx',
      submittedAt: daysAgo(24),
      status: 'revision',
      editorComment:
        'Iltimos, metodologiya bölimini kengaytiring va kvant algoritmlarining amaliy qöllanilişiga oid misollar qöşing. Foydalanilgan adabiyotlar röyxatini OAK talablariga moslang.',
      history: [
        { status: 'submitted', date: daysAgo(24) },
        { status: 'revision', date: daysAgo(10) },
      ],
    },
    {
      id: 'a3',
      authorId: 'u-author',
      title: 'Barqaror energetika tizimlari: keng qamrovli tahlil',
      authors: 'Dilşod Dilşodov, Nodira Nodirova',
      abstract: 'Maqolada qayta tiklanuvçi energiya manbalarini milliy energetika tizimiga integratsiya qiliş masalalari örganilgan.',
      keywords: 'energetika, barqaror rivojlaniş, qayta tiklanuvçi energiya',
      conflict: 'Yöq',
      fileName: 'barqaror-energetika.docx',
      submittedAt: daysAgo(70),
      status: 'published',
      reviewerId: 'u-reviewer-2',
      decision: 'accept',
      paid: true,
      history: [
        { status: 'submitted', date: daysAgo(70) },
        { status: 'in_review', date: daysAgo(62) },
        { status: 'reviewed', date: daysAgo(50) },
        { status: 'accepted', date: daysAgo(45) },
        { status: 'paid', date: daysAgo(40) },
        { status: 'published', date: daysAgo(30) },
      ],
    },
    {
      id: 'a4',
      authorId: 'u-author-2',
      title: 'Tabiiy tilni qayta işlaşda neyron tarmoqlar',
      authors: 'Dilşod Dilşodov',
      abstract: 'Işda transformator arxitekturasiga asoslangan modellarning özbek tilidagi matnlarni tahlil qilişdagi samaradorligi baholangan.',
      keywords: 'NLP, neyron tarmoqlar, transformator',
      conflict: 'Yöq',
      fileName: 'nlp-neyron-tarmoqlar.docx',
      submittedAt: daysAgo(9),
      status: 'reviewed',
      reviewerId: 'u-reviewer',
      history: [
        { status: 'submitted', date: daysAgo(9) },
        { status: 'in_review', date: daysAgo(8) },
        { status: 'reviewed', date: daysAgo(3) },
      ],
    },
    {
      id: 'a5',
      authorId: 'u-author-3',
      title: 'Raqamli iqtisodiyotda blokçeyn texnologiyalari',
      authors: 'Nodira Nodirova',
      abstract: 'Maqolada blokçeyn texnologiyalarining bank va moliya sohasidagi tranzaksiyalar şaffofligiga taʼsiri tahlil qilingan.',
      keywords: 'blokçeyn, raqamli iqtisodiyot, moliya',
      conflict: 'Yöq',
      fileName: 'blokçeyn-iqtisodiyot.docx',
      submittedAt: daysAgo(15),
      status: 'in_review',
      reviewerId: 'u-reviewer',
      history: [
        { status: 'submitted', date: daysAgo(15) },
        { status: 'in_review', date: daysAgo(12) },
      ],
    },
    {
      id: 'a6',
      authorId: 'u-author-4',
      title: 'Tibbiy tasvirlarni tahlil qilişda çuqur örganiş',
      authors: 'Malika Malikova, Rustam Karimov',
      abstract: 'Tadqiqotda kompyuter tomografiyasi tasvirlarida ösmalarni aniqlaş uçun konvolyutsion neyron tarmoqlar qöllanilgan.',
      keywords: 'çuqur örganiş, tibbiyot, tasvirlar tahlili',
      conflict: 'Yöq',
      fileName: 'tibbiy-tasvirlar.docx',
      submittedAt: daysAgo(5),
      status: 'in_review',
      reviewerId: 'u-reviewer',
      history: [
        { status: 'submitted', date: daysAgo(5) },
        { status: 'in_review', date: daysAgo(4) },
      ],
    },
    {
      id: 'a7',
      authorId: 'u-author-5',
      title: 'Oliy taʼlimda masofaviy öqitiş samaradorligi',
      authors: 'Bobur Boburov, Şahzoda Yusupova',
      abstract: 'Maqolada masofaviy taʼlim platformalarining talabalar özlaştirişiga taʼsiri sörovnoma asosida örganilgan.',
      keywords: 'masofaviy taʼlim, oliy taʼlim, samaradorlik',
      conflict: 'Yöq',
      fileName: 'masofaviy-talim.docx',
      submittedAt: daysAgo(48),
      status: 'paid',
      reviewerId: 'u-reviewer-2',
      decision: 'accept',
      paid: true,
      history: [
        { status: 'submitted', date: daysAgo(48) },
        { status: 'in_review', date: daysAgo(44) },
        { status: 'reviewed', date: daysAgo(30) },
        { status: 'accepted', date: daysAgo(26) },
        { status: 'paid', date: daysAgo(6) },
      ],
    },
    {
      id: 'a8',
      authorId: 'u-author-6',
      title: 'Qişloq xöjaligida suv resurslaridan oqilona foydalaniş',
      authors: 'Jamşid Ergaşev',
      abstract: 'Işda tomçilatib suğoriş tizimlarining suv tejaş samaradorligi Farğona vodiysi misolida baholangan.',
      keywords: 'suv resurslari, qişloq xöjaligi, suğoriş',
      conflict: 'Yöq',
      fileName: 'suv-resurslari.docx',
      submittedAt: daysAgo(40),
      status: 'accepted',
      reviewerId: 'u-reviewer-2',
      decision: 'accept',
      history: [
        { status: 'submitted', date: daysAgo(40) },
        { status: 'in_review', date: daysAgo(36) },
        { status: 'reviewed', date: daysAgo(22) },
        { status: 'accepted', date: daysAgo(18) },
      ],
    },
    {
      id: 'a9',
      authorId: 'u-author-7',
      title: 'Yoşlar örtasida kitobxonlik madaniyatini rivojlantiriş',
      authors: 'Gulnora Rahimova',
      abstract: 'Maqolada yoşlarning kitob öqişga bölgan qiziqişini oşiriş yöllari körib çiqilgan.',
      keywords: 'kitobxonlik, yoşlar, madaniyat',
      conflict: 'Yöq',
      fileName: 'kitobxonlik.docx',
      submittedAt: daysAgo(33),
      status: 'rejected',
      rejectReason: 'scope',
      editorComment: 'Maqola mavzusi jurnal yönalişlariga mos kelmaydi.',
      history: [
        { status: 'submitted', date: daysAgo(33) },
        { status: 'rejected', date: daysAgo(31) },
      ],
    },
    {
      id: 'a10',
      authorId: 'u-author-8',
      title: 'Kiçik biznesni moliyalaştirişning muqobil manbalari',
      authors: 'Otabek Qodirov',
      abstract: 'Tadqiqotda kraudfanding va mikromoliya institutlarining kiçik biznes rivojiga taʼsiri tahlil qilingan.',
      keywords: 'kiçik biznes, moliyalaştiriş, kraudfanding',
      conflict: 'Yöq',
      fileName: 'kiçik-biznes.docx',
      submittedAt: daysAgo(6),
      status: 'submitted',
      history: [{ status: 'submitted', date: daysAgo(6) }],
    },
    {
      id: 'a11',
      authorId: 'u-author-9',
      title: 'Özbek tilida termin yasalişining zamonaviy tendensiyalari',
      authors: 'Mohira Aminova',
      abstract: 'Maqolada axborot texnologiyalari sohasidagi yangi terminlarning özbek tilida yasaliş usullari tahlil qilingan.',
      keywords: 'terminologiya, özbek tili, söz yasalişi',
      conflict: 'Yöq',
      fileName: 'terminologiya.docx',
      submittedAt: daysAgo(12),
      status: 'submitted',
      history: [{ status: 'submitted', date: daysAgo(12) }],
    },
    {
      id: 'a12',
      authorId: 'u-author-10',
      title: 'Sunʼiy intellekt va mehnat bozori: imkoniyatlar va xavflar',
      authors: 'Sardor Toşmatov',
      abstract: 'Işda sunʼiy intellektning mehnat bozoridagi kasblar tarkibiga taʼsiri prognoz qilingan.',
      keywords: 'sunʼiy intellekt, mehnat bozori, bandlik',
      conflict: 'Yöq',
      fileName: 'ai-mehnat-bozori.docx',
      submittedAt: daysAgo(95),
      status: 'published',
      reviewerId: 'u-reviewer',
      decision: 'accept',
      paid: true,
      history: [
        { status: 'submitted', date: daysAgo(95) },
        { status: 'in_review', date: daysAgo(90) },
        { status: 'reviewed', date: daysAgo(80) },
        { status: 'accepted', date: daysAgo(76) },
        { status: 'paid', date: daysAgo(70) },
        { status: 'published', date: daysAgo(60) },
      ],
    },
    // the demo author's accepted article that waits for the publication fee (payment flow)
    {
      id: 'a13',
      authorId: 'u-author',
      title: 'Içki turizmni rivojlantirişda raqamli marketing vositalari',
      authors: 'Aziz Halikov, Kamola Yöldoşeva',
      abstract:
        'Maqolada ijtimoiy tarmoqlar va onlayn bron qiliş platformalarining içki turistik oqimlarni oşirişdagi örni tahlil qilingan.',
      keywords: 'içki turizm, raqamli marketing, ijtimoiy tarmoqlar',
      conflict: 'Yöq',
      fileName: 'turizm-raqamli-marketing.docx',
      submittedAt: daysAgo(28),
      status: 'accepted',
      reviewerId: 'u-reviewer',
      decision: 'accept',
      history: [
        { status: 'submitted', date: daysAgo(28) },
        { status: 'in_review', date: daysAgo(25) },
        { status: 'reviewed', date: daysAgo(14) },
        { status: 'accepted', date: daysAgo(9) },
      ],
    },
  ]

  const reviews = [
    {
      id: 'r1',
      articleId: 'a4',
      reviewerId: 'u-reviewer',
      status: 'submitted',
      invitedAt: daysAgo(8),
      acceptedAt: daysAgo(7),
      submittedAt: daysAgo(3),
      significance:
        'Bu maqola transformator arxitekturasiga noyob yondaşuvni taklif etadi va özbek tilidagi matnlar uçun muhim natijalar beradi.',
      novelty: 'Metodologiya eʼtibor mexanizmlarini ierarxik strukturalar bilan birlaştiradi — bu yondaşuv yangi hisoblanadi.',
      methodology: 'Eksperimental dizayn töğri, tegişli bazalar va baholaş metrikalari tanlangan.',
      recommendations: 'Çeklovlarni töliqroq muhokama qiliş uçun alohida bölim qöşiş tavsiya etiladi.',
      verdict: 'minor',
    },
    { id: 'r2', articleId: 'a5', reviewerId: 'u-reviewer', status: 'accepted', invitedAt: daysAgo(12), acceptedAt: daysAgo(11), draft: null },
    { id: 'r3', articleId: 'a6', reviewerId: 'u-reviewer', status: 'invited', invitedAt: daysAgo(4) },
    {
      id: 'r4',
      articleId: 'a3',
      reviewerId: 'u-reviewer-2',
      status: 'submitted',
      invitedAt: daysAgo(62),
      acceptedAt: daysAgo(61),
      submittedAt: daysAgo(50),
      significance: 'Mavzu dolzarb va energetika siyosati uçun amaliy ahamiyatga ega.',
      novelty: 'Hududiy maʼlumotlar asosida yangi integratsiya modeli taklif etilgan.',
      methodology: 'Statistik tahlil töğri bajarilgan, manbalar yetarli.',
      recommendations: 'Xulosalar bölimini qisqartiriş mumkin.',
      verdict: 'accept',
    },
    {
      id: 'r5',
      articleId: 'a7',
      reviewerId: 'u-reviewer-2',
      status: 'submitted',
      invitedAt: daysAgo(44),
      acceptedAt: daysAgo(43),
      submittedAt: daysAgo(30),
      significance: 'Tadqiqot oliy taʼlim tizimi uçun amaliy tavsiyalar beradi.',
      novelty: 'Sörovnoma natijalari ilk bor şu hajmda umumlaştirilgan.',
      methodology: 'Tanlanma hajmi yetarli, natijalar işonçli.',
      recommendations: 'Xorijiy tajriba bilan qiyoslaşni kengaytiriş tavsiya etiladi.',
      verdict: 'accept',
    },
    {
      id: 'r6',
      articleId: 'a8',
      reviewerId: 'u-reviewer-2',
      status: 'submitted',
      invitedAt: daysAgo(36),
      acceptedAt: daysAgo(35),
      submittedAt: daysAgo(22),
      significance: 'Suv tanqisligi şaroitida iş katta amaliy ahamiyatga ega.',
      novelty: 'Dala tajribalari natijalari birinçi marta eʼlon qilinmoqda.',
      methodology: 'Tajriba sxemasi töğri tuzilgan.',
      recommendations: 'Iqtisodiy samaradorlik hisob-kitoblarini qöşiş kerak.',
      verdict: 'minor',
    },
    {
      id: 'r7',
      articleId: 'a12',
      reviewerId: 'u-reviewer',
      status: 'submitted',
      invitedAt: daysAgo(90),
      acceptedAt: daysAgo(89),
      submittedAt: daysAgo(80),
      significance: 'Mavzu juda dolzarb, natijalar siyosatçilar uçun foydali.',
      novelty: 'Prognoz modeli mahalliy statistik maʼlumotlarga moslaştirilgan.',
      methodology: 'Model parametrlari asoslab berilgan.',
      recommendations: 'Ssenariylarni grafiklar bilan körsatiş tavsiya etiladi.',
      verdict: 'accept',
    },
    {
      id: 'r8',
      articleId: 'a13',
      reviewerId: 'u-reviewer',
      status: 'submitted',
      invitedAt: daysAgo(25),
      acceptedAt: daysAgo(24),
      submittedAt: daysAgo(14),
      significance: 'Mavzu dolzarb: içki turizmni raqamlaştiriş hududlar iqtisodiyoti uçun muhim.',
      novelty: 'Ijtimoiy tarmoqlardagi reklama samaradorligi mahalliy maʼlumotlar asosida ilk bor baholangan.',
      methodology: 'Sörovnoma va veb-analitika maʼlumotlari töğri taqqoslangan, xulosalar asosli.',
      recommendations: 'Natijalarni boşqa mintaqalar tajribasi bilan qiyoslaş tavsiya etiladi.',
      verdict: 'accept',
    },
  ]

  const payments = [
    { id: 'p1', articleId: 'a3', payerId: 'u-author', payer: 'Aziz Halikov', amount: ARTICLE_FEE, method: 'click', paidAt: daysAgo(40) },
    { id: 'p2', articleId: 'a7', payerId: 'u-author-5', payer: 'Bobur Boburov', amount: ARTICLE_FEE, method: 'payme', paidAt: daysAgo(6) },
    { id: 'p3', articleId: 'a12', payerId: 'u-author-10', payer: 'Sardor Toşmatov', amount: ARTICLE_FEE, method: 'bank', paidAt: daysAgo(70) },
  ]

  // notification params repeat the article title and the user name, as the store writes them
  const title = (articleId) => articles.find((article) => article.id === articleId).title
  const userName = (userId) => USERS.find((user) => user.id === userId).name

  /* `key` → cabinet.notifications.<key>, `params` are interpolated into it */
  const notifications = [
    { id: 'n1', userId: 'u-author', key: 'revisionRequested', params: { title: title('a2') }, type: 'warning', date: daysAgo(10) },
    { id: 'n2', userId: 'u-author', key: 'articlePublished', params: { title: title('a3') }, type: 'success', date: daysAgo(30) },
    { id: 'n3', userId: 'u-author', key: 'articleSubmitted', params: { title: title('a1') }, type: 'info', date: daysAgo(2) },
    { id: 'n4', userId: 'u-editor', key: 'newSubmission', params: { title: title('a1') }, type: 'info', date: daysAgo(2) },
    { id: 'n5', userId: 'u-editor', key: 'reviewReceived', params: { title: title('a4') }, type: 'success', date: daysAgo(3) },
    { id: 'n6', userId: 'u-editor', key: 'paymentReceived', params: { title: title('a7') }, type: 'success', date: daysAgo(6) },
    { id: 'n7', userId: 'u-reviewer', key: 'reviewInvitation', params: { title: title('a6') }, type: 'info', date: daysAgo(4) },
    { id: 'n8', userId: 'u-reviewer', key: 'reviewThanks', params: { title: title('a4') }, type: 'success', date: daysAgo(3) },
    // a5: the demo reviewer accepted the invitation and is writing the review
    { id: 'n9', userId: 'u-reviewer', key: 'reviewInvitation', params: { title: title('a5') }, type: 'info', date: daysAgo(12) },
    {
      id: 'n10',
      userId: 'u-editor',
      key: 'reviewAccepted',
      params: { title: title('a5'), reviewer: userName('u-reviewer') },
      type: 'success',
      date: daysAgo(11),
    },
    // a13: reviewed, accepted, waiting for the author's payment
    { id: 'n11', userId: 'u-author', key: 'sentToReview', params: { title: title('a13') }, type: 'info', date: daysAgo(25) },
    { id: 'n12', userId: 'u-reviewer', key: 'reviewInvitation', params: { title: title('a13') }, type: 'info', date: daysAgo(25) },
    {
      id: 'n13',
      userId: 'u-editor',
      key: 'reviewAccepted',
      params: { title: title('a13'), reviewer: userName('u-reviewer') },
      type: 'success',
      date: daysAgo(24),
    },
    { id: 'n14', userId: 'u-editor', key: 'reviewReceived', params: { title: title('a13') }, type: 'success', date: daysAgo(14) },
    { id: 'n15', userId: 'u-reviewer', key: 'reviewThanks', params: { title: title('a13') }, type: 'success', date: daysAgo(14) },
    { id: 'n16', userId: 'u-author', key: 'articleAccepted', params: { title: title('a13') }, type: 'success', date: daysAgo(9) },
  ]

  return { articles, reviews, payments, notifications }
}
