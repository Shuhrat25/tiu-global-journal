<script setup>
/*
 * Row of StatCards on the author pages.
 *   4 cards (dashboard): 4 per row from 1280px, 2 below.
 *   3 cards (payments):  3 per row from 768px, 2 below; the odd last card takes the whole row.
 * Under 480px every card takes its own row.
 */
defineProps({
  /** cards per row on wide screens: 4 | 3 */
  columns: { type: Number, default: 4, validator: (value) => value === 3 || value === 4 },
})
</script>

<template>
  <div class="stat-grid" :class="`stat-grid--${columns}`"><slot /></div>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.stat-grid--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 1279.98px) {
  .stat-grid--4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767.98px) {
  .stat-grid {
    gap: 16px;
  }

  .stat-grid--3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat-grid--3 > :deep(:last-child:nth-child(odd)) {
    grid-column: 1 / -1;
  }
}

/* declared last: one column wins over the 2-column rules above */
@media (max-width: 479.98px) {
  .stat-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
