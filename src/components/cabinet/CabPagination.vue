<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  pageCount: { type: Number, required: true },
  total: { type: Number, required: true },
  pageSize: { type: Number, required: true },
})

const page = defineModel('page', { type: Number, required: true })
const { t } = useI18n()

const range = computed(() => ({
  from: props.total ? (page.value - 1) * props.pageSize + 1 : 0,
  to: Math.min(page.value * props.pageSize, props.total),
  total: props.total,
}))

/* 1 … 4 5 6 … 12 */
const pages = computed(() => {
  const count = props.pageCount
  const current = page.value
  const set = new Set([1, count, current - 1, current, current + 1].filter((p) => p >= 1 && p <= count))
  const sorted = [...set].sort((a, b) => a - b)
  const result = []
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) result.push('…')
    result.push(p)
  })
  return result
})

/*
 * The arrows of the first and the last page are aria-disabled, not disabled: a disabled button
 * loses the focus, so a keyboard user paging to the end would be thrown back to <body>.
 */
function go(target) {
  if (target >= 1 && target <= props.pageCount) page.value = target
}
</script>

<template>
  <nav v-if="total > 0" class="pagination" :aria-label="t('cabinet.common.pagination.label')">
    <p class="pagination__info">{{ t('cabinet.common.pagination.range', range) }}</p>
    <div v-if="pageCount > 1" class="pagination__pages">
      <button
        type="button"
        class="pagination__btn"
        :aria-disabled="page === 1 ? 'true' : undefined"
        :aria-label="t('cabinet.common.pagination.prev')"
        @click="go(page - 1)"
      >
        <AppIcon name="chevron-left" :size="18" />
      </button>
      <!-- keyed by the page number: the pressed button stays the same element, so it keeps the focus -->
      <template v-for="(item, index) in pages" :key="item === '…' ? `gap-${index}` : item">
        <span v-if="item === '…'" class="pagination__gap">…</span>
        <button
          v-else
          type="button"
          class="pagination__btn"
          :class="{ 'is-active': item === page }"
          :aria-current="item === page ? 'page' : undefined"
          @click="go(item)"
        >
          {{ item }}
        </button>
      </template>
      <button
        type="button"
        class="pagination__btn"
        :aria-disabled="page === pageCount ? 'true' : undefined"
        :aria-label="t('cabinet.common.pagination.next')"
        @click="go(page + 1)"
      >
        <AppIcon name="chevron-right" :size="18" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 24px;
  border-top: 1px solid var(--cab-border);
}

.pagination__info {
  font-size: 14px;
  color: var(--cab-muted);
}

.pagination__pages {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination__btn {
  display: grid;
  place-items: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid var(--cab-border);
  border-radius: 8px;
  background: var(--cab-surface);
  font-size: 14px;
  color: var(--cab-text-2);
  transition:
    background-color var(--transition),
    border-color var(--transition),
    color var(--transition);
}

.pagination__btn:not([aria-disabled='true']):hover {
  border-color: var(--cab-border-strong);
}

.pagination__btn[aria-disabled='true'] {
  opacity: 0.45;
  cursor: not-allowed;
}

.pagination__btn.is-active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-white);
}

.pagination__gap {
  padding: 0 4px;
  color: var(--cab-muted);
}

@media (max-width: 767.98px) {
  .pagination {
    padding: 12px 16px;
  }
}
</style>
