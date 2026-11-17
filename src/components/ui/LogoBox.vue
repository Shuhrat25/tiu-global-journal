<script setup>
/*
 * Renders a logo inside a fixed-ratio box.
 * `box` holds the logo placement exported from Figma (percentages of the box),
 * which keeps every logo at exactly the designed visual size at any width.
 */
import { computed } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  ratio: { type: String, default: '182 / 104' },
  box: { type: Object, default: null }, // { w, h, x, y } in %
})

const imgStyle = computed(() =>
  props.box
    ? {
        width: `${props.box.w}%`,
        height: `${props.box.h}%`,
        left: `${props.box.x}%`,
        top: `${props.box.y}%`,
      }
    : { inset: 0, width: '100%', height: '100%', objectFit: 'contain' },
)
</script>

<template>
  <span class="logo-box" :style="{ aspectRatio: ratio }">
    <img :src="src" :alt="alt" :style="imgStyle" loading="lazy" />
  </span>
</template>

<style scoped>
.logo-box {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
}

.logo-box img {
  position: absolute;
  max-width: none;
}
</style>
