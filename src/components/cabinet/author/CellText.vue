<script setup>
/*
 * Main value of a table cell (an article title, an amount) with an optional muted line under it
 * (the default slot): the compact table layout shows there the values of its hidden columns.
 * The id lets the row's buttons name the article for screen readers (aria-describedby).
 */
defineProps({
  text: { type: String, required: true },
  id: { type: String, default: undefined },
  /** keeps the value on one line (amounts); titles wrap instead */
  nowrap: { type: Boolean, default: false },
})
</script>

<template>
  <div class="cell-text">
    <span :id="id" class="cell-text__main" :class="{ 'cell-text__main--nowrap': nowrap }">{{ text }}</span>
    <span v-if="$slots.default" class="cell-text__sub"><slot /></span>
  </div>
</template>

<style scoped>
.cell-text__main {
  display: block;
  font-weight: 500;
  color: var(--cab-text);
  overflow-wrap: anywhere;
}

.cell-text__main--nowrap {
  white-space: nowrap;
}

.cell-text__sub {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-muted);
}
</style>
