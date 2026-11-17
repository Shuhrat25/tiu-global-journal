import { getCurrentScope, onScopeDispose, readonly, shallowRef } from 'vue'

/**
 * Reactive `window.matchMedia(query).matches`:  const wide = useMediaQuery('(min-width: 1024px)')
 * - read synchronously, so the first render already has the right value;
 * - SSR-safe: where `window.matchMedia` does not exist the value stays `false`;
 * - auto-cleaning: the listener is removed when the calling component (or effect scope) is disposed,
 *   so call it from setup() or an effect scope.
 */
export function useMediaQuery(query) {
  const matches = shallowRef(false)
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return readonly(matches)

  const list = window.matchMedia(query)
  matches.value = list.matches
  const update = (event) => {
    matches.value = event.matches
  }
  list.addEventListener('change', update)
  if (getCurrentScope()) onScopeDispose(() => list.removeEventListener('change', update))
  return readonly(matches)
}

/*
 * Cabinet tables show all their columns from the 1440px design width and on phones, where
 * DataTable turns the rows into cards (its phone breakpoint is the same 767.98px). In between,
 * the sidebar leaves too little room, so secondary values move under the main one (compact layout).
 */
export const FULL_TABLE_QUERY = '(min-width: 1440px), (max-width: 767.98px)'

/** true while a table shows its full column set (see FULL_TABLE_QUERY) */
export const useFullTable = () => useMediaQuery(FULL_TABLE_QUERY)
