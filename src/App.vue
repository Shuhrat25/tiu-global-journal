<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SocialSidebar from '@/components/layout/SocialSidebar.vue'
import ChatButton from '@/components/layout/ChatButton.vue'

const route = useRoute()
const { t, locale } = useI18n()

/* the personal cabinets have their own layout (sidebar instead of the site header/footer) */
const isCabinet = computed(() => route.matched.some((record) => record.meta.cabinet))

// Keep <html lang>, the tab title and the meta description in sync with the language and page
watchEffect(() => {
  const siteName = t('meta.siteName')
  document.documentElement.lang = locale.value
  document.title = route.meta.titleKey ? `${t(route.meta.titleKey)} — ${siteName}` : siteName
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))
})
</script>

<template>
  <RouterView v-if="isCabinet" />
  <template v-else>
    <AppHeader />
    <main>
      <RouterView />
    </main>
    <AppFooter />
    <SocialSidebar />
    <ChatButton />
  </template>
</template>
