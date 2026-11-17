import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useJournalStore } from '@/stores/journal'

/* Personal cabinets — each role gets its own section, guarded by `meta.role` */
const cabinetRoutes = {
  path: '/cabinet',
  component: () => import('@/layouts/CabinetLayout.vue'),
  meta: { cabinet: true },
  children: [
    // author
    {
      path: 'author',
      name: 'author',
      component: () => import('@/views/cabinet/author/AuthorDashboard.vue'),
      meta: { role: 'author', titleKey: 'cabinet.common.nav.dashboard' },
    },
    {
      path: 'author/payments',
      name: 'author-payments',
      component: () => import('@/views/cabinet/author/AuthorPayments.vue'),
      meta: { role: 'author', titleKey: 'cabinet.common.nav.payments' },
    },
    {
      path: 'author/notifications',
      name: 'author-notifications',
      component: () => import('@/views/cabinet/NotificationsView.vue'),
      meta: { role: 'author', titleKey: 'cabinet.common.nav.notifications' },
    },
    // editor
    {
      path: 'editor',
      name: 'editor',
      component: () => import('@/views/cabinet/editor/EditorDashboard.vue'),
      meta: { role: 'editor', titleKey: 'cabinet.common.nav.dashboard' },
    },
    {
      path: 'editor/reviews',
      name: 'editor-reviews',
      component: () => import('@/views/cabinet/editor/EditorReviews.vue'),
      meta: { role: 'editor', titleKey: 'cabinet.common.nav.reviews' },
    },
    {
      path: 'editor/payments',
      name: 'editor-payments',
      component: () => import('@/views/cabinet/editor/EditorPayments.vue'),
      meta: { role: 'editor', titleKey: 'cabinet.common.nav.payments' },
    },
    {
      path: 'editor/notifications',
      name: 'editor-notifications',
      component: () => import('@/views/cabinet/NotificationsView.vue'),
      meta: { role: 'editor', titleKey: 'cabinet.common.nav.notifications' },
    },
    // reviewer
    {
      path: 'reviewer',
      name: 'reviewer',
      component: () => import('@/views/cabinet/reviewer/ReviewerDashboard.vue'),
      meta: { role: 'reviewer', titleKey: 'cabinet.common.nav.dashboard' },
    },
    {
      path: 'reviewer/notifications',
      name: 'reviewer-notifications',
      component: () => import('@/views/cabinet/NotificationsView.vue'),
      meta: { role: 'reviewer', titleKey: 'cabinet.common.nav.notifications' },
    },
  ],
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/requirements',
      name: 'requirements',
      component: () => import('@/views/RequirementsView.vue'),
      meta: { titleKey: 'nav.requirements' },
    },
    {
      path: '/editorial-board',
      name: 'editorial',
      component: () => import('@/views/EditorialView.vue'),
      meta: { titleKey: 'nav.editorial' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: { titleKey: 'nav.contact' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/cabinet/CabinetLogin.vue'),
      meta: { titleKey: 'cabinet.common.login.title' },
    },
    cabinetRoutes,
    {
      // a path, not { name: 'home' }: a named redirect would carry the pathMatch param over to home
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  // 'instant': otherwise `scroll-behavior: smooth` on <html> (base.css) animates every page change
  // from the old scroll position; only in-page anchors scroll smoothly
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return { ...savedPosition, behavior: 'instant' }
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'instant' }
  },
})

// Cabinet pages require a signed-in user with the matching role
router.beforeEach((to) => {
  if (!to.matched.some((record) => record.meta.cabinet)) return true
  const store = useJournalStore()
  // remember where the visitor was going, the login page sends them back afterwards
  if (!store.role) return { name: 'login', query: { redirect: to.fullPath } }
  // another role's page (e.g. an editor clicks "submit an article") → let them switch role on the login page
  if (to.meta.role && to.meta.role !== store.role) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.path === '/cabinet' || to.path === '/cabinet/') return { name: store.role }
  return true
})

export default router
