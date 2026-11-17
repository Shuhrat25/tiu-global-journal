<script setup>
import { useI18n } from 'vue-i18n'
import { partners } from '@/data/home'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LogoBox from '@/components/ui/LogoBox.vue'

const { t } = useI18n()
</script>

<template>
  <section class="section--soft" aria-labelledby="partners-title">
    <div class="container">
      <SectionHeader id="partners-title" :title="t('partners.title')" :subtitle="t('partners.subtitle')" />

      <ul class="partners">
        <li v-for="partner in partners" :key="partner.name" class="partner">
          <LogoBox :src="partner.logo" :alt="partner.name" :box="partner.box" ratio="206 / 136" />
        </li>
      </ul>

      <div class="section__actions">
        <BaseButton href="#contact">{{ t('partners.cta') }}</BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.partners {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 24px;
}

.partner {
  padding: 11px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    border-color var(--transition),
    box-shadow var(--transition);
}

.partner:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-card);
}

@media (max-width: 1023.98px) {
  .partners {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (max-width: 559.98px) {
  .partners {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
</style>
