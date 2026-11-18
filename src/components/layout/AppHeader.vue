<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SUBMIT_ROUTE, mainMenu } from '@/data/site'
import { getContacts } from '@/api/home'
import LanguageSwitcher from './LanguageSwitcher.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppLink from '@/components/ui/AppLink.vue'

import logo from '@/assets/images/logo.svg'
import envelopeIcon from '@/assets/icons/envelope.svg'
import phoneIcon from '@/assets/icons/phone.svg'
import chevronIcon from '@/assets/icons/chevron-down.svg'
import searchIcon from '@/assets/icons/search.svg'
import sendIcon from '@/assets/icons/send.svg'
import userIcon from '@/assets/icons/user.svg'

const { t } = useI18n()
const route = useRoute()

const contacts = ref({}) // почта и телефон с API

onMounted(async () => {
  try {
    contacts.value = await getContacts()
  } catch (error) {
    console.error('Не удалось загрузить контакты', error)
  }
})

const openDropdown = ref(null) // index of the desktop dropdown that is open
const mobileOpen = ref(false)
const mobileSection = ref(null) // index of the expanded accordion in the mobile menu
const searchOpen = ref(false)
const searchQuery = ref('')
const scrolled = ref(false)
const navRef = ref(null)
const searchButton = ref(null)
const searchPanel = ref(null)
const searchInput = ref(null)
const burgerButton = ref(null)
const mobileMenu = ref(null)

let hoverOpened = null // index of the dropdown the pointer has just opened by hovering

function toggleDropdown(index) {
  openDropdown.value = openDropdown.value === index ? null : index
}

/*
 * Desktop dropdowns open on hover. The click that usually follows the hover must not close
 * the menu the pointer has just opened; any later click, Enter or Space toggles it.
 */
function onItemEnter(index) {
  openDropdown.value = index
  hoverOpened = index
}

function onItemLeave() {
  openDropdown.value = null
  hoverOpened = null
}

function onDropdownClick(index) {
  const justHovered = hoverOpened === index && openDropdown.value === index
  hoverOpened = null
  if (!justHovered) toggleDropdown(index)
}

/* A top-level item is highlighted when the current page is one of its children */
function isSectionActive(item) {
  return item.children?.some((child) => child.to?.name === route.name) ?? false
}

const mobileMenuTop = ref(0)

function toggleMobile() {
  // The panel is `position: fixed`, so it starts right under the navbar
  // regardless of whether the top bar is still visible.
  mobileMenuTop.value = navRef.value?.getBoundingClientRect().bottom ?? 0
  mobileOpen.value = !mobileOpen.value
  searchOpen.value = false
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value
  mobileOpen.value = false
  if (searchOpen.value) {
    requestAnimationFrame(() => searchInput.value?.focus())
  }
}

function closeAll() {
  openDropdown.value = null
  mobileOpen.value = false
  searchOpen.value = false
}

function onScroll() {
  scrolled.value = window.scrollY > 52
}

function onDocumentClick(event) {
  // the path at dispatch time: the clicked node may already be re-rendered and detached
  // (the burger icon is swapped as soon as the menu opens)
  if (navRef.value && !event.composedPath().includes(navRef.value)) closeAll()
}

/* The button that opened the panel `element` is in: when Esc hides the panel, the focus goes back to it */
function openerOf(element) {
  if (searchPanel.value?.contains(element)) return searchButton.value
  if (mobileMenu.value?.contains(element)) return burgerButton.value
  return element?.closest('.dropdown')?.closest('.menu__item').querySelector('.menu__link') ?? null
}

function onKeydown(event) {
  if (event.key !== 'Escape') return
  openerOf(document.activeElement)?.focus()
  closeAll()
}

function onResize() {
  if (window.innerWidth >= 1280) mobileOpen.value = false
}

// Lock page scroll while the mobile menu is open
watch(mobileOpen, (isOpen) => {
  document.documentElement.style.overflow = isOpen ? 'hidden' : ''
})

// Close every menu after navigating to another page
watch(() => route.fullPath, closeAll)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <!-- Top bar -->
  <div class="topbar">
    <div class="container topbar__inner">
      <div class="topbar__contacts">
        <a class="topbar__link" :href="`mailto:${contacts.email}`">
          <img :src="envelopeIcon" alt="" width="20" height="20" />
          <span class="topbar__email">{{ contacts.email }}</span>
        </a>
        <a class="topbar__link" :href="`tel:${contacts.phoneHref}`">
          <img class="topbar__phone-icon" :src="phoneIcon" alt="" width="20" height="20" />
          <span>{{ contacts.phone }}</span>
        </a>
      </div>
      <LanguageSwitcher />
    </div>
  </div>

  <!-- Main navigation (sticky) -->
  <header ref="navRef" class="navbar" :class="{ 'is-scrolled': scrolled || mobileOpen }">
    <div class="container navbar__inner">
      <RouterLink to="/" class="navbar__logo" :aria-label="t('header.homeLink')">
        <img :src="logo" alt="Tashkent International University" width="165" height="70" />
      </RouterLink>

      <nav class="navbar__menu" :aria-label="t('header.mainMenu')">
        <ul class="menu">
          <li
            v-for="(item, index) in mainMenu"
            :key="item.key"
            class="menu__item"
            @mouseenter="item.children && onItemEnter(index)"
            @mouseleave="item.children && onItemLeave()"
          >
            <template v-if="item.children">
              <button
                type="button"
                class="menu__link"
                :class="{ 'is-active': isSectionActive(item) }"
                aria-haspopup="true"
                :aria-expanded="openDropdown === index"
                @click="onDropdownClick(index)"
              >
                {{ t(`nav.${item.key}`) }}
                <img
                  class="menu__chevron"
                  :class="{ 'is-open': openDropdown === index }"
                  :src="chevronIcon"
                  alt=""
                  width="20"
                  height="20"
                />
              </button>
              <Transition name="dropdown">
                <ul v-show="openDropdown === index" class="dropdown">
                  <li v-for="child in item.children" :key="child.key">
                    <AppLink class="dropdown__link" :to="child.to" :href="child.href" @click="closeAll">
                      {{ t(`nav.${child.key}`) }}
                    </AppLink>
                  </li>
                </ul>
              </Transition>
            </template>
            <AppLink v-else class="menu__link" :to="item.to" :href="item.href" @click="closeAll">
              {{ t(`nav.${item.key}`) }}
            </AppLink>
          </li>
        </ul>
      </nav>

      <div class="navbar__actions">
        <button
          ref="searchButton"
          type="button"
          class="navbar__icon-btn"
          :aria-label="t('header.search')"
          :aria-expanded="searchOpen"
          @click="toggleSearch"
        >
          <img :src="searchIcon" alt="" width="24" height="24" />
        </button>

        <BaseButton class="navbar__cta" :to="SUBMIT_ROUTE">
          <template #icon>
            <img :src="sendIcon" alt="" width="22" height="22" />
          </template>
          {{ t('header.submitArticle') }}
        </BaseButton>

        <RouterLink class="navbar__user" to="/cabinet" :aria-label="t('header.cabinet')" :title="t('header.cabinet')">
          <img :src="userIcon" alt="" width="24" height="24" />
        </RouterLink>

        <button
          ref="burgerButton"
          type="button"
          class="navbar__burger"
          :aria-label="mobileOpen ? t('header.closeMenu') : t('header.openMenu')"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-menu"
          @click="toggleMobile"
        >
          <AppIcon :name="mobileOpen ? 'close' : 'menu'" :size="26" />
        </button>
      </div>
    </div>

    <!-- Search panel -->
    <Transition name="dropdown">
      <div v-show="searchOpen" ref="searchPanel" class="search-panel">
        <form class="container search-panel__form" role="search" @submit.prevent>
          <label class="visually-hidden" for="site-search">{{ t('header.searchLabel') }}</label>
          <input
            id="site-search"
            ref="searchInput"
            v-model="searchQuery"
            class="search-panel__input"
            type="search"
            :placeholder="t('header.searchPlaceholder')"
          />
          <BaseButton type="submit">{{ t('header.search') }}</BaseButton>
        </form>
      </div>
    </Transition>

    <!-- Mobile menu -->
    <Transition name="slide">
      <div
        v-show="mobileOpen"
        id="mobile-menu"
        ref="mobileMenu"
        class="mobile-menu"
        :style="{ top: `${mobileMenuTop}px` }"
      >
        <nav class="container" :aria-label="t('header.mobileMenu')">
          <ul class="mobile-menu__list">
            <li v-for="(item, index) in mainMenu" :key="item.key" class="mobile-menu__item">
              <template v-if="item.children">
                <button
                  type="button"
                  class="mobile-menu__link"
                  :aria-expanded="mobileSection === index"
                  @click="mobileSection = mobileSection === index ? null : index"
                >
                  {{ t(`nav.${item.key}`) }}
                  <AppIcon
                    name="chevron-down"
                    :size="20"
                    class="mobile-menu__chevron"
                    :class="{ 'is-open': mobileSection === index }"
                  />
                </button>
                <ul v-show="mobileSection === index" class="mobile-menu__sub">
                  <li v-for="child in item.children" :key="child.key">
                    <AppLink :to="child.to" :href="child.href" @click="closeAll">{{ t(`nav.${child.key}`) }}</AppLink>
                  </li>
                </ul>
              </template>
              <AppLink v-else class="mobile-menu__link" :to="item.to" :href="item.href" @click="closeAll">
                {{ t(`nav.${item.key}`) }}
              </AppLink>
            </li>
          </ul>
          <BaseButton class="mobile-menu__cta" :to="SUBMIT_ROUTE" block @click="closeAll">
            <template #icon>
              <img :src="sendIcon" alt="" width="22" height="22" />
            </template>
            {{ t('header.submitArticle') }}
          </BaseButton>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* ---------- Top bar ---------- */
.topbar {
  background: var(--color-bg-topbar);
  color: var(--color-text-dark);
  font-size: 17px;
  line-height: 1.2;
}

.topbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 52px;
}

.topbar__contacts {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
}

.topbar__link {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: color var(--transition);
}

.topbar__link:hover {
  color: var(--color-primary);
}

.topbar__phone-icon {
  transform: scaleX(-1);
}

/* ---------- Navbar ---------- */
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-white);
  transition: box-shadow var(--transition);
}

.navbar.is-scrolled {
  box-shadow: 0 6px 20px rgb(16 24 40 / 0.08);
}

.navbar__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  height: var(--header-h);
}

.navbar__logo {
  justify-self: start;
}

.navbar__logo img {
  width: 164px;
  height: 70px;
}

/* Desktop menu */
.menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu__item {
  position: relative;
}

.menu__link {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 0;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 500;
  color: var(--color-text-nav);
  white-space: nowrap;
  transition: color var(--transition);
}

.menu__link:hover,
.menu__link[aria-expanded='true'],
.menu__link.is-active,
.menu__link.router-link-exact-active {
  color: var(--color-primary);
}

.menu__chevron {
  transform: rotate(90deg);
  transition: transform var(--transition);
}

.menu__chevron.is-open {
  transform: rotate(-90deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: -16px;
  z-index: 60;
  width: max-content;
  min-width: 240px;
  max-width: 380px;
  padding: 8px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-float);
}

.dropdown__link {
  display: block;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  line-height: 1.4;
  color: var(--color-text-nav);
  transition:
    background-color var(--transition),
    color var(--transition);
}

.dropdown__link:hover,
.dropdown__link.router-link-exact-active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

/* Actions */
.navbar__actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 12px;
}

.navbar__icon-btn {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-right: 10px;
  border-radius: var(--radius-md);
  transition: background-color var(--transition);
}

.navbar__icon-btn:hover {
  background: var(--color-bg-topbar);
}

.navbar__cta {
  padding-inline: 18px;
  font-weight: 600;
}

.navbar__user {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: var(--radius-md);
  background: var(--color-primary-soft);
  transition: background-color var(--transition);
}

.navbar__user:hover {
  background: #d4e3f4;
}

.navbar__burger {
  display: none;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: var(--radius-md);
  color: var(--color-text-nav);
  background: var(--color-bg-topbar);
}

/* Search */
.search-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding-block: 16px;
  background: var(--color-white);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 12px 24px rgb(16 24 40 / 0.08);
}

.search-panel__form {
  display: flex;
  gap: 12px;
}

.search-panel__input {
  flex: 1;
  min-width: 0;
  height: 50px;
  padding: 0 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: 17px;
  background: var(--color-bg-soft);
  outline: none;
  transition: border-color var(--transition);
}

.search-panel__input:focus {
  border-color: var(--color-primary);
  background: var(--color-white);
}

/* Mobile menu */
.mobile-menu {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-block: 8px 32px;
  background: var(--color-white);
  border-top: 1px solid var(--color-border);
}

.mobile-menu__item {
  border-bottom: 1px solid var(--color-border);
}

.mobile-menu__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-nav);
  text-align: left;
}

.mobile-menu__chevron {
  transition: transform var(--transition);
}

.mobile-menu__chevron.is-open {
  transform: rotate(180deg);
}

.mobile-menu__sub {
  padding: 0 0 12px 12px;
}

.mobile-menu__sub a {
  display: block;
  padding: 8px 0;
  font-size: 16px;
  color: var(--color-text);
}

.mobile-menu__sub a:hover,
.mobile-menu__sub a.router-link-exact-active,
.mobile-menu__link.router-link-exact-active {
  color: var(--color-primary);
}

.mobile-menu__cta {
  margin-top: 24px;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ---------- Responsive ---------- */
@media (max-width: 1439.98px) {
  .menu {
    gap: 12px;
  }

  .menu__link {
    font-size: 16px;
  }

  .navbar__icon-btn {
    margin-right: 0;
  }
}

@media (max-width: 1279.98px) {
  .navbar__inner {
    grid-template-columns: auto 1fr;
  }

  .navbar__menu {
    display: none;
  }

  .navbar__logo img {
    width: 120px;
    height: 51px;
  }

  .navbar__actions {
    gap: 8px;
  }

  .navbar__burger {
    display: grid;
  }

  .navbar__user {
    width: 46px;
    height: 46px;
  }

  .navbar__cta {
    min-height: 46px;
    font-size: 16px;
  }
}

@media (max-width: 767.98px) {
  .topbar {
    font-size: 14px;
  }

  .topbar__inner {
    min-height: 40px;
  }

  .topbar__contacts {
    gap: 14px;
  }

  .topbar__link img {
    width: 16px;
    height: 16px;
  }

  .navbar__cta {
    display: none;
  }

  .navbar__icon-btn {
    width: 40px;
    height: 40px;
  }

  .search-panel__form :deep(.btn) {
    display: none;
  }
}

@media (max-width: 479.98px) {
  .topbar__email {
    display: none;
  }
}
</style>
