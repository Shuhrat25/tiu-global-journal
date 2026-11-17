<script setup>
/*
 * Search, status and period (calendar) filters above a table.
 * Bind it to useTableQuery():  <TableToolbar v-model:search="q.search.value" ... />
 * statusOptions: [{ value, label }] — omit to hide the status select.
 * The texts default to an article table (search by title or author, filter by status);
 * a table that searches or filters other fields passes its own:
 *   searchPlaceholder — the fields the search runs against, as a short list ("Article, author, payer"):
 *                       the icon and the label already say "search", and the hint must fit a 320px phone
 *   statusLabel       — the (visually hidden) name of the status select
 *   allLabel          — its first option, the one that clears the filter
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  statusOptions: { type: Array, default: null },
  showPeriod: { type: Boolean, default: true },
  total: { type: Number, default: null },
  filtered: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: '' },
  statusLabel: { type: String, default: '' },
  allLabel: { type: String, default: '' },
})

const search = defineModel('search', { type: String, default: '' })
const status = defineModel('status', { type: String, default: 'all' })
const period = defineModel('period', { type: String, default: 'all' })
const from = defineModel('from', { type: String, default: '' })
const to = defineModel('to', { type: String, default: '' })

const emit = defineEmits(['reset'])

const { t } = useI18n()
const PERIODS = ['all', 'week', 'month', 'custom']
const searchInput = ref(null)

/* "Reset" disappears together with the filters: the focus it had goes to the search field, not to <body> */
function reset(event) {
  const hadFocus = event.currentTarget === document.activeElement
  emit('reset')
  if (hadFocus) searchInput.value?.focus()
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__row">
      <label class="toolbar__search">
        <span class="visually-hidden">{{ t('cabinet.common.filters.search') }}</span>
        <AppIcon name="search" :size="18" />
        <input
          ref="searchInput"
          v-model="search"
          class="cab-input"
          type="search"
          :placeholder="searchPlaceholder || t('cabinet.common.filters.searchPlaceholder')"
        />
      </label>

      <label v-if="statusOptions" class="toolbar__field">
        <span class="visually-hidden">{{ statusLabel || t('cabinet.common.filters.status') }}</span>
        <select v-model="status" class="cab-select">
          <option value="all">{{ allLabel || t('cabinet.common.filters.allStatuses') }}</option>
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>

      <label v-if="showPeriod" class="toolbar__field">
        <span class="visually-hidden">{{ t('cabinet.common.filters.period') }}</span>
        <select v-model="period" class="cab-select">
          <option v-for="key in PERIODS" :key="key" :value="key">{{ t(`cabinet.common.filters.periods.${key}`) }}</option>
        </select>
      </label>

      <button v-if="filtered" type="button" class="toolbar__reset" @click="reset">
        <AppIcon name="rotate-ccw" :size="16" />
        {{ t('cabinet.common.filters.reset') }}
      </button>
    </div>

    <div v-if="showPeriod && period === 'custom'" class="toolbar__range">
      <label>
        <span>{{ t('cabinet.common.filters.from') }}</span>
        <input v-model="from" class="cab-input" type="date" :max="to || undefined" />
      </label>
      <label>
        <span>{{ t('cabinet.common.filters.to') }}</span>
        <input v-model="to" class="cab-input" type="date" :min="from || undefined" />
      </label>
    </div>

    <!-- the live region is on the page before its text: a region added together with its text
         is often not announced (see CabNotice.vue), so the first count would go unheard -->
    <p v-if="total !== null" class="toolbar__count" role="status">
      {{ filtered ? t('cabinet.common.filters.found', { n: total }) : '' }}
    </p>
  </div>
</template>

<style scoped>
.toolbar {
  display: grid;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--cab-border);
}

.toolbar__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.toolbar__search {
  position: relative;
  flex: 1 1 280px;
  color: var(--cab-muted);
}

.toolbar__search :deep(svg) {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  pointer-events: none;
}

.toolbar__search .cab-input {
  padding-left: 42px;
}

/*
 * An empty search field still keeps room for its invisible clear button (Chrome, Safari),
 * which cuts the hint short; the button is only needed once something is typed.
 */
.toolbar__search .cab-input:placeholder-shown::-webkit-search-cancel-button {
  display: none;
}

/* a select is as wide as its longest option (so a long status is not cut), at least the 220px of the design */
.toolbar__field {
  flex: 0 1 auto;
  min-width: 220px;
}

.toolbar__reset {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--cab-radius-sm);
  font-size: 14px;
  color: var(--color-primary);
}

.toolbar__reset:hover {
  background: #eff6ff;
}

.toolbar__range {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar__range label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--cab-subtle);
}

.toolbar__count {
  font-size: 14px;
  color: var(--cab-muted);
}

/* while there is nothing to count, the region takes no row (and no gap) in the toolbar */
.toolbar__count:empty {
  position: absolute;
}

@media (max-width: 767.98px) {
  .toolbar {
    padding: 12px 16px;
  }

  /* the search takes a row of its own, so the hint gets the whole width */
  .toolbar__search {
    flex-basis: 100%;
  }

  /*
   * The selects share the next row only while both fit there whole; on a narrower phone they take
   * a row each instead of cutting their text. Either way they stretch to the end of the row.
   */
  .toolbar__field {
    flex: 1 1 auto;
    min-width: 0;
  }
}
</style>
