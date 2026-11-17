<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  icon: { type: String, default: 'inbox' },
  text: { type: String, required: true },
})
</script>

<template>
  <div class="empty">
    <AppIcon :name="icon" :size="40" :stroke-width="1.5" />
    <p>{{ text }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 24px;
  text-align: center;
  color: var(--cab-muted);
  font-size: 15px;
}
</style>
