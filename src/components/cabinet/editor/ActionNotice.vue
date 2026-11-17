<script setup>
import { nextTick, ref, watch } from 'vue'
import CabNotice from '@/components/cabinet/CabNotice.vue'

/*
 * Result of an editor action shown under the page header.
 *   notice: { message: () => string, tone } — a getter, so the text follows a language switch
 * Actions start in dialogs opened from table rows further down the page,
 * so a new message scrolls itself into view. The row button that opened the
 * dialog is usually replaced after the action; then the keyboard focus,
 * which would fall back to <body>, moves to the message.
 */
const props = defineProps({
  notice: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const root = ref(null)
const version = ref(0) // re-creates the message inside the live region, so a repeated text is announced again

watch(
  () => props.notice,
  async (notice) => {
    if (!notice) return
    version.value += 1
    await nextTick()
    root.value?.scrollIntoView({ block: 'nearest' })
    if (document.activeElement === document.body) root.value?.focus({ preventScroll: true })
  },
)

/* the close button goes away with the message: the focus it had stays in the same place, on the region */
function close() {
  if (root.value?.contains(document.activeElement)) root.value.focus({ preventScroll: true })
  emit('close')
}
</script>

<template>
  <!-- the live region stays in the page, so a message added to it is announced;
       the message is no live region of its own, so it is announced once -->
  <div ref="root" class="action-notice" tabindex="-1" role="status">
    <CabNotice
      v-if="notice"
      :key="version"
      :announce="false"
      :tone="notice.tone"
      :text="notice.message()"
      @close="close"
    />
  </div>
</template>

<style scoped>
/* clear of the sticky top bar on tablets and phones */
.action-notice {
  scroll-margin-top: 80px;
}

/* the message itself shows where the focus is; the empty region after a close has nothing to outline */
.action-notice:focus {
  outline: none;
}
</style>
