<script setup>
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import EmptyState from './EmptyState.vue'
import { formatDate } from '@/i18n/dates'

/*
 * items: store notifications — { id, key, params, type, date, read } → text from cabinet.notifications.<key>.
 * An unread notification is marked as new, and so is one listed in newIds (read on opening the page).
 */
const props = defineProps({
  items: { type: Array, required: true },
  newIds: { type: Array, default: () => [] },
})

const { t, locale } = useI18n()

const ICONS = { info: 'bell', success: 'check-circle', warning: 'alert-circle', danger: 'x-circle' }

const isNew = (item) => !item.read || props.newIds.includes(item.id)
</script>

<template>
  <ul v-if="items.length" class="notifications">
    <li
      v-for="item in items"
      :key="item.id"
      class="notification"
      :class="[`notification--${item.type}`, { 'notification--new': isNew(item) }]"
    >
      <span class="notification__icon"><AppIcon :name="ICONS[item.type] ?? 'bell'" :size="20" /></span>
      <div class="notification__body">
        <p class="notification__text">{{ t(`cabinet.notifications.${item.key}`, item.params) }}</p>
        <p class="notification__meta">
          <time :datetime="item.date">{{ formatDate(item.date, locale) }}</time>
          <span v-if="isNew(item)" class="notification__new">{{ t('cabinet.notifications.new') }}</span>
        </p>
      </div>
    </li>
  </ul>
  <EmptyState v-else icon="bell" :text="t('cabinet.common.empty.notifications')" />
</template>

<style scoped>
.notification {
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--cab-border);
}

.notification:last-child {
  border-bottom: 0;
}

.notification--new {
  background: #eff6ff;
}

.notification__icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--tone-blue-bg);
  color: var(--tone-blue-fg);
}

.notification--success .notification__icon {
  background: var(--tone-green-bg);
  color: var(--tone-green-fg);
}

.notification--warning .notification__icon {
  background: var(--tone-yellow-bg);
  color: var(--tone-yellow-fg);
}

.notification--danger .notification__icon {
  background: var(--tone-red-bg);
  color: var(--tone-red-fg);
}

/* min-width: 0 and overflow-wrap — an article title can be one long word */
.notification__body {
  min-width: 0;
}

.notification__text {
  font-size: 15px;
  line-height: 24px;
  overflow-wrap: anywhere;
  color: var(--cab-text);
}

.notification__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 2px;
  font-size: 13px;
  line-height: 20px;
  color: var(--cab-muted);
}

.notification__new {
  padding: 0 8px;
  border-radius: var(--radius-full);
  background: var(--tone-blue-bg);
  font-size: 12px;
  font-weight: 500;
  color: var(--tone-blue-fg);
}

@media (max-width: 767.98px) {
  .notification {
    padding: 14px 16px;
  }
}
</style>
