<script setup>
/*
 * "Actions" cell of the "My reviews" table — depends on the review status:
 *   invited → accept / decline · accepted → download + write the review
 *   submitted → view the review · declined → the reason, as plain text
 * `describedby` is the id of the row's title, so screen readers hear which article a button is for.
 */
import { useI18n } from 'vue-i18n'
import CabButton from '@/components/cabinet/CabButton.vue'
import ArticleDownloadButton from './ArticleDownloadButton.vue'

defineProps({
  review: { type: Object, required: true },
  article: { type: Object, required: true },
  describedby: { type: String, default: undefined },
})

defineEmits(['accept', 'decline', 'write', 'view'])

const { t } = useI18n()
</script>

<template>
  <div class="row-actions">
    <template v-if="review.status === 'invited'">
      <CabButton variant="success" size="sm" icon="check" :aria-describedby="describedby" @click="$emit('accept')">
        {{ t('cabinet.reviewer.invitations.accept') }}
      </CabButton>
      <CabButton variant="danger-outline" size="sm" icon="close" :aria-describedby="describedby" @click="$emit('decline')">
        {{ t('cabinet.reviewer.invitations.decline') }}
      </CabButton>
    </template>

    <template v-else-if="review.status === 'accepted'">
      <ArticleDownloadButton :article="article" variant="secondary" size="sm" :aria-describedby="describedby">
        {{ t('cabinet.common.actions.download') }}
      </ArticleDownloadButton>
      <CabButton variant="soft" size="sm" icon="file-text" :aria-describedby="describedby" @click="$emit('write')">
        {{ t('cabinet.reviewer.reviews.write') }}
      </CabButton>
    </template>

    <CabButton
      v-else-if="review.status === 'submitted'"
      variant="secondary"
      size="sm"
      icon="eye"
      :aria-describedby="describedby"
      @click="$emit('view')"
    >
      {{ t('cabinet.reviewer.reviews.view') }}
    </CabButton>

    <span v-else-if="review.declineReason" class="row-actions__note">
      {{ t(`cabinet.common.declineReasons.${review.declineReason}`) }}
    </span>
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
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-muted);
}

/* wide screens have room for the buttons side by side (as in Figma); narrower ones stack them */
@media (min-width: 1400px) {
  .row-actions {
    flex-wrap: nowrap;
  }
}
</style>
