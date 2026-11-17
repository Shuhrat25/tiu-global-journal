<script setup>
/* Highlighted feedback from the editor: a revision request (warning), a rejection (danger) or a plain note (info) */
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  title: { type: String, required: true },
  /** warning | danger | info */
  tone: { type: String, default: 'warning' },
})
</script>

<template>
  <section class="note" :class="`note--${tone}`">
    <h3 class="note__title">
      <AppIcon name="message-square" :size="18" />
      {{ title }}
    </h3>
    <div class="note__body"><slot /></div>
  </section>
</template>

<style scoped>
.note {
  padding: 16px 18px;
  border: 1px solid var(--note-border);
  border-left-width: 4px;
  border-radius: var(--cab-radius-sm);
  background: var(--note-bg);
}

.note--warning {
  --note-bg: #fffbeb;
  --note-border: #fcd34d;
  --note-fg: var(--tone-yellow-fg);
}

.note--danger {
  --note-bg: #fef2f2;
  --note-border: #ffa2a2;
  --note-fg: var(--tone-red-fg);
}

.note--info {
  --note-bg: #eff6ff;
  --note-border: #bedbff;
  --note-fg: var(--tone-blue-fg);
}

.note__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: var(--note-fg);
}

.note__body {
  display: grid;
  gap: 8px;
  font-size: 15px;
  line-height: 24px;
  color: var(--cab-text);
  white-space: pre-line;
  overflow-wrap: anywhere;
}
</style>
