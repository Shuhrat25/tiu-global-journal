<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import { DEMO_ACCOUNTS } from '@/data/cabinet-seed'
import PageBanner from '@/components/page/PageBanner.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import '@/styles/cabinet.css'

const store = useJournalStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const ROLES = [
  { role: 'author', icon: 'pen-line', tone: 'blue' },
  { role: 'editor', icon: 'clipboard-check', tone: 'green' },
  { role: 'reviewer', icon: 'user-check', tone: 'purple' },
]

/*
 * The confirmation of a reset is a live region that is always on the page; its text goes in a moment
 * after the click (the delay of CabNotice), so a screen reader announces it, also after a repeated reset.
 */
const ANNOUNCE_DELAY = 150
const resetDone = ref(false)
let resetTimer = null

function enter(role) {
  store.login(DEMO_ACCOUNTS[role])
  // go back to the page that required the login (e.g. "submit an article") if it belongs to this role
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  router.push(redirect.startsWith(`/cabinet/${role}`) ? redirect : { name: role })
}

function reset() {
  store.resetDemo()
  resetDone.value = false
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    resetDone.value = true
  }, ANNOUNCE_DELAY)
}

onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
  <div class="login-page">
    <PageBanner :title="t('cabinet.common.login.title')" :crumbs="[{ label: t('cabinet.common.login.title') }]" />

    <div class="container login">
      <p class="login__subtitle">{{ t('cabinet.common.login.subtitle') }}</p>

      <div v-if="store.currentUser" class="login__current">
        <span>{{ t('cabinet.common.login.signedInAs', { name: store.currentUser.name }) }}</span>
        <RouterLink class="login__continue" :to="{ name: store.role }">
          {{ t('cabinet.common.login.continue') }}
          <AppIcon name="chevron-right" :size="18" />
        </RouterLink>
      </div>

      <ul class="roles">
        <li v-for="item in ROLES" :key="item.role" class="role" :class="`role--${item.tone}`">
          <span class="role__icon"><AppIcon :name="item.icon" :size="28" /></span>
          <h2 :id="`login-role-${item.role}`" class="role__title">{{ t(`cabinet.common.roles.${item.role}`) }}</h2>
          <p class="role__text">{{ t(`cabinet.common.login.roles.${item.role}`) }}</p>
          <!-- three "Sign in" buttons: each one is described by its role -->
          <button type="button" class="role__button" :aria-describedby="`login-role-${item.role}`" @click="enter(item.role)">
            {{ t('cabinet.common.login.enter') }}
            <AppIcon name="chevron-right" :size="18" />
          </button>
        </li>
      </ul>

      <div class="login__demo">
        <AppIcon name="alert-circle" :size="20" />
        <p>{{ t('cabinet.common.login.demoNote') }}</p>
        <button type="button" class="login__reset" @click="reset">
          <AppIcon name="rotate-ccw" :size="16" />
          {{ t('cabinet.common.login.reset') }}
        </button>
        <span class="login__reset-done" role="status">{{ resetDone ? t('cabinet.common.login.resetDone') : '' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  background: var(--color-bg-topbar);
}

.login {
  position: relative;
  display: grid;
  gap: 24px;
  margin-top: -30px;
  padding-bottom: var(--section-space);
}

.login__subtitle {
  justify-self: center;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  background: var(--color-white);
  font-size: 17px;
  color: var(--color-text);
  text-align: center;
}

.login__current {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border: 1px solid var(--color-primary-light);
  border-radius: var(--radius-lg);
  background: var(--color-primary-soft);
  font-size: 16px;
  color: var(--color-heading);
}

.login__continue {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: var(--color-primary);
}

.roles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.role {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 28px;
  border-radius: var(--radius-lg);
  background: var(--color-white);
  transition:
    box-shadow var(--transition),
    transform var(--transition);
}

.role:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgb(16 24 40 / 0.1);
}

.role__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: var(--tone-bg);
  color: var(--tone-fg);
}

.role--blue { --tone-bg: var(--tone-blue-bg); --tone-fg: var(--tone-blue-fg); }
.role--green { --tone-bg: var(--tone-green-bg); --tone-fg: var(--tone-green-fg); }
.role--purple { --tone-bg: var(--tone-purple-bg); --tone-fg: var(--tone-purple-fg); }

.role__title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  color: var(--color-heading);
}

.role__text {
  flex: 1;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-text);
}

.role__button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 11px 20px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-white);
  transition: background-color var(--transition);
}

.role__button:hover {
  background: var(--color-primary-dark);
}

.login__demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 12px;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  background: var(--tone-yellow-bg);
  font-size: 15px;
  color: var(--tone-yellow-fg);
}

.login__demo p {
  flex: 1 1 320px;
}

.login__reset {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--color-white);
  font-size: 14px;
  color: var(--color-heading);
}

.login__reset-done {
  font-size: 14px;
  color: var(--tone-green-fg);
}

@media (max-width: 1023.98px) {
  .roles {
    grid-template-columns: 1fr;
  }

  .role {
    padding: 20px;
  }
}
</style>
