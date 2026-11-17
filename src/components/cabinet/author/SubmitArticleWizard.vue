<script setup>
/*
 * "Yangi maqola yuborish" wizard (Figma, steps 1–2 + comment #8):
 * basic info → article details → file upload, summary and confirmation.
 * A step is validated before the next one opens. Closing the dialog keeps the draft;
 * after a successful submission the form starts empty the next time it is opened.
 */
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { I18nT, useI18n } from 'vue-i18n'
import { useJournalStore } from '@/stores/journal'
import { focusFirstInvalid } from '@/utils/focusFirstInvalid'
import CabModal from '@/components/cabinet/CabModal.vue'
import CabStepper from '@/components/cabinet/CabStepper.vue'
import CabField from '@/components/cabinet/CabField.vue'
import CabButton from '@/components/cabinet/CabButton.vue'
import FileDrop from '@/components/cabinet/FileDrop.vue'
import ArticleInfo from './ArticleInfo.vue'

const ABSTRACT_MAX_WORDS = 50 // journal requirements: "аннотация (50 тагача сўз)"
const STEP_FIELDS = [['title', 'authors'], ['abstract', 'keywords', 'conflict'], ['file', 'agree']]
const FORM_ID = 'submit-article-form'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submitted'])

const store = useJournalStore()
const { t } = useI18n()

const emptyForm = () => ({ title: '', authors: '', abstract: '', keywords: '', conflict: '', file: null, agree: false })
const form = reactive(emptyForm())
const step = ref(0)
const checkedSteps = ref([false, false, false]) // errors of a step are shown once the user tried to leave it
const fileError = ref('') // wrong type / too big, reported by FileDrop right away
const formEl = ref(null) // holds only the current step
let submitted = false // set by a successful submission: the next opening starts with an empty form

const steps = computed(() => [
  t('cabinet.author.wizard.steps.basics'),
  t('cabinet.author.wizard.steps.details'),
  t('cabinet.author.wizard.steps.upload'),
])
const isLastStep = computed(() => step.value === STEP_FIELDS.length - 1)
const abstractWords = computed(() => form.abstract.trim().split(/\s+/).filter(Boolean).length)

const required = (value) => (value.trim() ? '' : t('cabinet.common.form.required'))

const errors = computed(() => ({
  title: required(form.title),
  authors: required(form.authors),
  abstract:
    required(form.abstract) ||
    (abstractWords.value > ABSTRACT_MAX_WORDS
      ? t('cabinet.author.wizard.abstractTooLong', { max: ABSTRACT_MAX_WORDS, count: abstractWords.value })
      : ''),
  keywords: required(form.keywords),
  conflict: required(form.conflict),
  file: form.file ? '' : t('cabinet.author.wizard.fileRequired'),
  agree: form.agree ? '' : t('cabinet.author.wizard.agreeRequired'),
}))

/* the errors on screen: a step's once the user tried to leave it, a rejected file right away */
const shownErrors = computed(() => {
  const shown = {}
  STEP_FIELDS.forEach((fields, index) => {
    for (const field of fields) shown[field] = checkedSteps.value[index] ? errors.value[field] : ''
  })
  if (fileError.value) shown.file = fileError.value
  return shown
})

/* shows the errors of the current step; if there are any, the focus goes to the first field to fix */
function validateStep() {
  checkedSteps.value[step.value] = true
  const valid = STEP_FIELDS[step.value].every((field) => !shownErrors.value[field])
  if (!valid) focusFirstInvalid(formEl.value)
  return valid
}

/* opens a step and focuses its first control once it is rendered */
async function goToStep(index) {
  step.value = index
  await nextTick()
  formEl.value?.querySelector('input, textarea, button')?.focus()
}

function onSubmit() {
  // the dialog stays on screen while it fades out: a second click must not submit the article again
  if (!props.open || submitted) return
  if (!validateStep()) return
  if (!isLastStep.value) {
    goToStep(step.value + 1)
    return
  }
  const article = store.submitArticle({
    title: form.title.trim(),
    authors: form.authors.trim(),
    abstract: form.abstract.trim(),
    keywords: form.keywords.trim(),
    conflict: form.conflict.trim(),
    fileName: form.file.name,
  })
  // the form is cleared on the next opening, so the closing animation still shows the submitted data
  submitted = true
  emit('submitted', article)
}

function reset() {
  Object.assign(form, emptyForm())
  step.value = 0
  checkedSteps.value = [false, false, false]
  fileError.value = ''
  submitted = false
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && submitted) reset()
  },
)
</script>

<template>
  <CabModal :open="open" :title="t('cabinet.author.wizard.title')" size="lg" @close="emit('close')">
    <CabStepper :steps="steps" :current="step" />

    <form :id="FORM_ID" ref="formEl" novalidate @submit.prevent="onSubmit">
      <!-- step 1: basic information -->
      <div v-if="step === 0" class="wizard__step">
        <CabField id="submit-title" :label="t('cabinet.author.wizard.titleLabel')" required :error="shownErrors.title">
          <input
            id="submit-title"
            v-model="form.title"
            class="cab-input"
            :class="{ 'has-error': shownErrors.title }"
            type="text"
            required
            :placeholder="t('cabinet.author.wizard.titlePlaceholder')"
          />
        </CabField>
        <CabField id="submit-authors" :label="t('cabinet.author.wizard.authorsLabel')" required :error="shownErrors.authors">
          <input
            id="submit-authors"
            v-model="form.authors"
            class="cab-input"
            :class="{ 'has-error': shownErrors.authors }"
            type="text"
            required
            :placeholder="t('cabinet.author.wizard.authorsPlaceholder')"
          />
        </CabField>
      </div>

      <!-- step 2: article details -->
      <div v-else-if="step === 1" class="wizard__step">
        <CabField
          id="submit-abstract"
          :label="t('cabinet.author.wizard.abstractLabel')"
          required
          :error="shownErrors.abstract"
          :hint="t('cabinet.author.wizard.abstractHint', { max: ABSTRACT_MAX_WORDS, count: abstractWords })"
        >
          <textarea
            id="submit-abstract"
            v-model="form.abstract"
            class="cab-textarea"
            :class="{ 'has-error': shownErrors.abstract }"
            rows="6"
            required
            :placeholder="t('cabinet.author.wizard.abstractPlaceholder')"
          />
        </CabField>
        <CabField id="submit-keywords" :label="t('cabinet.author.wizard.keywordsLabel')" required :error="shownErrors.keywords">
          <input
            id="submit-keywords"
            v-model="form.keywords"
            class="cab-input"
            :class="{ 'has-error': shownErrors.keywords }"
            type="text"
            required
            :placeholder="t('cabinet.author.wizard.keywordsPlaceholder')"
          />
        </CabField>
        <CabField id="submit-conflict" :label="t('cabinet.author.wizard.conflictLabel')" required :error="shownErrors.conflict">
          <textarea
            id="submit-conflict"
            v-model="form.conflict"
            class="cab-textarea"
            :class="{ 'has-error': shownErrors.conflict }"
            rows="4"
            required
            :placeholder="t('cabinet.author.wizard.conflictPlaceholder')"
          />
        </CabField>
      </div>

      <!-- step 3: file, summary and confirmation -->
      <div v-else class="wizard__upload">
        <div class="wizard__step">
          <CabField id="submit-file" :label="t('cabinet.author.wizard.fileLabel')" required :error="shownErrors.file">
            <FileDrop id="submit-file" v-model="form.file" :invalid="Boolean(shownErrors.file)" @error="fileError = $event" />
          </CabField>

          <div class="wizard__agree">
            <label class="cab-check" for="submit-agree">
              <input
                id="submit-agree"
                v-model="form.agree"
                type="checkbox"
                required
                :aria-invalid="Boolean(shownErrors.agree)"
                :aria-describedby="shownErrors.agree ? 'submit-agree-error' : undefined"
              />
              <I18nT keypath="cabinet.author.wizard.agree" tag="span" scope="global">
                <template #requirements>
                  <RouterLink :to="{ name: 'requirements' }" class="wizard__link" target="_blank" rel="noopener">
                    {{ t('cabinet.author.wizard.requirements') }}<span class="visually-hidden"> ({{ t('cabinet.author.wizard.newTab') }})</span>
                  </RouterLink>
                </template>
              </I18nT>
            </label>
            <p v-if="shownErrors.agree" id="submit-agree-error" class="wizard__error">{{ shownErrors.agree }}</p>
          </div>
        </div>

        <section class="wizard__summary" aria-labelledby="submit-summary-title">
          <h3 id="submit-summary-title" class="wizard__summary-title">{{ t('cabinet.author.wizard.summary') }}</h3>
          <ArticleInfo :article="form" :fields="['title', 'authors', 'keywords', 'abstract', 'conflict']" />
        </section>
      </div>
    </form>

    <template #footer>
      <CabButton v-if="step > 0" class="wizard__back" variant="outline" @click="goToStep(step - 1)">
        {{ t('cabinet.common.actions.back') }}
      </CabButton>
      <CabButton v-if="isLastStep" type="submit" :form="FORM_ID" icon="send">{{ t('cabinet.author.wizard.submit') }}</CabButton>
      <CabButton v-else type="submit" :form="FORM_ID">{{ t('cabinet.common.actions.next') }}</CabButton>
    </template>
  </CabModal>
</template>

<style scoped>
.wizard__step {
  display: grid;
  gap: 20px;
  align-content: start;
}

/* step 3: upload + confirmation on the left, summary on the right */
.wizard__upload {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.wizard__agree {
  display: grid;
  gap: 6px;
}

.wizard__link {
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.wizard__link:hover {
  color: var(--color-primary-dark);
}

.wizard__error {
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-danger);
}

.wizard__summary {
  padding: 20px;
  border: 1px solid var(--cab-border);
  border-radius: var(--cab-radius-sm);
  background: var(--cab-bg);
}

.wizard__summary-title {
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: var(--cab-text);
}

.wizard__back {
  margin-right: auto;
}

@media (max-width: 899.98px) {
  .wizard__upload {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 767.98px) {
  .wizard__summary {
    padding: 16px;
  }
}
</style>
