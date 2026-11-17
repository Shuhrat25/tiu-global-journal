<script setup>
/*
 * Inline message (e.g. "Article submitted"). tone: success | info | warning | danger
 *
 * The text is a polite live region (role="status"). A screen reader announces a live region only when
 * its content changes after the region is on the page, so a new notice gets its text a moment after
 * it appears (it fades in then); a later change of the text is announced too.
 * With :announce="false" the text is shown at once and is not a live region.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  tone: { type: String, default: 'success' },
  text: { type: String, required: true },
  dismissible: { type: Boolean, default: true },
  /** false — for a page that moves the focus to the notice or announces it with a live region of its own */
  announce: { type: Boolean, default: true },
})

defineEmits(['close'])

const { t } = useI18n()

const ICONS = { success: 'check-circle', info: 'bell', warning: 'alert-circle', danger: 'x-circle' }

/* how long the empty live region is on the page before its text goes in (shorter is not announced reliably) */
const ANNOUNCE_DELAY = 150

const regionReady = ref(false)
let timer = null

onMounted(() => {
  timer = setTimeout(() => {
    regionReady.value = true
  }, ANNOUNCE_DELAY)
})

onBeforeUnmount(() => clearTimeout(timer))

const waiting = computed(() => props.announce && !regionReady.value)
</script>

<template>
  <div class="notice" :class="[`notice--${tone}`, { 'notice--waiting': waiting }]">
    <AppIcon :name="ICONS[tone]" :size="20" />
    <!-- only the text is the live region: the close button is not read out with it -->
    <p :role="announce ? 'status' : undefined">{{ waiting ? '' : text }}</p>
    <button
      v-if="dismissible"
      type="button"
      class="notice__close"
      :aria-label="t('cabinet.common.actions.close')"
      @click="$emit('close')"
    >
      <AppIcon name="close" :size="16" />
    </button>
  </div>
</template>

<style scoped>
.notice {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 24px;
  border-radius: var(--cab-radius-sm);
  font-size: 15px;
  line-height: 22px;
  transition: opacity var(--transition);
}

.notice--waiting {
  opacity: 0;
}

/* a long unbroken word (e.g. in an article title) wraps instead of widening the page */
.notice p {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}

.notice--success { background: var(--tone-green-bg); color: var(--tone-green-fg); }
.notice--info { background: var(--tone-blue-bg); color: var(--tone-blue-fg); }
.notice--warning { background: var(--tone-yellow-bg); color: var(--tone-yellow-fg); }
.notice--danger { background: var(--tone-red-bg); color: var(--tone-red-fg); }

.notice__close {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: inherit;
}

.notice__close:hover {
  background: rgb(255 255 255 / 0.5);
}
</style>
