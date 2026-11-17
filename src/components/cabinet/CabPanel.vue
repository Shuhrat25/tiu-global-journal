<script setup>
/* White card with an optional header row (title + actions). `flush` removes the body padding (tables). */
defineProps({
  title: { type: String, default: '' },
  flush: { type: Boolean, default: false },
})
</script>

<template>
  <section class="panel">
    <header v-if="title || $slots.actions" class="panel__header">
      <h2 class="panel__title">{{ title }}</h2>
      <div v-if="$slots.actions" class="panel__actions"><slot name="actions" /></div>
    </header>
    <div :class="flush ? 'panel__body--flush' : 'panel__body'">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: var(--cab-surface);
  border: 1px solid var(--cab-border);
  border-radius: var(--cab-radius);
  overflow: hidden;
}

.panel__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--cab-border);
}

.panel__title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  color: var(--cab-text);
}

.panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.panel__body {
  padding: 24px;
}

@media (max-width: 767.98px) {
  .panel__header {
    padding: 14px 16px;
  }

  .panel__title {
    font-size: 18px;
  }

  .panel__body {
    padding: 16px;
  }
}
</style>
