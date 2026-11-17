<script setup>
/*
 * Generic table.
 *   columns:     [{ key, label, width? }]
 *   rows:        array of objects; `rowKey` names the unique field
 *   caption:     the table's accessible name; visually hidden unless `showCaption`
 *   slots:       #cell-<key>="{ row }" to render a custom cell, #empty for the empty state
 * On phones every row turns into a card of "label | value" lines. The content of each cell
 * is kept in one wrapper, so a cell may render several elements (badge + text, two buttons)
 * and badges and buttons keep their natural width; a value too wide to sit next to its label
 * moves under it instead of widening the card.
 * When the columns are wider than the screen the table scrolls sideways: the scroll area
 * then becomes a focusable, named region, so keyboard users can scroll it with the arrow keys.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  rowKey: { type: String, default: 'id' },
  caption: { type: String, default: '' },
  showCaption: { type: Boolean, default: false },
})

const { t } = useI18n()

/* ---------- horizontal overflow ---------- */
const scroller = ref(null)
const table = ref(null)
const overflowing = ref(false)
let observer = null

function measure() {
  const element = scroller.value
  overflowing.value = Boolean(element) && element.scrollWidth - element.clientWidth > 1
}

// the scroll area resizes with the page, the table with its rows and columns
onMounted(() => {
  measure()
  if (typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(measure)
  observer.observe(scroller.value)
  observer.observe(table.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    ref="scroller"
    class="table-wrap"
    :tabindex="overflowing ? 0 : undefined"
    :role="overflowing ? 'region' : undefined"
    :aria-label="overflowing ? caption || t('cabinet.common.table.scrollRegion') : undefined"
  >
    <table ref="table" class="table">
      <caption v-if="caption" class="table__caption" :class="{ 'table__caption--shown': showCaption }">
        <span :class="{ 'visually-hidden': !showCaption }">{{ caption }}</span>
      </caption>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" scope="col" :style="column.width ? { width: column.width } : null">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[rowKey]">
          <td v-for="column in columns" :key="column.key" :data-label="column.label">
            <div class="table__value">
              <slot :name="`cell-${column.key}`" :row="row">{{ row[column.key] }}</slot>
            </div>
          </td>
        </tr>
        <tr v-if="!rows.length" class="table__empty-row">
          <td :colspan="columns.length">
            <slot name="empty" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
}

/* drawn inside: the panels around the tables clip everything outside their edges */
.table-wrap:focus-visible {
  outline: 2px solid var(--color-primary-bright);
  outline-offset: -2px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  line-height: 22px;
  color: var(--cab-text);
}

.table__caption--shown {
  padding: 16px 24px 12px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  text-align: left;
  color: var(--cab-text-2);
}

th {
  padding: 12px 24px;
  background: var(--cab-head-bg);
  border-bottom: 1px solid var(--cab-border);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: left;
  color: var(--cab-muted);
  white-space: nowrap;
}

td {
  padding: 18px 24px;
  border-bottom: 1px solid var(--cab-border);
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:not(.table__empty-row):hover td {
  background: #fcfcfd;
}

.table__empty-row td {
  padding: 0;
}

@media (max-width: 767.98px) {
  .table thead {
    display: none;
  }

  .table,
  .table caption,
  .table tbody,
  .table tr,
  .table td {
    display: block;
    width: 100%;
  }

  .table__caption--shown {
    padding: 12px 16px 0;
  }

  .table tr:not(.table__empty-row) {
    padding: 12px 16px;
    border-bottom: 1px solid var(--cab-border);
  }

  .table tbody tr:last-child {
    border-bottom: 0;
  }

  /*
   * Exactly two items: the label (generated from data-label) takes 38% of the line, but never less
   * than its longest word, and the value wrapper the rest. A value that does not fit there
   * (a long button or badge on a narrow phone) moves under its label instead of widening the card.
   */
  .table td {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    padding: 6px 0;
    border: 0;
  }

  .table td::before {
    content: attr(data-label);
    flex: 0 0 38%;
    font-size: 12px;
    line-height: 22px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--cab-muted);
  }

  /* text wraps inside the line, even a long word or link, so only buttons and badges can move a value down */
  .table__value {
    flex: 1 1 0;
    overflow-wrap: anywhere;
  }

  .table__empty-row td {
    display: block;
  }

  .table__empty-row td::before {
    content: none;
  }
}
</style>
