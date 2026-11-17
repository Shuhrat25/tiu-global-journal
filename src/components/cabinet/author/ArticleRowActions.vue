<script setup>
/* Buttons of a "Мақолаларим" row: what the author can do with the article in its current status */
import { useI18n } from 'vue-i18n'
import CabButton from '@/components/cabinet/CabButton.vue'

defineProps({
  article: { type: Object, required: true },
  /** id of the element with the article title, announced together with the button */
  describedBy: { type: String, default: undefined },
})

defineEmits(['comments', 'pay', 'details'])

const { t } = useI18n()
</script>

<template>
  <div class="actions">
    <template v-if="article.status === 'revision'">
      <CabButton variant="soft" size="sm" icon="upload" :aria-describedby="describedBy" @click="$emit('comments')">
        {{ t('cabinet.author.actions.uploadRevision') }}
      </CabButton>
      <CabButton variant="secondary" size="sm" icon="message-square" :aria-describedby="describedBy" @click="$emit('comments')">
        {{ t('cabinet.author.actions.viewComments') }}
      </CabButton>
    </template>
    <CabButton
      v-else-if="article.status === 'accepted'"
      variant="success"
      size="sm"
      icon="credit-card"
      :aria-describedby="describedBy"
      @click="$emit('pay')"
    >
      {{ t('cabinet.author.actions.pay') }}
    </CabButton>
    <CabButton v-else variant="secondary" size="sm" icon="eye" :aria-describedby="describedBy" @click="$emit('details')">
      {{ t('cabinet.common.actions.details') }}
    </CabButton>
  </div>
</template>

<style scoped>
/* the table column shrinks to the widest button, so two actions stack; they get the same width */
.actions {
  display: grid;
  gap: 8px;
  width: fit-content;
}
</style>
