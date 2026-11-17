<script setup>
/*
 * Article title in an editor table row. Its id gives the row buttons their context
 * for screen readers (aria-describedby). Each element in the optional slot becomes a
 * muted line under the title: the compact layout shows the values without a column there.
 */
defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
})
</script>

<template>
  <div class="table-title">
    <span :id="id" class="table-title__text">{{ title }}</span>
    <div v-if="$slots.default" class="table-title__meta"><slot /></div>
  </div>
</template>

<style scoped>
.table-title {
  min-width: 0;
}

.table-title__text {
  display: block;
  font-weight: 500;
  color: var(--cab-text);
  overflow-wrap: anywhere;
}

.table-title__meta {
  display: grid;
  gap: 2px;
  margin-top: 4px;
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-muted);
  overflow-wrap: anywhere;
}
</style>
