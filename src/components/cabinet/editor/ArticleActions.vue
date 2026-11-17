<script setup>
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import CabButton from '@/components/cabinet/CabButton.vue'

/* Row actions of the editor's article table — what can be done depends on the article status */
defineProps({
  article: { type: Object, required: true },
  /** id of the element with the article title: gives the buttons their row context for screen readers */
  describedBy: { type: String, default: undefined },
})

defineEmits(['check', 'results', 'decide', 'publish', 'details'])

const { t } = useI18n()
</script>

<template>
  <!-- labels sit in their own span so that they can wrap inside the narrow phone cards -->
  <div class="row-actions">
    <CabButton v-if="article.status === 'submitted'" size="sm" icon="eye" :aria-describedby="describedBy" @click="$emit('check')">
      <span class="row-actions__label">{{ t('cabinet.editor.actions.check') }}</span>
    </CabButton>

    <template v-else-if="article.status === 'reviewed'">
      <CabButton size="sm" variant="soft" icon="clipboard-check" :aria-describedby="describedBy" @click="$emit('results')">
        <span class="row-actions__label">{{ t('cabinet.editor.actions.results') }}</span>
      </CabButton>
      <CabButton size="sm" icon="check-circle" :aria-describedby="describedBy" @click="$emit('decide')">
        <span class="row-actions__label">{{ t('cabinet.editor.actions.decide') }}</span>
      </CabButton>
    </template>

    <CabButton
      v-else-if="article.status === 'paid'"
      size="sm"
      variant="success"
      icon="book-check"
      :aria-describedby="describedBy"
      @click="$emit('publish')"
    >
      <span class="row-actions__label">{{ t('cabinet.editor.actions.publish') }}</span>
    </CabButton>

    <span v-else-if="article.status === 'accepted'" class="row-actions__note">
      <AppIcon name="clock" :size="16" />
      {{ t('cabinet.editor.actions.awaitingPayment') }}
    </span>

    <CabButton v-else size="sm" variant="secondary" icon="file-text" :aria-describedby="describedBy" @click="$emit('details')">
      <span class="row-actions__label">{{ t('cabinet.common.actions.details') }}</span>
    </CabButton>
  </div>
</template>

<style scoped>
.row-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.row-actions__note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-muted);
  white-space: nowrap;
}

@media (max-width: 767.98px) {
  .row-actions__label,
  .row-actions__note {
    white-space: normal;
  }
}
</style>
