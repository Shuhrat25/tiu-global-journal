<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  id: { type: String, default: undefined },
})
</script>

<template>
  <header class="section-header">
    <h2 :id="id" class="section-header__title">{{ title }}</h2>
    <p v-if="subtitle" class="section-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-header__title {
  font-size: clamp(26px, 2.6vw + 12px, 36px);
  line-height: 1.12;
  font-weight: 600;
  color: var(--color-heading);
}

.section-header__subtitle {
  margin-top: 12px;
  font-size: clamp(16px, 0.6vw + 13px, 20px);
  line-height: 1.4;
  color: var(--color-text);
}

@media (max-width: 767.98px) {
  .section-header {
    margin-bottom: 24px;
  }

  .section-header__subtitle {
    margin-top: 8px;
  }
}
</style>
