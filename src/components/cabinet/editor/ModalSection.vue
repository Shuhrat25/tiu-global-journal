<script setup>
/*
 * Titled block inside the editor dialogs (Figma: Heading 4 + grey box).
 * Without slot content it shows `text` — user content, so line breaks are kept.
 */
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
})
</script>

<template>
  <section class="modal-section">
    <h4 class="modal-section__title">{{ title }}</h4>
    <slot>
      <p class="modal-section__text">{{ text || '—' }}</p>
    </slot>
  </section>
</template>

<style scoped>
.modal-section {
  display: grid;
  gap: 8px;
}

.modal-section__title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: var(--cab-text);
}

.modal-section__text {
  padding: 12px;
  border-radius: var(--cab-radius-sm);
  background: var(--cab-bg);
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-text-2);
  white-space: pre-line;
  overflow-wrap: anywhere;
}
</style>
