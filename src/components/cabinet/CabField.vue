<script setup>
/*
 * Label + control + error/hint. Put the control in the default slot and give it
 * the same id:  <CabField id="title" :label="..." required :error="..."><input id="title" class="cab-input" /></CabField>
 *
 * The hint and the error get the ids `<id>-hint` and `<id>-error`. CabField links the one on screen to the
 * control with the field's id (aria-describedby) and marks that control aria-invalid while there is an error,
 * so a screen reader reads them together with the field. The error is not an alert (a failed form would
 * fire one per field): the form moves the focus to its first invalid field, which reads its error.
 * A control can also bind them itself (slot props):
 *   <CabField :label="..." :hint="..." :error="..." v-slot="{ id, describedBy, invalid }">
 *     <textarea :id="id" class="cab-textarea" :aria-describedby="describedBy" :aria-invalid="invalid" />
 *   </CabField>
 */
import { computed, onActivated, onMounted, onUpdated, ref, useId } from 'vue'

const props = defineProps({
  id: { type: String, default: undefined },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
})

const fallbackId = `field-${useId()}`
const controlId = computed(() => props.id || fallbackId)
const hintId = computed(() => `${controlId.value}-hint`)
const errorId = computed(() => `${controlId.value}-error`)
const describedBy = computed(() => (props.error ? errorId.value : props.hint ? hintId.value : undefined))
const invalid = computed(() => Boolean(props.error))

const root = ref(null)
let linked = null // what CabField itself added to its control: { el, token, invalid }

const splitIds = (value) => (value ?? '').split(/\s+/).filter(Boolean)

function setAttribute(el, name, value) {
  if (!value) el.removeAttribute(name)
  else if (el.getAttribute(name) !== value) el.setAttribute(name, value)
}

function unlink() {
  const { el, token, invalid: addedInvalid } = linked
  linked = null
  if (token) setAttribute(el, 'aria-describedby', splitIds(el.getAttribute('aria-describedby')).filter((id) => id !== token).join(' '))
  if (addedInvalid && el.getAttribute('aria-invalid') === 'true') el.removeAttribute('aria-invalid')
}

/* runs after every render: the slot content (and so the control's own attributes) may have changed */
function link() {
  const el = root.value?.querySelector(`#${CSS.escape(controlId.value)}`) ?? null
  if (linked && linked.el !== el) unlink()
  if (!el) return

  // aria-describedby: ids the control has from its own template stay, the hint/error id is added
  const token = describedBy.value
  const ours = [linked?.token, hintId.value, errorId.value]
  const ids = splitIds(el.getAttribute('aria-describedby')).filter((id) => !ours.includes(id))
  if (token) ids.push(token)
  setAttribute(el, 'aria-describedby', ids.join(' '))

  // aria-invalid: set while there is an error, unless the control's template already says so
  let addedInvalid = linked?.invalid ?? false
  if (invalid.value && el.getAttribute('aria-invalid') !== 'true') {
    el.setAttribute('aria-invalid', 'true')
    addedInvalid = true
  } else if (!invalid.value && addedInvalid) {
    if (el.getAttribute('aria-invalid') === 'true') el.removeAttribute('aria-invalid')
    addedInvalid = false
  }
  linked = { el, token, invalid: addedInvalid }
}

onMounted(link)
onUpdated(link)
onActivated(link)
</script>

<template>
  <div ref="root" class="field">
    <label class="field__label" :for="controlId">
      {{ label }}
      <span v-if="required" class="field__required" aria-hidden="true">*</span>
    </label>
    <slot :id="controlId" :describedBy="describedBy" :invalid="invalid" />
    <p v-if="error" :id="errorId" class="field__error">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.field {
  display: grid;
  gap: 8px;
}

.field__label {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--cab-text-2);
}

.field__required {
  color: var(--cab-danger);
}

.field__error {
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-danger);
}

.field__hint {
  font-size: 13px;
  line-height: 18px;
  color: var(--cab-muted);
}
</style>
