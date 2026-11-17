<script setup>
/* Content column + right "About the journal" menu, overlapping the banner like in the design */
import AboutSidebar from './AboutSidebar.vue'
</script>

<template>
  <div class="container page-body">
    <div class="page-body__main">
      <slot />
    </div>
    <AboutSidebar class="page-body__aside" />
  </div>
</template>

<style scoped>
.page-body {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 284px;
  align-items: start;
  gap: 20px;
  margin-top: -30px;
  padding-bottom: var(--section-space);
}

.page-body__aside {
  position: sticky;
  top: calc(var(--header-h) + 20px);
}

@media (max-width: 1023.98px) {
  .page-body {
    grid-template-columns: 1fr;
  }

  /* on tablets/phones the section menu goes under the content */
  .page-body__aside {
    position: static;
  }
}
</style>
