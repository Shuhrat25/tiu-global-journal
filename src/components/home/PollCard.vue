<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { pollOptions } from '@/data/home'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
const selected = ref(null)
</script>

<template>
  <div class="poll">
    <h2 class="poll__heading">{{ t('poll.heading') }}</h2>

    <fieldset class="poll__card">
      <legend class="poll__question">{{ t('poll.question') }}</legend>
      <p class="poll__description">{{ t('poll.description') }}</p>

      <div class="poll__options">
        <label
          v-for="option in pollOptions"
          :key="option"
          class="poll__option"
          :class="{ 'is-selected': selected === option }"
        >
          <input v-model="selected" class="visually-hidden" type="radio" name="poll" :value="option" />
          <span class="poll__radio" aria-hidden="true" />
          {{ t(`poll.options.${option}`) }}
        </label>
      </div>
    </fieldset>

    <BaseButton class="poll__more" variant="secondary" href="#" block>{{ t('poll.all') }}</BaseButton>
  </div>
</template>

<style scoped>
.poll {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 23px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
}

.poll__heading {
  font-size: 28px;
  line-height: 32px;
  font-weight: 600;
  color: var(--color-heading);
}

.poll__card {
  flex: 1;
  min-width: 0;
  margin: 20px 0 0;
  padding: 19px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

/* <legend> doesn't take margins/padding nicely in all browsers — reset it */
.poll__question {
  float: left;
  width: 100%;
  padding: 0;
  font-size: 20px;
  line-height: 1.3;
  font-weight: 500;
  color: var(--color-text-black);
}

.poll__description {
  clear: both;
  padding-top: 8px;
  font-size: 18px;
  line-height: 1.3;
  color: var(--color-text-black-2);
}

.poll__options {
  display: grid;
  gap: 13px;
  margin-top: 16px;
}

.poll__option {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 50px;
  padding: 0 13px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
  font-size: 18px;
  line-height: 1.3;
  font-weight: 500;
  color: var(--color-text-black);
  cursor: pointer;
  transition:
    border-color var(--transition),
    background-color var(--transition);
}

.poll__option:hover {
  border-color: var(--color-primary-light);
}

.poll__option.is-selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.poll__option:focus-within {
  outline: 2px solid var(--color-primary-bright);
  outline-offset: 2px;
}

.poll__radio {
  position: relative;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: 2px solid var(--color-border-soft);
  border-radius: 50%;
  background: var(--color-white);
  transition: border-color var(--transition);
}

.poll__option.is-selected .poll__radio {
  border-color: var(--color-primary);
}

.poll__option.is-selected .poll__radio::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: var(--color-primary);
}

.poll__more {
  margin-top: 16px;
}

@media (max-width: 639.98px) {
  .poll {
    padding: 20px 16px;
  }

  .poll__heading {
    font-size: 24px;
  }

  .poll__question {
    font-size: 18px;
  }

  .poll__description,
  .poll__option {
    font-size: 16px;
  }
}
</style>
