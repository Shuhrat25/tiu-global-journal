<script setup>
import { useI18n } from 'vue-i18n'
import { heroStats, latestIssue } from '@/data/home'
import { SUBMIT_ROUTE } from '@/data/site'
import { formatMonthYear } from '@/i18n/dates'
import sendIcon from '@/assets/icons/send-blue.svg'

const { t, locale } = useI18n()
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero__inner">
      <h1 id="hero-title" class="hero__title">{{ t('hero.title') }}</h1>
      <p class="hero__subtitle">{{ t('hero.subtitle') }}</p>

      <div class="issue">
        <div class="issue__row">
          <div class="issue__badge">
            <span class="issue__badge-label">{{ t('hero.issueLabel') }}</span>
            <span class="issue__badge-number">
              {{ t('hero.issueNumber', { number: latestIssue.number, year: latestIssue.year }) }}
            </span>
          </div>
          <span class="issue__divider" aria-hidden="true" />
          <div class="issue__date">
            <span class="issue__date-label">{{ t('hero.dateLabel') }}</span>
            <time class="issue__date-value" :datetime="latestIssue.published">
              {{ formatMonthYear(latestIssue.published, locale) }}
            </time>
          </div>
        </div>
        <RouterLink class="issue__cta" :to="SUBMIT_ROUTE">
          <img :src="sendIcon" alt="" width="20" height="20" />
          {{ t('hero.cta') }}
        </RouterLink>
      </div>

      <ul class="stats">
        <li v-for="stat in heroStats" :key="stat.key" class="stats__item">
          <span class="stats__value">{{ stat.value }}</span>
          <span class="stats__label">{{ t(`hero.stats.${stat.key}`) }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--color-white);
}

.hero__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: 75px 80px;
  text-align: center;
}

.hero__title {
  font-size: clamp(28px, 2.4vw + 14px, 48px);
  line-height: 1.15;
  font-weight: 500;
  text-wrap: balance;
}

.hero__subtitle {
  max-width: 896px;
  margin-top: 29px;
  font-size: clamp(16px, 0.5vw + 13px, 20px);
  line-height: 1.4;
  color: var(--color-text-hero);
}

/* Latest issue card */
.issue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 672px;
  margin-top: 32px;
  padding: 24px;
  background: rgb(255 255 255 / 0.1);
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: var(--radius-md);
}

.issue__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.issue__badge {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 213px;
  padding: 12px 24px;
  border-radius: var(--radius-full);
  background: rgb(255 255 255 / 0.2);
}

.issue__badge-label {
  font-size: 14px;
  line-height: 20px;
}

.issue__badge-number {
  font-size: 30px;
  line-height: 36px;
  white-space: nowrap;
}

.issue__divider {
  align-self: stretch;
  width: 1px;
  margin-block: 10px;
  background: rgb(255 255 255 / 0.3);
}

.issue__date {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.issue__date-label {
  font-size: 14px;
  line-height: 20px;
  color: var(--color-text-hero);
}

.issue__date-value {
  font-size: 18px;
  line-height: 28px;
  white-space: nowrap;
}

.issue__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 12px 32px;
  border-radius: var(--radius-md);
  background: var(--color-white);
  color: var(--color-primary);
  font-size: 16px;
  line-height: 24px;
  transition:
    box-shadow var(--transition),
    transform var(--transition);
}

.issue__cta:hover {
  box-shadow: 0 8px 20px rgb(8 30 58 / 0.25);
  transform: translateY(-1px);
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 896px;
  margin-top: 32px;
}

.stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgb(255 255 255 / 0.1);
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: var(--radius-md);
}

.stats__value {
  font-size: 30px;
  line-height: 36px;
}

.stats__label {
  font-size: 16px;
  line-height: 24px;
  color: var(--color-text-hero);
}

@media (min-width: 1280px) {
  .hero__title {
    line-height: 1;
  }
}

@media (max-width: 767.98px) {
  .hero__inner {
    padding-block: 48px 56px;
  }

  .hero__subtitle {
    margin-top: 16px;
  }

  .issue {
    padding: 16px;
  }

  .stats {
    gap: 12px;
    margin-top: 16px;
  }

  .stats__item {
    padding: 12px 8px;
    gap: 4px;
  }

  .stats__value {
    font-size: 24px;
    line-height: 30px;
  }

  .stats__label {
    font-size: 13px;
    line-height: 18px;
  }
}

@media (max-width: 479.98px) {
  .issue__row {
    gap: 12px;
  }

  .issue__badge {
    min-width: 0;
    padding: 10px 18px;
  }

  .issue__badge-label,
  .issue__date-label {
    font-size: 12px;
    line-height: 16px;
  }

  .issue__badge-number {
    font-size: 22px;
    line-height: 28px;
  }

  .issue__date-value {
    font-size: 16px;
    line-height: 22px;
  }

  .issue__cta {
    width: 100%;
    padding-inline: 16px;
  }
}
</style>
