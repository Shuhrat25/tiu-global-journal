<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { focusTemporarily } from '@/utils/focus'
import AppIcon from '@/components/ui/AppIcon.vue'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.vue'
import logo from '@/assets/images/logo.svg'
import '@/styles/cabinet.css'

const store = useJournalStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

/* Sidebar items per role (Figma: "Boshqaruv paneli", "Bildirishnomalar" + comments #6, #12, #20) */
const NAV = {
  author: [
    { to: 'author', icon: 'layout-dashboard', key: 'dashboard' },
    { to: 'author-payments', icon: 'credit-card', key: 'payments' },
    { to: 'author-notifications', icon: 'bell', key: 'notifications', badge: true },
  ],
  editor: [
    { to: 'editor', icon: 'layout-dashboard', key: 'dashboard' },
    { to: 'editor-reviews', icon: 'clipboard-check', key: 'reviews' },
    { to: 'editor-payments', icon: 'wallet', key: 'payments' },
    { to: 'editor-notifications', icon: 'bell', key: 'notifications', badge: true },
  ],
  reviewer: [
    { to: 'reviewer', icon: 'layout-dashboard', key: 'dashboard' },
    { to: 'reviewer-notifications', icon: 'bell', key: 'notifications', badge: true },
  ],
}

const navItems = computed(() => NAV[store.role] ?? [])
const initials = computed(() =>
  (store.currentUser?.name ?? '')
    .replace(/^Dr\.\s*/, '')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
)

function logout() {
  store.logout()
  router.push({ name: 'login' })
}

/*
 * Below 1024px the sidebar is a drawer under the top bar, whose menu button opens and closes it.
 * Closed, the drawer is inert (out of the Tab order and the accessibility tree); open, the page
 * behind it is inert and does not scroll. Esc closes it and gives the focus back to the button;
 * choosing a page in it closes it and takes the focus to the heading of that page.
 */
const compact = useMediaQuery('(max-width: 1023.98px)')
const drawerOpen = ref(false)
const burger = ref(null)
const sidebar = ref(null)
const nav = ref(null)
const main = ref(null)

async function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
  if (!drawerOpen.value) return
  await nextTick() // the drawer is no longer inert
  nav.value?.querySelector('a')?.focus()
}

async function showPage() {
  drawerOpen.value = false
  await nextTick() // the chosen page is rendered
  const heading = main.value?.querySelector('h1')
  if (heading) focusTemporarily(heading)
}

/* the link of the page that is already open changes no route: it only closes the drawer */
function onNavClick(name) {
  if (drawerOpen.value && route.name === name) showPage()
}

watch(
  () => route.fullPath,
  () => {
    if (drawerOpen.value) showPage()
  },
)

// the window got too wide for the drawer
watch(compact, (isCompact) => {
  if (!isCompact) drawerOpen.value = false
})

watch(drawerOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

/* listened to in the capture phase, before the language switcher: its list open in the drawer closes first */
function onKeydown(event) {
  if (event.key !== 'Escape' || !drawerOpen.value) return
  if (sidebar.value?.querySelector('[aria-expanded="true"]')) return
  drawerOpen.value = false
  burger.value?.focus()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown, true)
  if (drawerOpen.value) document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="cabinet" :class="{ 'drawer-open': drawerOpen }">
    <!-- top bar of tablets and phones -->
    <div class="cabinet__topbar">
      <button
        ref="burger"
        type="button"
        class="cabinet__burger"
        :aria-label="t('cabinet.common.nav.menu')"
        :aria-expanded="drawerOpen"
        aria-controls="cabinet-sidebar"
        @click="toggleDrawer"
      >
        <AppIcon :name="drawerOpen ? 'close' : 'menu'" :size="24" />
      </button>
      <RouterLink to="/" class="cabinet__topbar-logo">
        <img :src="logo" alt="Tashkent International University" width="118" height="50" />
      </RouterLink>
    </div>

    <div class="cabinet__backdrop" @click="drawerOpen = false" />

    <aside id="cabinet-sidebar" ref="sidebar" class="sidebar" :inert="compact && !drawerOpen">
      <RouterLink to="/" class="sidebar__logo" :aria-label="t('cabinet.common.nav.backToSite')">
        <img :src="logo" alt="Tashkent International University" width="141" height="60" />
      </RouterLink>

      <nav ref="nav" class="sidebar__nav" :aria-label="t('cabinet.common.nav.label')">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="{ name: item.to }"
          class="sidebar__link"
          @click="onNavClick(item.to)"
        >
          <AppIcon :name="item.icon" :size="20" />
          <span>{{ t(`cabinet.common.nav.${item.key}`) }}</span>
          <span v-if="item.badge && store.unreadCount" class="sidebar__badge">{{ store.unreadCount }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar__bottom">
        <RouterLink to="/" class="sidebar__link sidebar__link--muted">
          <AppIcon name="arrow-left" :size="20" />
          <span>{{ t('cabinet.common.nav.backToSite') }}</span>
        </RouterLink>
        <div class="sidebar__lang">
          <LanguageSwitcher placement="up" />
        </div>
        <div class="sidebar__user">
          <span class="sidebar__avatar" aria-hidden="true">{{ initials }}</span>
          <span class="sidebar__user-info">
            <strong>{{ store.currentUser?.name }}</strong>
            <!-- no role for a moment on logout, before the login page replaces the cabinet -->
            <span v-if="store.role">{{ t(`cabinet.common.roles.${store.role}`) }}</span>
          </span>
          <button type="button" class="sidebar__logout" :aria-label="t('cabinet.common.nav.logout')" :title="t('cabinet.common.nav.logout')" @click="logout">
            <AppIcon name="log-out" :size="18" />
          </button>
        </div>
      </div>
    </aside>

    <main ref="main" class="cabinet__main" :inert="drawerOpen">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.cabinet {
  display: grid;
  grid-template-columns: 256px minmax(0, 1fr);
  min-height: 100dvh;
  background: var(--cab-bg);
}

/* ---------- sidebar ---------- */
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--cab-surface);
  border-right: 1px solid var(--cab-border);
}

.sidebar__logo {
  display: block;
  padding: 16px;
  border-bottom: 1px solid var(--cab-border);
}

.sidebar__logo img {
  width: 141px;
  height: 60px;
}

.sidebar__nav {
  display: grid;
  gap: 4px;
  padding: 16px;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 8px 12px;
  border-radius: var(--cab-radius-sm);
  font-size: 15px;
  line-height: 24px;
  color: var(--cab-text-2);
  transition:
    background-color var(--transition),
    color var(--transition);
}

.sidebar__link:hover {
  background: var(--cab-bg);
}

.sidebar__link.router-link-exact-active {
  background: #eff6ff;
  color: var(--tone-blue-fg);
  font-weight: 500;
}

.sidebar__link--muted {
  color: var(--cab-muted);
}

.sidebar__badge {
  margin-left: auto;
  min-width: 22px;
  padding: 0 7px;
  border-radius: var(--radius-full);
  background: var(--cab-danger);
  font-size: 12px;
  line-height: 20px;
  font-weight: 600;
  text-align: center;
  color: var(--color-white);
}

.sidebar__bottom {
  display: grid;
  gap: 8px;
  margin-top: auto;
  padding: 12px 16px 16px;
  border-top: 1px solid var(--cab-border);
}

.sidebar__lang {
  padding: 4px 12px;
  font-size: 15px;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--cab-border);
}

.sidebar__avatar {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-white);
}

.sidebar__user-info {
  display: grid;
  min-width: 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--cab-muted);
}

.sidebar__user-info strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--cab-text);
}

.sidebar__logout {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 32px;
  height: 32px;
  margin-left: auto;
  border-radius: 8px;
  color: var(--cab-muted);
}

.sidebar__logout:hover {
  background: var(--tone-red-bg);
  color: var(--tone-red-fg);
}

/* ---------- content ---------- */
.cabinet__main {
  min-width: 0;
  padding: 32px;
}

.cabinet__topbar,
.cabinet__backdrop {
  display: none;
}

/* ---------- tablet & phone: off-canvas sidebar (the breakpoint of `compact` in the script) ---------- */
@media (max-width: 1023.98px) {
  .cabinet {
    --topbar-height: 64px;
    display: block;
  }

  .cabinet__topbar {
    position: sticky;
    top: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 12px;
    height: var(--topbar-height);
    padding: 0 16px;
    background: var(--cab-surface);
    border-bottom: 1px solid var(--cab-border);
  }

  .cabinet__burger {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--cab-radius-sm);
    background: var(--cab-bg);
    color: var(--cab-text-2);
  }

  .cabinet__topbar-logo img {
    width: 118px;
    height: 50px;
  }

  /* the drawer opens under the top bar, so its menu button stays at hand to close it */
  .sidebar {
    position: fixed;
    top: var(--topbar-height);
    bottom: 0;
    left: 0;
    z-index: 50;
    width: min(280px, 85vw);
    height: auto;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .drawer-open .sidebar {
    transform: none;
    box-shadow: var(--cab-shadow-modal);
  }

  /* the top bar shows the logo */
  .sidebar__logo {
    display: none;
  }

  .cabinet__backdrop {
    position: fixed;
    inset: var(--topbar-height) 0 0;
    z-index: 40;
    background: rgb(16 24 40 / 0.4);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }

  .drawer-open .cabinet__backdrop {
    display: block;
    opacity: 1;
    pointer-events: auto;
  }

  .cabinet__main {
    padding: 24px 20px;
  }
}

@media (max-width: 767.98px) {
  .cabinet__main {
    padding: 20px 16px;
  }
}
</style>
