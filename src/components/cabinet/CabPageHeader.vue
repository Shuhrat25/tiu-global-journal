<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <header class="page-header">
    <div>
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header__actions"><slot name="actions" /></div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
  margin-bottom: 32px;
}

.page-header__title {
  font-size: 30px;
  line-height: 36px;
  font-weight: 600;
  color: var(--cab-text);
}

.page-header__subtitle {
  margin-top: 8px;
  font-size: 16px;
  line-height: 24px;
  color: var(--cab-subtle);
}

.page-header__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 767.98px) {
  .page-header {
    margin-bottom: 20px;
  }

  .page-header__title {
    font-size: 24px;
    line-height: 30px;
  }

  .page-header__subtitle {
    font-size: 15px;
    line-height: 22px;
  }

  .page-header__actions,
  .page-header__actions > :deep(*) {
    width: 100%;
  }
}
</style>
