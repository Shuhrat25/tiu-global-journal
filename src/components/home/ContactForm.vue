<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import { sendFeedback } from '@/api/home'
import { focusFirstInvalid } from '@/utils/focusFirstInvalid'
import folderIcon from '@/assets/icons/folder.svg'

const props = defineProps({
  /** the "attach a file" field is shown on the home page, not on the contact page */
  withFile: { type: Boolean, default: true },
  /** id of the heading, used by the parent section for aria-labelledby */
  titleId: { type: String, default: 'contact-title' },
})

const MAX_FILE_MB = 10
const { t } = useI18n()

const form = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
  file: null,
})

// Error *keys* (contactForm.errors.<key>) — the text is resolved in the template,
// so messages switch language together with the rest of the page.
const errors = reactive({})
const dragging = ref(false)
const sent = ref(false)
const sending = ref(false) // пока идёт отправка, кнопка выключена
const sendError = ref(false)
const formEl = ref(null)
const fileInput = ref(null)

const errorId = (field) => `${props.titleId}-${field}-error`
/* while a field has an error, its control is marked invalid and described by the error text */
const errorAttrs = (field) => (errors[field] ? { 'aria-invalid': 'true', 'aria-describedby': errorId(field) } : {})

/* "901234567" -> "90 123 45 67"; a pasted "+998 90 123 45 67" loses its country code */
function formatPhone(value) {
  let digits = value.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('998')) digits = digits.slice(3)
  digits = digits.slice(0, 9)
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)]
  return parts.filter(Boolean).join(' ')
}

function onPhoneInput(event) {
  form.phone = formatPhone(event.target.value)
  // when the formatted number has not changed (a 10th digit, a letter), Vue does not re-render:
  // the field is corrected here, so it always shows what will be sent
  event.target.value = form.phone
}

function setFile(file) {
  if (!file) return
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    clearFile() // a file that is too big is not attached (nor kept from before); the message explains why
    errors.file = 'fileSize'
    return
  }
  errors.file = ''
  form.file = file
}

function onFileChange(event) {
  setFile(event.target.files?.[0])
}

function onDrop(event) {
  dragging.value = false
  setFile(event.dataTransfer?.files?.[0])
}

/* The native input is emptied too: it keeps its FileList, and choosing the same file again would fire no `change` */
function clearFile() {
  form.file = null
  errors.file = ''
  if (fileInput.value) fileInput.value.value = ''
}

function removeFile() {
  clearFile()
  fileInput.value?.focus() // the focused × button is gone with the file
}

function validate() {
  errors.name = form.name.trim() ? '' : 'name'
  errors.phone = form.phone.replace(/\D/g, '').length === 9 ? '' : 'phone'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'email'
  errors.message = form.message.trim() ? '' : 'message'
  // the file is optional and a rejected one is never attached, so a file error does not block sending
  return !errors.name && !errors.phone && !errors.email && !errors.message
}

async function onSubmit() {
  sent.value = false
  sendError.value = false
  if (!validate()) {
    focusFirstInvalid(formEl.value)
    return
  }

  // поля называются так, как их ждёт API
  const formData = new FormData()
  formData.append('fio', form.name.trim())
  formData.append('phone', '+998' + form.phone.replace(/\s/g, '')) // "90 123 45 67" → "+998901234567"
  formData.append('email', form.email.trim())
  formData.append('message', form.message.trim())
  if (form.file) formData.append('file', form.file)

  sending.value = true
  try {
    await sendFeedback(formData)
    sent.value = true
    Object.assign(form, { name: '', phone: '', email: '', message: '' })
    clearFile()
  } catch (error) {
    console.error('Не удалось отправить вопрос', error)
    sendError.value = true
  }
  sending.value = false
}

const errorText = (key) => t(`contactForm.errors.${key}`, { max: MAX_FILE_MB })
</script>

<template>
  <form ref="formEl" class="contact-form" novalidate @submit.prevent="onSubmit">
    <h2 :id="titleId" class="contact-form__title">{{ t('contactForm.title') }}</h2>
    <p class="contact-form__subtitle">{{ t('contactForm.subtitle') }}</p>

    <div class="contact-form__fields">
      <div class="field field--full">
        <label class="field__label" :for="`${titleId}-name`">{{ t('contactForm.name') }}</label>
        <input
          :id="`${titleId}-name`"
          v-model="form.name"
          class="field__control"
          :class="{ 'has-error': errors.name }"
          type="text"
          name="name"
          autocomplete="name"
          :placeholder="t('contactForm.namePlaceholder')"
          v-bind="errorAttrs('name')"
        />
        <span v-if="errors.name" :id="errorId('name')" class="field__error">{{ errorText(errors.name) }}</span>
      </div>

      <div class="field">
        <label class="field__label" :for="`${titleId}-phone`">{{ t('contactForm.phone') }}</label>
        <div class="field__control field__control--phone" :class="{ 'has-error': errors.phone }">
          <span class="field__prefix">+998</span>
          <input
            :id="`${titleId}-phone`"
            :value="form.phone"
            type="tel"
            name="phone"
            inputmode="numeric"
            autocomplete="tel-national"
            placeholder="-- --- -- --"
            v-bind="errorAttrs('phone')"
            @input="onPhoneInput"
          />
        </div>
        <span v-if="errors.phone" :id="errorId('phone')" class="field__error">{{ errorText(errors.phone) }}</span>
      </div>

      <div class="field">
        <label class="field__label" :for="`${titleId}-email`">{{ t('contactForm.email') }}</label>
        <input
          :id="`${titleId}-email`"
          v-model.trim="form.email"
          class="field__control"
          :class="{ 'has-error': errors.email }"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="example@email.com"
          v-bind="errorAttrs('email')"
        />
        <span v-if="errors.email" :id="errorId('email')" class="field__error">{{ errorText(errors.email) }}</span>
      </div>

      <div class="field field--full">
        <label class="field__label" :for="`${titleId}-message`">{{ t('contactForm.message') }}</label>
        <textarea
          :id="`${titleId}-message`"
          v-model="form.message"
          class="field__control field__control--textarea"
          :class="{ 'has-error': errors.message }"
          name="message"
          rows="3"
          :placeholder="t('contactForm.messagePlaceholder')"
          v-bind="errorAttrs('message')"
        />
        <span v-if="errors.message" :id="errorId('message')" class="field__error">{{ errorText(errors.message) }}</span>
      </div>

      <div v-if="withFile" class="field field--full">
        <span class="field__label">{{ t('contactForm.file') }}</span>
        <label
          class="dropzone"
          :class="{ 'is-dragging': dragging, 'has-file': form.file }"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="onDrop"
        >
          <input
            ref="fileInput"
            class="visually-hidden"
            type="file"
            name="file"
            v-bind="errorAttrs('file')"
            @change="onFileChange"
          />
          <img :src="folderIcon" alt="" width="24" height="24" />
          <span class="dropzone__text">{{ form.file ? form.file.name : t('contactForm.filePlaceholder') }}</span>
          <button
            v-if="form.file"
            type="button"
            class="dropzone__remove"
            :aria-label="t('contactForm.removeFile')"
            @click.prevent="removeFile"
          >
            ×
          </button>
        </label>
        <span v-if="errors.file" :id="errorId('file')" class="field__error">{{ errorText(errors.file) }}</span>
      </div>
    </div>

    <div class="contact-form__footer">
      <BaseButton type="submit" :disabled="sending">{{ t('contactForm.submit') }}</BaseButton>
      <p v-if="sent" class="contact-form__success" role="status">{{ t('contactForm.success') }}</p>
      <p v-if="sendError" class="contact-form__send-error" role="alert">{{ t('contactForm.sendError') }}</p>
    </div>
  </form>
</template>

<style scoped>
.contact-form {
  height: 100%;
  padding: 23px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
}

.contact-form__title {
  font-size: clamp(26px, 2.6vw + 12px, 36px);
  line-height: 1.12;
  font-weight: 600;
  color: var(--color-heading);
}

.contact-form__subtitle {
  margin-top: 8px;
  font-size: 18px;
  line-height: 28px;
  color: var(--color-text);
}

.contact-form__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.field--full {
  grid-column: 1 / -1;
}

.field__label {
  font-size: 18px;
  line-height: 20px;
  font-weight: 500;
  color: #080e1b;
}

.field__control {
  width: 100%;
  height: 50px;
  padding: 0 13px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: 18px;
  color: #080e1b;
  outline: none;
  transition:
    border-color var(--transition),
    box-shadow var(--transition);
}

.field__control::placeholder,
.field__control--phone input::placeholder {
  color: var(--color-placeholder);
}

.field__control:focus,
.field__control:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgb(56 97 167 / 0.12);
}

.field__control.has-error {
  border-color: #e5484d;
}

.field__control--textarea {
  height: 100px;
  padding-block: 13px;
  resize: vertical;
}

.field__control--phone {
  display: flex;
  align-items: center;
  gap: 6px;
}

.field__prefix {
  flex-shrink: 0;
}

.field__control--phone input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: none;
  background: transparent;
}

.field__error {
  font-size: 14px;
  line-height: 18px;
  color: #e5484d;
}

.dropzone {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 13px;
  background: var(--color-bg-file);
  border: 1px dashed var(--color-text-muted);
  border-radius: var(--radius-lg);
  font-size: 18px;
  color: #6d7589;
  cursor: pointer;
  transition:
    border-color var(--transition),
    background-color var(--transition);
}

.dropzone:hover,
.dropzone.is-dragging,
.dropzone:focus-within {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.dropzone.has-file {
  color: var(--color-heading);
}

.dropzone__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropzone__remove {
  margin-left: auto;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 1;
  color: var(--color-text-muted);
}

.dropzone__remove:hover {
  background: var(--color-white);
  color: var(--color-heading);
}

.contact-form__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 20px;
}

.contact-form__success {
  font-size: 15px;
  color: #1a7f4b;
}

.contact-form__send-error {
  font-size: 15px;
  color: #e5484d;
}

@media (max-width: 639.98px) {
  .contact-form {
    padding: 20px 16px;
  }

  .contact-form__subtitle {
    font-size: 16px;
    line-height: 24px;
  }

  .contact-form__fields {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .field__label {
    font-size: 16px;
  }

  .field__control,
  .dropzone {
    font-size: 16px;
  }

  .contact-form__footer :deep(.btn) {
    width: 100%;
  }
}
</style>
