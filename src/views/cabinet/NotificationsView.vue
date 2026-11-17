<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import CabPageHeader from '@/components/cabinet/CabPageHeader.vue'
import CabPanel from '@/components/cabinet/CabPanel.vue'
import NotificationList from '@/components/cabinet/NotificationList.vue'

const store = useJournalStore()
const { t } = useI18n()

/*
 * Opening the page counts as reading the notifications (it clears the sidebar badge), and so does the
 * arrival of one while the page is open (from another tab). The ones that were unread stay marked
 * as new for as long as the page is open.
 */
const newIds = ref([])

watch(
  () => store.unreadCount,
  (count) => {
    if (!count) return
    const unread = store.myNotifications.filter((n) => !n.read).map((n) => n.id)
    newIds.value = [...newIds.value, ...unread]
    store.markNotificationsRead()
  },
  { immediate: true },
)
</script>

<template>
  <CabPageHeader :title="t('cabinet.common.nav.notifications')" />
  <CabPanel flush>
    <NotificationList :items="store.myNotifications" :new-ids="newIds" />
  </CabPanel>
</template>
