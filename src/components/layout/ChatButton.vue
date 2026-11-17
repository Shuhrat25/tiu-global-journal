<script setup>
import { useI18n } from 'vue-i18n'
import chatIcon from '@/assets/icons/chat.svg'

const { t } = useI18n()
</script>

<template>
  <RouterLink class="chat-button" :to="{ name: 'contact' }" :aria-label="t('chat.label')">
    <img :src="chatIcon" alt="" width="28" height="28" />
  </RouterLink>
</template>

<style scoped>
.chat-button {
  position: fixed;
  right: 50px;
  bottom: 40px;
  z-index: 40;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary-light);
  box-shadow: 0 8px 20px rgb(56 97 167 / 0.3);
  transition:
    background-color var(--transition),
    transform var(--transition);
}

.chat-button:hover {
  background: var(--color-primary);
  transform: translateY(-2px);
}

@media (max-width: 767.98px) {
  .chat-button {
    right: 16px;
    bottom: 16px;
    width: 52px;
    height: 52px;
  }
}
</style>
