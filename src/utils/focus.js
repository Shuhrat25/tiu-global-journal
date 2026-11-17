/**
 * Moves the focus to an element that is not focusable by itself (a heading, a landmark), e.g. the
 * heading of a page just opened. It stays focusable only while it has the focus; the page is not
 * scrolled to it.
 */
export function focusTemporarily(element) {
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1')
    element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true })
  }
  element.focus({ preventScroll: true })
}
