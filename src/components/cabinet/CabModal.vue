<script>
import { focusTemporarily } from '@/utils/focus'

/*
 * State shared by every CabModal on the page.
 *   openDialogs    — the open dialogs in the order they were opened (the last one is on top);
 *   mountedDialogs — all of them, also the closed ones and the ones still fading out.
 * The page does not scroll while at least one dialog is on screen (open or still fading out).
 */
const openDialogs = []
const mountedDialogs = new Set()
let lockCount = 0
let savedHtmlStyle = null
let lastPointerDown = null // { target, time }: Safari does not focus a clicked button, so the click tells the opener

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function trackPointer() {
  if (lastPointerDown) return
  lastPointerDown = { target: null, time: 0 }
  document.addEventListener(
    'pointerdown',
    (event) => {
      lastPointerDown = { target: event.target, time: performance.now() }
    },
    { capture: true, passive: true },
  )
}

/* the control the user has just clicked (within the last second), if there is one */
function clickedControl() {
  const { target, time } = lastPointerDown ?? {}
  if (!(target instanceof Element) || performance.now() - time > 1000) return null
  return target.closest(FOCUSABLE)
}

const isVisible = (element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden'

/* can take the focus: still on the page, enabled, visible and not inside an inert part */
const canFocus = (element) =>
  element instanceof HTMLElement && element.isConnected && !element.matches(':disabled') && !element.closest('[inert]') && isVisible(element)

const focusablesIn = (root) => [...root.querySelectorAll(FOCUSABLE)].filter(isVisible)

const topDialog = () => openDialogs[openDialogs.length - 1]?.element ?? null

function lockScroll() {
  lockCount += 1
  if (lockCount > 1) return
  const html = document.documentElement
  savedHtmlStyle = { overflow: html.style.overflow, paddingRight: html.style.paddingRight }
  const padding = parseFloat(getComputedStyle(html).paddingRight) || 0
  const width = html.getBoundingClientRect().width
  html.style.overflow = 'hidden'
  // Without its classic scrollbar (Windows, Linux) the page gets wider, so everything on it would shift:
  // the room the scrollbar took is kept as padding. A fixed element pinned to the right edge can add var(--cab-scrollbar-gap).
  const gap = html.getBoundingClientRect().width - width
  if (gap > 0) {
    html.style.paddingRight = `${padding + gap}px`
    html.style.setProperty('--cab-scrollbar-gap', `${gap}px`)
  }
}

function unlockScroll() {
  if (!lockCount) return
  lockCount -= 1
  if (lockCount) return
  const html = document.documentElement
  html.style.overflow = savedHtmlStyle.overflow
  html.style.paddingRight = savedHtmlStyle.paddingRight
  html.style.removeProperty('--cab-scrollbar-gap')
  savedHtmlStyle = null
}

/* a heading or a landmark is focusable only for as long as it has the focus; the page is not scrolled to it */
/*
 * The opener is gone: the first control next to its old place (`path` — its former ancestors,
 * nearest first), else the page heading. Under another open dialog, the focus stays in that dialog.
 */
function focusNear(path) {
  const top = topDialog()
  const scope = top ?? document.querySelector('main') ?? document.body
  for (const node of path) {
    if (!node.isConnected) continue
    if (node === scope || !scope.contains(node)) break
    const target = focusablesIn(node)[0]
    if (target) {
      target.focus()
      return
    }
  }
  if (top) (focusablesIn(top)[0] ?? top).focus()
  else focusTemporarily(scope.querySelector('h1') ?? scope)
}
</script>

<script setup>
/*
 * Accessible dialog: rendered in <body>, closes on Esc / backdrop click,
 * keeps keyboard focus inside and returns it to the opener afterwards.
 *   <CabModal :open="isOpen" :title="..." size="lg" @close="isOpen = false">
 *     ...body...
 *     <template #footer>...buttons...</template>
 *   </CabModal>
 * Dialogs can be stacked (one opened from another); the page behind them does not scroll or move.
 * If the action removed the opener (e.g. its table row changed), the focus waits on <body> until the
 * end of the update, so the page can move it to its own message; otherwise it goes next to the
 * opener's old place or to the page heading.
 */
import { onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  /** md — 896px (decisions, checks) | lg — 1152px (wizard, review form) | sm — 560px (confirmations) */
  size: { type: String, default: 'md' },
})

const emit = defineEmits(['close'])
const { t } = useI18n()

const dialog = ref(null)
const layer = ref(0) // place in the stack of open dialogs: a dialog opened later is drawn on top
const titleId = `modal-title-${useId()}`

/* this dialog in the shared lists; the element is kept while it fades out (the template ref is cleared at once) */
const entry = { element: null, opener: null, openerPath: [], isOpen: () => props.open }
let holdsLock = false

function onKeydown(event) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    emit('close')
    return
  }
  if (event.key !== 'Tab' || !dialog.value) return
  const items = focusablesIn(dialog.value)
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  if (event.shiftKey && (active === first || active === dialog.value)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

function rememberOpener() {
  const active = document.activeElement
  // opened again before it finished fading out, with the focus still in it: the opener stays the same
  if (holdsLock && (!active || active === document.body || entry.element?.contains(active))) return
  const opener = active && active !== document.body ? active : clickedControl()
  // opened from a dialog that is closing at the same time: the focus later returns to where that one was opened from
  const from = opener && [...mountedDialogs].find((other) => other !== entry && other.element?.contains(opener))
  if (from && !from.isOpen()) {
    entry.opener = from.opener
    entry.openerPath = from.openerPath
    return
  }
  entry.opener = opener
  entry.openerPath = []
  for (let node = entry.opener?.parentElement; node && node !== document.body; node = node.parentElement) {
    entry.openerPath.push(node)
  }
}

function onOpen() {
  rememberOpener()
  entry.element = dialog.value
  if (!openDialogs.includes(entry)) openDialogs.push(entry)
  layer.value = openDialogs.indexOf(entry)
  if (!holdsLock) {
    holdsLock = true
    lockScroll()
  }
  const firstField = dialog.value?.querySelector('input, select, textarea') ?? dialog.value?.querySelector(FOCUSABLE)
  firstField?.focus()
}

function returnFocus() {
  const element = entry.element
  const active = document.activeElement
  // the focus was moved out of this dialog on purpose (e.g. into another dialog): it stays there
  if (active && active !== document.body && !element?.contains(active)) return
  const top = topDialog()
  const { opener, openerPath } = entry
  if (canFocus(opener) && (!top || top.contains(opener))) {
    opener.focus()
    return
  }
  // The opener is gone. The focus waits on <body> while the page reacts (editor/ActionNotice.vue takes it
  // to its message then); if nothing took it, it goes next to the opener's old place.
  if (element?.contains(active)) active.blur()
  setTimeout(() => {
    const now = document.activeElement
    if (!now || now === document.body) focusNear(openerPath)
  })
}

function onClose() {
  const index = openDialogs.indexOf(entry)
  if (index !== -1) openDialogs.splice(index, 1)
  returnFocus()
}

function releaseLock() {
  if (!holdsLock) return
  holdsLock = false
  unlockScroll()
}

/*
 * A closing dialog stays on screen while it fades out, but it is inert: clicks go through to the page,
 * so a quick second click cannot submit it again, and the focus cannot get back into it.
 * Nothing removes the attribute: a dialog opened again during the fade gets a new element.
 */
function onBeforeLeave(element) {
  element.inert = true
}

function onAfterLeave() {
  if (props.open) return // opened again while it was fading out
  entry.element = null
  releaseLock()
}

// after the DOM update and only on real changes: a dialog created closed does nothing
watch(
  () => props.open,
  (isOpen) => (isOpen ? onOpen() : onClose()),
  { flush: 'post' },
)

onMounted(() => {
  trackPointer()
  mountedDialogs.add(entry)
  if (props.open) onOpen()
})

onBeforeUnmount(() => {
  mountedDialogs.delete(entry)
  if (openDialogs.includes(entry)) onClose()
  entry.element = null
  releaseLock()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal" @before-leave="onBeforeLeave" @after-leave="onAfterLeave">
      <div v-if="open" class="modal" :style="layer ? { zIndex: 100 + layer } : undefined" @keydown="onKeydown">
        <div class="modal__backdrop" @click="emit('close')" />
        <div
          ref="dialog"
          class="modal__dialog"
          :class="`modal__dialog--${size}`"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
        >
          <!-- <div>, not <header>/<footer>: in <body> those would be page-wide banner/contentinfo landmarks -->
          <div class="modal__header">
            <h2 :id="titleId" class="modal__title">{{ title }}</h2>
            <button type="button" class="modal__close" :aria-label="t('cabinet.common.actions.close')" @click="emit('close')">
              <AppIcon name="close" :size="20" />
            </button>
          </div>
          <div class="modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  /* one column, never wider than the screen: content that cannot wrap does not push the dialog past its edge */
  grid-template-columns: minmax(0, 1fr);
  place-items: center;
  padding: 24px 16px;
  overflow-y: auto;
}

.modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgb(16 24 40 / 0.5);
}

.modal__dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100dvh - 48px);
  background: var(--cab-surface, #fff);
  border-radius: var(--cab-radius, 14px);
  box-shadow: var(--cab-shadow-modal);
}

/* the dialog itself takes the focus only when a click lands on its text (so Esc still works) */
.modal__dialog:focus {
  outline: none;
}

.modal__dialog--sm {
  max-width: 560px;
}

.modal__dialog--md {
  max-width: 896px;
}

.modal__dialog--lg {
  max-width: 1152px;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 16px 16px 24px;
  border-bottom: 1px solid var(--cab-border, #e5e7eb);
}

.modal__title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  color: var(--cab-text, #101828);
}

.modal__close {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--cab-muted, #6a7282);
  transition: background-color var(--transition);
}

.modal__close:hover {
  background: var(--tone-gray-bg, #f3f4f6);
}

.modal__body {
  padding: 24px;
  overflow-y: auto;
}

.modal__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal__dialog,
.modal-leave-active .modal__dialog {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__dialog,
.modal-leave-to .modal__dialog {
  transform: translateY(12px) scale(0.98);
}

@media (max-width: 767.98px) {
  .modal {
    padding: 12px;
  }

  .modal__body {
    padding: 16px;
  }

  .modal__footer {
    padding: 12px 16px 16px;
  }

  .modal__footer > :deep(*) {
    flex: 1 1 auto;
  }

  /* a long label ("Загрузить исправленную статью") wraps inside its button on a narrow phone */
  .modal__footer > :deep(.cab-btn) {
    white-space: normal;
  }
}
</style>
