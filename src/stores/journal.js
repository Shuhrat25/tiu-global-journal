/*
 * Editorial workflow of the journal (demo, no backend).
 *
 *   author submits ─▶ submitted ─▶ editor: initial check
 *                       │  ├─ reject ─────────────────────────▶ rejected
 *                       │  ├─ request changes ─▶ revision ─▶ (author uploads a fix) ─▶ submitted
 *                       │  └─ send to review ─▶ in_review ─▶ reviewer submits ─▶ reviewed
 *                       │                         (reviewer accepts → the editor is notified,
 *                       │                          reviewer declines → back to submitted)
 *   editor final decision on `reviewed`: accept ─▶ accepted ─▶ author pays ─▶ paid ─▶ editor ─▶ published
 *                                        minor/major ─▶ revision,  reject ─▶ rejected
 *
 * An uploaded fix starts a new round: the article is `submitted` again without a reviewer and
 * without the earlier decision (the earlier reviews stay in `reviews` as its history).
 * Every action checks the current status and ignores a call the workflow does not allow
 * (e.g. a second click on a dialog's button while the dialog is closing).
 *
 * The data is kept in localStorage, shared by all tabs of the browser: a change saved by one tab
 * reaches the others through the `storage` event, so the three cabinets, open side by side, see
 * each other's actions. Who is signed in belongs to the tab (sessionStorage), so every tab can
 * work as another role; a newly opened tab starts as the user who signed in last.
 */
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { ARTICLE_FEE, USERS, createSeed } from '@/data/cabinet-seed'
import { hasDraftContent } from '@/components/cabinet/reviewer/review-fields'
import { localIsoDate } from '@/utils/date'

/* bump the version whenever the demo data changes, so saved demo data from an older seed is not loaded */
const STORAGE_KEY = 'tiu-cabinet-v2'
const OLD_STORAGE_KEYS = ['tiu-cabinet-v1']
/* id of the signed-in user ('' — signed out): the tab's own in sessionStorage, the last sign-in in localStorage */
const USER_KEY = 'tiu-cabinet-user'

export const ARTICLE_STATUSES = ['submitted', 'revision', 'in_review', 'reviewed', 'accepted', 'paid', 'published', 'rejected']
export const FINAL_DECISIONS = ['accept', 'minor', 'major', 'reject']
export const REJECT_REASONS = ['format', 'plagiarism', 'scope', 'quality', 'other']
export const DECLINE_REASONS = ['expertise', 'time', 'conflict', 'other']

const today = () => localIsoDate()
let idCounter = 0
const newId = (prefix) => `${prefix}${Date.now().toString(36)}${(idCounter++).toString(36)}`

function parseState(raw) {
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function loadState() {
  try {
    for (const key of OLD_STORAGE_KEYS) localStorage.removeItem(key) // data of an older seed is never read again
    return parseState(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

/* a new tab takes over the last sign-in and keeps it from then on, whatever the other tabs do */
function loadUserId() {
  try {
    const id = (sessionStorage.getItem(USER_KEY) ?? localStorage.getItem(USER_KEY)) || ''
    sessionStorage.setItem(USER_KEY, id)
    return id || null
  } catch {
    return null
  }
}

export const useJournalStore = defineStore('journal', () => {
  const initial = loadState() ?? createSeed()

  const articles = ref(initial.articles)
  const reviews = ref(initial.reviews)
  const payments = ref(initial.payments)
  const notifications = ref(initial.notifications)
  const currentUserId = ref(loadUserId())

  watch(
    [articles, reviews, payments, notifications],
    () => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            articles: articles.value,
            reviews: reviews.value,
            payments: payments.value,
            notifications: notifications.value,
          }),
        )
      } catch {
        /* storage unavailable — the demo still works for this tab */
      }
    },
    { deep: true },
  )

  /*
   * Data saved by another tab replaces this tab's copy. The event never fires in the tab that saved,
   * and saving the same text again fires none, so taking the data over cannot echo between tabs.
   */
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    const state = parseState(event.newValue)
    if (!state) return
    articles.value = state.articles
    reviews.value = state.reviews
    payments.value = state.payments
    notifications.value = state.notifications
  })

  watch(currentUserId, (id) => {
    try {
      sessionStorage.setItem(USER_KEY, id ?? '')
      localStorage.setItem(USER_KEY, id ?? '')
    } catch {
      /* storage unavailable — the sign-in lasts until the page is reloaded */
    }
  })

  /* ---------- users ---------- */
  const users = USERS
  const currentUser = computed(() => users.find((u) => u.id === currentUserId.value) ?? null)
  const role = computed(() => currentUser.value?.role ?? null)
  const reviewers = computed(() => users.filter((u) => u.role === 'reviewer'))
  const editorIds = users.filter((u) => u.role === 'editor').map((u) => u.id)

  const userName = (id) => users.find((u) => u.id === id)?.name ?? ''

  function login(userId) {
    currentUserId.value = userId
  }

  function logout() {
    currentUserId.value = null
  }

  /** Restores the demo data (button on the login page). */
  function resetDemo() {
    const seed = createSeed()
    articles.value = seed.articles
    reviews.value = seed.reviews
    payments.value = seed.payments
    notifications.value = seed.notifications
  }

  /* ---------- lookups ---------- */
  const articleById = (id) => articles.value.find((a) => a.id === id)
  const reviewById = (id) => reviews.value.find((r) => r.id === id)
  /** latest review of an article (there can be an earlier declined invitation) */
  const reviewForArticle = (articleId) =>
    [...reviews.value].reverse().find((r) => r.articleId === articleId && r.status !== 'declined')
  const paymentForArticle = (articleId) => payments.value.find((p) => p.articleId === articleId)

  const myNotifications = computed(() =>
    notifications.value
      .filter((n) => n.userId === currentUserId.value)
      .sort((a, b) => b.date.localeCompare(a.date)),
  )
  const unreadCount = computed(() => myNotifications.value.filter((n) => !n.read).length)

  /* author */
  const myArticles = computed(() =>
    articles.value
      .filter((a) => a.authorId === currentUserId.value)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
  )
  const myPayments = computed(() =>
    payments.value.filter((p) => p.payerId === currentUserId.value).sort((a, b) => b.paidAt.localeCompare(a.paidAt)),
  )

  /* editor */
  const allArticles = computed(() => [...articles.value].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)))
  const submittedReviews = computed(() =>
    reviews.value
      .filter((r) => r.status === 'submitted')
      .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? '')),
  )
  const allPayments = computed(() => [...payments.value].sort((a, b) => b.paidAt.localeCompare(a.paidAt)))

  /* reviewer */
  const myReviews = computed(() =>
    reviews.value
      .filter((r) => r.reviewerId === currentUserId.value)
      .sort((a, b) => b.invitedAt.localeCompare(a.invitedAt)),
  )

  /* ---------- internal helpers ---------- */
  function setStatus(article, status) {
    article.status = status
    article.history = [...(article.history ?? []), { status, date: today() }]
  }

  function notify(userIds, key, params = {}, type = 'info') {
    for (const userId of [].concat(userIds)) {
      notifications.value.unshift({ id: newId('n'), userId, key, params, type, date: today() })
    }
  }

  function markNotificationsRead() {
    for (const n of notifications.value) if (n.userId === currentUserId.value) n.read = true
  }

  /* ---------- author actions ---------- */
  function submitArticle({ title, authors, abstract, keywords, conflict, fileName }) {
    const article = {
      id: newId('a'),
      authorId: currentUserId.value,
      title,
      authors,
      abstract,
      keywords,
      conflict,
      fileName,
      submittedAt: today(),
      status: 'submitted',
      history: [{ status: 'submitted', date: today() }],
    }
    articles.value.unshift(article)
    notify(currentUserId.value, 'articleSubmitted', { title }, 'info')
    notify(editorIds, 'newSubmission', { title }, 'info')
    return article
  }

  function uploadRevision(articleId, fileName) {
    const article = articleById(articleId)
    if (!article || article.status !== 'revision') return
    article.fileName = fileName
    article.revisions = (article.revisions ?? 0) + 1
    // a new round: the editor checks the fix and may choose another reviewer, so the previous
    // round's reviewer and final decision are no longer current (its reviews stay as history)
    article.reviewerId = null
    article.decision = null
    setStatus(article, 'submitted')
    notify(editorIds, 'revisionUploaded', { title: article.title }, 'info')
  }

  function payForArticle(articleId, method) {
    const article = articleById(articleId)
    if (!article || article.status !== 'accepted') return
    payments.value.unshift({
      id: newId('p'),
      articleId,
      payerId: currentUserId.value,
      payer: currentUser.value?.name ?? '',
      amount: ARTICLE_FEE,
      method,
      paidAt: today(),
    })
    article.paid = true
    setStatus(article, 'paid')
    notify(currentUserId.value, 'paymentDone', { title: article.title }, 'success')
    notify(editorIds, 'paymentReceived', { title: article.title }, 'success')
  }

  /* ---------- editor actions ---------- */
  /* initial check of a new or revised submission: reject, ask for changes or send to a reviewer */
  function rejectArticle(articleId, reason, comment = '') {
    const article = articleById(articleId)
    if (!article || article.status !== 'submitted') return
    article.rejectReason = reason
    article.editorComment = comment
    setStatus(article, 'rejected')
    notify(article.authorId, 'articleRejected', { title: article.title }, 'danger')
  }

  function requestRevision(articleId, comment) {
    const article = articleById(articleId)
    if (!article || article.status !== 'submitted') return
    article.editorComment = comment
    setStatus(article, 'revision')
    notify(article.authorId, 'revisionRequested', { title: article.title }, 'warning')
  }

  function sendToReview(articleId, reviewerId) {
    const article = articleById(articleId)
    if (!article || article.status !== 'submitted') return
    if (!reviewers.value.some((reviewer) => reviewer.id === reviewerId)) return
    article.reviewerId = reviewerId
    reviews.value.push({ id: newId('r'), articleId, reviewerId, status: 'invited', invitedAt: today() })
    setStatus(article, 'in_review')
    notify(reviewerId, 'reviewInvitation', { title: article.title }, 'info')
    notify(article.authorId, 'sentToReview', { title: article.title }, 'info')
  }

  /** decision: accept | minor | major | reject — taken once the review has arrived (`reviewed`) */
  function makeFinalDecision(articleId, decision, comment = '') {
    const article = articleById(articleId)
    if (!article || article.status !== 'reviewed' || !FINAL_DECISIONS.includes(decision)) return
    article.decision = decision
    article.editorComment = comment
    if (decision === 'accept') {
      setStatus(article, 'accepted')
      notify(article.authorId, 'articleAccepted', { title: article.title }, 'success')
    } else if (decision === 'reject') {
      setStatus(article, 'rejected')
      notify(article.authorId, 'articleRejected', { title: article.title }, 'danger')
    } else {
      setStatus(article, 'revision')
      notify(article.authorId, 'revisionRequested', { title: article.title }, 'warning')
    }
  }

  function markPublished(articleId) {
    const article = articleById(articleId)
    if (!article || article.status !== 'paid') return
    setStatus(article, 'published')
    notify(article.authorId, 'articlePublished', { title: article.title }, 'success')
  }

  /* ---------- reviewer actions ---------- */
  function acceptInvitation(reviewId) {
    const review = reviewById(reviewId)
    if (!review || review.status !== 'invited') return
    review.status = 'accepted'
    review.acceptedAt = today()
    const article = articleById(review.articleId)
    if (article) {
      notify(editorIds, 'reviewAccepted', { title: article.title, reviewer: userName(review.reviewerId) }, 'success')
    }
  }

  function declineInvitation(reviewId, reason, comment = '') {
    const review = reviewById(reviewId)
    if (!review || review.status !== 'invited') return
    review.status = 'declined'
    review.declineReason = reason
    review.declineComment = comment
    const article = articleById(review.articleId)
    if (article) {
      article.reviewerId = null
      setStatus(article, 'submitted') // the editor has to choose another reviewer
      notify(editorIds, 'reviewDeclined', { title: article.title, reviewer: userName(review.reviewerId) }, 'warning')
    }
  }

  /* a draft and the review itself belong to an accepted invitation of an article that is in review */
  function saveReviewDraft(reviewId, form) {
    const review = reviewById(reviewId)
    if (!review || review.status !== 'accepted') return
    // a form left empty (or with spaces only) clears the draft
    review.draft = hasDraftContent(form) ? { ...form } : null
  }

  function submitReview(reviewId, form) {
    const review = reviewById(reviewId)
    const article = review && articleById(review.articleId)
    if (!review || review.status !== 'accepted' || article?.status !== 'in_review') return
    Object.assign(review, form, { status: 'submitted', submittedAt: today(), draft: null })
    setStatus(article, 'reviewed')
    notify(editorIds, 'reviewReceived', { title: article.title }, 'success')
    notify(review.reviewerId, 'reviewThanks', { title: article.title }, 'success')
  }

  return {
    // state
    articles,
    reviews,
    payments,
    notifications,
    currentUserId,
    // users
    users,
    currentUser,
    role,
    reviewers,
    userName,
    login,
    logout,
    resetDemo,
    // lookups
    articleById,
    reviewById,
    reviewForArticle,
    paymentForArticle,
    myNotifications,
    unreadCount,
    markNotificationsRead,
    myArticles,
    myPayments,
    allArticles,
    submittedReviews,
    allPayments,
    myReviews,
    // actions
    submitArticle,
    uploadRevision,
    payForArticle,
    rejectArticle,
    requestRevision,
    sendToReview,
    makeFinalDecision,
    markPublished,
    acceptInvitation,
    declineInvitation,
    saveReviewDraft,
    submitReview,
  }
})

export { ARTICLE_FEE }
