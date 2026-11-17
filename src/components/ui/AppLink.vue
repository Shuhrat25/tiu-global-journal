<script setup>
/* Renders a RouterLink for internal routes (`to`) and a plain <a> otherwise. */
defineProps({
  to: { type: [String, Object], default: null },
  href: { type: String, default: '#' },
})
</script>

<template>
  <RouterLink v-if="to" :to="to"><slot /></RouterLink>
  <a v-else :href="href"><slot /></a>
</template>
