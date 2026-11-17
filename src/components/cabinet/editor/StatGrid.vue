<script setup>
defineProps({
  /** slightly larger cards on desktop — the editor dashboard (Figma comments #13–#17) */
  large: { type: Boolean, default: false },
})
</script>

<template>
  <div class="stat-grid" :class="{ 'stat-grid--large': large }"><slot /></div>
</template>

<style scoped>
/* Grid of StatCards: 3 per row from 1024px, 2 from 560px, 1 below */
.stat-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

@media (min-width: 560px) {
  .stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 560px) and (max-width: 1023.98px) {
  /* an odd last card fills its row instead of leaving a hole */
  .stat-grid > :deep(:last-child:nth-child(odd)) {
    grid-column: 1 / -1;
  }
}

@media (min-width: 768px) {
  .stat-grid {
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .stat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .stat-grid--large :deep(.stat) {
    padding: 28px;
  }

  .stat-grid--large :deep(.stat__value) {
    font-size: 32px;
    line-height: 40px;
  }
}
</style>
