<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import ContactForm from '@/components/home/ContactForm.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { contactSocials, contacts } from '@/data/site'

const { t, locale } = useI18n()

const MAP_QUERY = 'Tashkent International University, Tashkent'

/* Google Maps embed in the interface language (no API key needed) */
const mapLang = computed(() => ({ 'uz-Cyrl': 'uz', 'uz-Latn': 'uz', ru: 'ru', en: 'en' })[locale.value] ?? 'uz')
const mapSrc = computed(
  () => `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&hl=${mapLang.value}&z=15&output=embed`,
)
const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="t('nav.contact')" :crumbs="[{ label: t('nav.contact') }]" />

    <div class="container contact-page">
      <ul class="info-cards">
        <li class="info-card">
          <span class="info-card__icon"><AppIcon name="mail" :size="24" /></span>
          <span class="info-card__label">{{ t('contactPage.email') }}</span>
          <a class="info-card__value" :href="`mailto:${contacts.email}`">{{ contacts.email }}</a>
        </li>
        <li class="info-card">
          <span class="info-card__icon"><AppIcon name="phone" :size="24" /></span>
          <span class="info-card__label">{{ t('contactPage.phone') }}</span>
          <a class="info-card__value" :href="`tel:${contacts.phoneHref}`">{{ contacts.phone }}</a>
        </li>
        <li class="info-card">
          <span class="info-card__icon"><AppIcon name="calendar-clock" :size="24" /></span>
          <span class="info-card__label">{{ t('contactPage.hours') }}</span>
          <span class="info-card__value">{{ t('contactPage.hoursValue') }}</span>
        </li>
        <li class="info-card">
          <span class="info-card__icon"><AppIcon name="map-pin" :size="24" /></span>
          <span class="info-card__label">{{ t('contactPage.address') }}</span>
          <span class="info-card__value">{{ t('contactPage.addressValue') }}</span>
        </li>
        <li class="info-card">
          <span class="info-card__icon"><AppIcon name="share" :size="24" /></span>
          <span class="info-card__label">{{ t('contactPage.socials') }}</span>
          <span class="info-card__socials">
            <a
              v-for="social in contactSocials"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.name"
            >
              <AppIcon :name="social.icon" :size="20" />
            </a>
          </span>
        </li>
      </ul>

      <div class="contact-page__grid">
        <ContactForm :with-file="false" title-id="contact-page-title" />

        <figure class="map">
          <iframe
            class="map__frame"
            :src="mapSrc"
            :title="t('contactPage.map')"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          />
          <a class="map__link" :href="mapLink" target="_blank" rel="noopener noreferrer">
            {{ t('contactPage.openMap') }}
            <AppIcon name="external-link" :size="16" />
          </a>
        </figure>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inner-page {
  background: var(--color-bg-topbar);
}

.contact-page {
  position: relative;
  display: grid;
  gap: 20px;
  margin-top: -30px;
  padding-bottom: var(--section-space);
}

/* ---------- Info cards ---------- */
.info-cards {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
}

.info-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 179px;
  padding: 16px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.info-card__icon {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  margin-bottom: 12px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-white);
}

.info-card__label {
  font-size: 18px;
  line-height: 25px;
  color: var(--color-text-muted);
}

.info-card__value {
  margin-top: 4px;
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  color: var(--color-heading);
  overflow-wrap: anywhere;
}

a.info-card__value:hover {
  color: var(--color-primary);
}

.info-card__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.info-card__socials a {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  transition:
    background-color var(--transition),
    color var(--transition);
}

.info-card__socials a:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

/* ---------- Form + map ---------- */
.contact-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 992fr) minmax(0, 487fr);
  gap: 21px;
}

/* on the grey page the form sits on a white card */
.contact-page__grid :deep(.contact-form) {
  background: var(--color-white);
  border-color: transparent;
}

.map {
  position: relative;
  margin: 0;
  min-height: 420px;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  background: var(--color-border);
}

.map__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.map__link {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  background: var(--color-white);
  box-shadow: var(--shadow-card);
  font-size: 15px;
  color: var(--color-primary);
}

.map__link:hover {
  background: var(--color-primary-soft);
}

@media (max-width: 1279.98px) {
  .info-cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1023.98px) {
  .contact-page__grid {
    grid-template-columns: 1fr;
  }

  .map {
    min-height: 360px;
  }
}

@media (max-width: 767.98px) {
  .info-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .info-card {
    min-height: 0;
  }

  .info-card__label {
    font-size: 16px;
  }

  .info-card__value {
    font-size: 17px;
    line-height: 24px;
  }
}

@media (max-width: 479.98px) {
  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>
