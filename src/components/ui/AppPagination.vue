<script setup>
// Простая пагинация: «Назад», номера страниц, «Вперёд»
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  page: { type: Number, required: true }, // текущая страница (с 1)
  total: { type: Number, required: true }, // сколько всего записей
  perPage: { type: Number, required: true }, // сколько записей на одной странице
})

const emit = defineEmits(['change'])

const { t } = useI18n()

const pagesCount = computed(() => Math.ceil(props.total / props.perPage))
</script>

<template>
  <nav v-if="pagesCount > 1" class="pagination">
    <button type="button" class="pagination__btn" :disabled="page === 1" @click="emit('change', page - 1)">
      {{ t('pages.prev') }}
    </button>

    <button
      v-for="number in pagesCount"
      :key="number"
      type="button"
      class="pagination__btn"
      :class="{ 'is-active': number === page }"
      @click="emit('change', number)"
    >
      {{ number }}
    </button>

    <button type="button" class="pagination__btn" :disabled="page === pagesCount" @click="emit('change', page + 1)">
      {{ t('pages.next') }}
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.pagination__btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-white);
  color: var(--color-heading);
}

.pagination__btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination__btn.is-active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
