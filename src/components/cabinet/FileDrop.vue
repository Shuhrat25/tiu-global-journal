<script setup>
/*
 * File picker with drag & drop (Figma comment #8 — "upload the file from here").
 * v-model holds the selected File (or null). Validates extension and size.
 */
import { nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  id: { type: String, default: undefined },
  accept: { type: String, default: '.doc,.docx,.pdf' },
  maxMb: { type: Number, default: 10 },
  invalid: { type: Boolean, default: false },
})

const file = defineModel({ type: Object, default: null })
const emit = defineEmits(['error'])

const { t, locale } = useI18n()
const dragging = ref(false)
const input = ref(null)

function pick(candidate) {
  if (!candidate) return
  const extensions = props.accept.split(',').map((ext) => ext.trim().toLowerCase())
  const name = candidate.name.toLowerCase()
  if (!extensions.some((ext) => name.endsWith(ext))) {
    emit('error', t('cabinet.common.file.wrongType'))
    return
  }
  if (candidate.size > props.maxMb * 1024 * 1024) {
    emit('error', t('cabinet.common.file.tooBig', { max: props.maxMb }))
    return
  }
  emit('error', '')
  file.value = candidate
}

function onDrop(event) {
  dragging.value = false
  pick(event.dataTransfer?.files?.[0])
}

/*
 * The remove button goes away with the file: the focus moves to the (new, empty) file field
 * that takes its place, so it stays in the dialog instead of falling to <body>.
 */
async function clear() {
  file.value = null
  await nextTick()
  input.value?.focus()
}

/*
 * "2,4 МБ" / "380 КБ": the units come from the texts. Uzbek and Russian write a decimal comma
 * (set here, as in i18n/dates.js: browsers have no reliable number data for Latin Uzbek).
 */
const decimal = (value) => (locale.value === 'en' ? value.toFixed(1) : value.toFixed(1).replace('.', ','))

const sizeLabel = (bytes) =>
  bytes > 1024 * 1024
    ? t('cabinet.common.file.sizeMb', { size: decimal(bytes / 1024 / 1024) })
    : t('cabinet.common.file.sizeKb', { size: Math.max(1, Math.round(bytes / 1024)) })
</script>

<template>
  <div v-if="file" class="file-picked">
    <span class="file-picked__icon"><AppIcon name="file-text" :size="22" /></span>
    <span class="file-picked__info">
      <strong>{{ file.name }}</strong>
      <span>{{ sizeLabel(file.size) }}</span>
    </span>
    <button type="button" class="file-picked__remove" :aria-label="t('cabinet.common.file.remove')" @click="clear">
      <AppIcon name="close" :size="18" />
    </button>
  </div>
  <label
    v-else
    class="drop"
    :class="{ 'is-dragging': dragging, 'has-error': invalid }"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <input
      :id="id"
      ref="input"
      class="visually-hidden"
      type="file"
      :accept="accept"
      :aria-invalid="invalid ? 'true' : undefined"
      @change="pick($event.target.files?.[0])"
    />
    <span class="drop__icon"><AppIcon name="upload" :size="24" /></span>
    <span class="drop__title">{{ t('cabinet.common.file.drop') }}</span>
    <span class="drop__hint">{{ t('cabinet.common.file.hint', { max: maxMb }) }}</span>
  </label>
</template>

<style scoped>
.drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 28px 16px;
  border: 2px dashed var(--cab-border-strong);
  border-radius: var(--cab-radius-sm);
  background: var(--cab-bg);
  text-align: center;
  cursor: pointer;
  transition:
    border-color var(--transition),
    background-color var(--transition);
}

.drop:hover,
.drop.is-dragging,
.drop:focus-within {
  border-color: var(--color-primary);
  background: #eff6ff;
}

.drop.has-error {
  border-color: var(--cab-danger);
}

.drop__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--tone-blue-bg);
  color: var(--tone-blue-fg);
}

.drop__title {
  font-size: 15px;
  font-weight: 500;
  color: var(--cab-text);
}

.drop__hint {
  font-size: 13px;
  color: var(--cab-muted);
}

/* the selected file: a long name is cut with an ellipsis, the icon and the remove button keep their size */
.file-picked {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--cab-border);
  border-radius: var(--cab-radius-sm);
  background: var(--cab-bg);
}

.file-picked__icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--tone-blue-bg);
  color: var(--tone-blue-fg);
}

.file-picked__info {
  display: grid;
  min-width: 0;
  font-size: 13px;
  color: var(--cab-muted);
}

.file-picked__info strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  font-weight: 500;
  color: var(--cab-text);
}

.file-picked__remove {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 32px;
  height: 32px;
  margin-left: auto;
  border-radius: 8px;
  color: var(--cab-muted);
}

.file-picked__remove:hover {
  background: var(--cab-border);
}
</style>
