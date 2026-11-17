import { computed, ref, toValue, watch } from 'vue'
import { isoDaysAgo } from '@/utils/date'

/**
 * Search + status filter + period filter + pagination for cabinet tables
 * (Figma comments #10/#23 search, #19 filter, #11 calendar filter, #25 pagination).
 *
 * @param source      ref/getter returning the full list
 * @param options.search    (item) => string the search runs against
 * @param options.statusOf  (item) => status string (default: item.status)
 * @param options.groups    { groupKey: [statuses] } — named status groups (stat cards)
 * @param options.dateOf    (item) => 'YYYY-MM-DD' used by the period filter
 * @param options.pageSize  rows per page
 */
export function useTableQuery(source, options = {}) {
  const {
    search: searchText = (item) => `${item.title ?? ''} ${item.authors ?? ''}`,
    statusOf = (item) => item.status,
    groups = {},
    dateOf = (item) => item.submittedAt,
    pageSize = 8,
  } = options

  const search = ref('')
  const status = ref('all') // 'all' | a status | a group key
  const period = ref('all') // 'all' | 'week' | 'month' | 'custom'
  const from = ref('')
  const to = ref('')
  const page = ref(1)

  /*
   * The filters in effect. A chosen control only counts once it narrows the list:
   * a blank search or a "custom" period without a date filters nothing yet.
   */
  const criteria = computed(() => {
    const query = search.value.trim().toLowerCase()
    const allowed = status.value === 'all' ? null : (groups[status.value] ?? [status.value])

    let since = null
    let until = null
    if (period.value === 'week') since = isoDaysAgo(7)
    if (period.value === 'month') since = isoDaysAgo(30)
    if (period.value === 'custom') {
      since = from.value || null
      until = to.value || null
    }

    return { query, allowed, since, until }
  })

  const filtered = computed(() => {
    const { query, allowed, since, until } = criteria.value
    return toValue(source).filter((item) => {
      if (allowed && !allowed.includes(statusOf(item))) return false
      if (query && !searchText(item).toLowerCase().includes(query)) return false
      const date = dateOf(item)
      if (since && date < since) return false
      if (until && date > until) return false
      return true
    })
  })

  const total = computed(() => filtered.value.length)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))
  const rows = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

  // any filter change starts from the first page
  watch([search, status, period, from, to], () => {
    page.value = 1
  })
  watch(pageCount, (count) => {
    if (page.value > count) page.value = count
  })

  /* true while a filter is in effect (TableToolbar then shows "Reset" and the number of results) */
  const isFiltered = computed(() => {
    const { query, allowed, since, until } = criteria.value
    return Boolean(query || allowed || since || until)
  })

  function reset() {
    search.value = ''
    status.value = 'all'
    period.value = 'all'
    from.value = ''
    to.value = ''
  }

  /** stat-card toggle: click once to filter, again to clear */
  function toggleStatus(value) {
    status.value = status.value === value ? 'all' : value
  }

  return { search, status, period, from, to, page, pageSize, filtered, rows, total, pageCount, isFiltered, reset, toggleStatus }
}
