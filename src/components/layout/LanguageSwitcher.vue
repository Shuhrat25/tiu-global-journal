<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALES } from '@/i18n/locales'
import { setLocale } from '@/i18n'
import chevronIcon from '@/assets/icons/chevron-down-sm.svg'

const props = defineProps({
  /** down — header (default) | up — bottom of the cabinet sidebar */
  placement: { type: String, default: 'down' },
})

const { t, locale } = useI18n()

// Disclosure pattern: a toggle button shows a list of language buttons, the current one has aria-current
const open = ref(false)
const root = ref(null)
const toggleButton = ref(null)

const active = computed(() => LOCALES.find((l) => l.code === locale.value) ?? LOCALES[0])

/* The options disappear with the menu: a focus on one of them goes back to the toggle, not to <body> */
function close() {
  if (root.value?.contains(document.activeElement)) toggleButton.value?.focus()
  open.value = false
}

function select(code) {
  setLocale(code)
  close()
}

// Esc inside the switcher closes only the menu, not the drawer or panel the switcher is in
function onEscape(event) {
  if (!open.value) return
  event.stopPropagation()
  close()
}

function onDocumentClick(event) {
  // the path at dispatch time: the clicked node may already be re-rendered and detached
  if (open.value && !event.composedPath().includes(root.value)) open.value = false
}

// Esc while the focus is outside the switcher (e.g. the menu was opened with a mouse in Safari)
function onKeydown(event) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" class="lang" @keydown.esc="onEscape">
    <button
      ref="toggleButton"
      type="button"
      class="lang__toggle"
      :aria-expanded="open"
      :aria-label="`${t('header.language')}: ${active.label}`"
      @click="open = !open"
    >
      <span class="lang__flag" :class="{ 'lang__flag--crop': active.crop }">
        <img :src="active.flag" alt="" width="20" height="20" />
      </span>
      <span class="lang__label">{{ active.label }}</span>
      <img class="lang__chevron" :class="{ 'is-open': open }" :src="chevronIcon" alt="" width="18" height="18" />
    </button>

    <Transition name="fade-down">
      <ul
        v-if="open"
        class="lang__menu"
        :class="{ 'lang__menu--up': props.placement === 'up' }"
        :aria-label="t('header.language')"
      >
        <li v-for="lang in LOCALES" :key="lang.code">
          <button
            type="button"
            class="lang__option"
            :class="{ 'is-active': lang.code === locale }"
            :lang="lang.code"
            :aria-current="lang.code === locale ? 'true' : undefined"
            @click="select(lang.code)"
          >
            <span class="lang__flag" :class="{ 'lang__flag--crop': lang.crop }">
              <img :src="lang.flag" alt="" width="20" height="20" />
            </span>
            {{ lang.label }}
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.lang {
  position: relative;
}

.lang__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: inherit;
  color: var(--color-text-dark);
}

.lang__flag {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgb(8 30 58 / 0.08);
}

.lang__flag img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
}

/* Crop from Figma: shows the left part of the Uzbek flag (crescent side) */
.lang__flag--crop img {
  inset: 0 auto auto -4.17%;
  width: 166.67%;
  object-fit: fill;
}

.lang__label {
  opacity: 0.9;
}

.lang__chevron {
  margin-left: -6px;
  transform: rotate(90deg);
  transition: transform var(--transition);
}

.lang__chevron.is-open {
  transform: rotate(-90deg);
}

.lang__menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 60;
  min-width: 180px;
  padding: 6px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-float);
}

.lang__menu--up {
  top: auto;
  right: auto;
  bottom: calc(100% + 10px);
  left: 0;
}

.lang__option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  text-align: left;
  color: var(--color-text-nav);
}

.lang__option:hover,
.lang__option.is-active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.fade-down-enter-active,
.fade-down-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
