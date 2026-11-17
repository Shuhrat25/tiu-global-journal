<script setup>
/*
 * Success message under the page header. It is translated here, so a visible message follows
 * a language switch. Every new notice object re-creates the message and takes the focus,
 * so it is seen and announced, even when the text repeats the previous one. The focus is what
 * announces it, so the message is no live region of its own (it would be read twice).
 * The box stays in the page without a message: closing one keeps the focus in its place.
 */
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CabNotice from '@/components/cabinet/CabNotice.vue'

const props = defineProps({
  /** { key, params } of the message text; a new object for every message */
  notice: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const { t } = useI18n()
const box = ref(null)
const version = ref(0)

// focused after the update: the closing dialog first returns the focus to its opener
watch(
  () => props.notice,
  async (notice) => {
    if (!notice) return
    version.value += 1
    await nextTick()
    box.value?.focus()
  },
)

/* the close button is about to be removed: the focus moves to the box instead of falling back to <body> */
function close() {
  box.value?.focus({ preventScroll: true })
  emit('close')
}
</script>

<template>
  <div ref="box" class="page-notice" tabindex="-1">
    <CabNotice v-if="notice" :key="version" :announce="false" :text="t(notice.key, notice.params)" @close="close" />
  </div>
</template>

<style scoped>
.page-notice {
  scroll-margin-top: 88px; /* below the sticky top bar on tablets and phones */
}

.page-notice:focus {
  outline: none;
}
</style>
