<script setup>
import { useI18n } from 'vue-i18n'

/* Coloured chip for a reviewer recommendation or an editor decision: accept | minor | major | reject */
const TONES = { accept: 'green', minor: 'yellow', major: 'orange', reject: 'red' }

defineProps({
  verdict: { type: String, required: true },
})

const { t } = useI18n()
</script>

<template>
  <span class="chip" :class="`chip--${TONES[verdict] ?? 'gray'}`">{{ t(`cabinet.common.decisions.${verdict}`) }}</span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  line-height: 20px;
  font-weight: 500;
  white-space: nowrap;
}

.chip--green { background: var(--tone-green-bg); color: var(--tone-green-fg); }
.chip--yellow { background: var(--tone-yellow-bg); color: var(--tone-yellow-fg); }
.chip--orange { background: var(--tone-orange-bg); color: var(--tone-orange-fg); }
.chip--red { background: var(--tone-red-bg); color: var(--tone-red-fg); }
.chip--gray { background: var(--tone-gray-bg); color: var(--tone-gray-fg); }
</style>
