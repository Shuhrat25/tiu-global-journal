<script setup>
/* Publication fee for an accepted article (Figma comment #6): amount, payment method, confirmation */
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ARTICLE_FEE, useJournalStore } from '@/stores/journal'
import { PAYMENT_METHODS } from '@/data/cabinet-seed'
import { formatAmount } from '@/utils/format'
import { focusFirstInvalid } from '@/utils/focusFirstInvalid'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import ArticleHeading from './ArticleHeading.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  /** article in the `accepted` status */
  article: { type: Object, default: null },
})

const emit = defineEmits(['close', 'paid'])

const store = useJournalStore()
const { t } = useI18n()

const method = ref('')
const attempted = ref(false)
const content = ref(null)

const fee = computed(() => t('cabinet.common.currency', { amount: formatAmount(ARTICLE_FEE) }))
const error = computed(() => (attempted.value && !method.value ? t('cabinet.common.form.chooseOption') : ''))

// every opening starts without a chosen method
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    method.value = ''
    attempted.value = false
  },
)

function pay() {
  if (!props.open) return // the dialog is fading out: a second click must not report the payment again
  attempted.value = true
  if (!method.value) {
    focusFirstInvalid(content.value)
    return
  }
  store.payForArticle(props.article.id, method.value)
  emit('paid', props.article)
}
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.author.pay.title')" size="sm" @close="emit('close')">
    <div v-if="article" ref="content" class="pay">
      <ArticleHeading :article="article" />

      <div class="pay__amount">
        <span>{{ t('cabinet.author.pay.amount') }}</span>
        <strong>{{ fee }}</strong>
      </div>

      <fieldset class="pay__methods">
        <legend class="pay__legend">
          {{ t('cabinet.author.pay.method') }}
          <span class="pay__required" aria-hidden="true">*</span>
        </legend>
        <div class="pay__options">
          <label v-for="key in PAYMENT_METHODS" :key="key" class="cab-choice">
            <input
              v-model="method"
              type="radio"
              name="pay-method"
              :value="key"
              required
              :aria-invalid="Boolean(error)"
              :aria-describedby="error ? 'pay-method-error' : undefined"
            />
            <span>{{ t(`cabinet.common.paymentMethods.${key}`) }}</span>
          </label>
        </div>
        <p v-if="error" id="pay-method-error" class="pay__error">{{ error }}</p>
      </fieldset>

      <p class="pay__note">{{ t('cabinet.author.pay.note') }}</p>
    </div>

    <template #footer>
      <CabButton variant="secondary" @click="emit('close')">{{ t('cabinet.common.actions.cancel') }}</CabButton>
      <CabButton variant="success" icon="credit-card" @click="pay">{{ t('cabinet.author.pay.submit', { amount: fee }) }}</CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.pay {
  display: grid;
  gap: 20px;
}

.pay__amount {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px 16px;
  padding: 16px 20px;
  border-radius: var(--cab-radius-sm);
  background: #eff6ff;
  font-size: 15px;
  color: var(--cab-subtle);
}

.pay__amount strong {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
}

.pay__methods {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.pay__legend {
  padding: 0 0 8px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--cab-text-2);
}

.pay__required {
  color: var(--cab-danger);
}

.pay__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.pay__error {
  margin-top: 8px;
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-danger);
}

.pay__note {
  font-size: 14px;
  line-height: 20px;
  color: var(--cab-muted);
}

@media (max-width: 479.98px) {
  .pay__options {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
