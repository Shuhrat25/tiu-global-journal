<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { footerColumns, footerSocials, legalLinks } from '@/data/site'
import { getContacts } from '@/api/home'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppLink from '@/components/ui/AppLink.vue'

import mapPinIcon from '@/assets/icons/map-pin.svg'
import phoneIcon from '@/assets/icons/phone-footer.svg'
import mailIcon from '@/assets/icons/mail-footer.svg'

const { t } = useI18n()

const contacts = ref({}) // почта и телефон с API

onMounted(async () => {
  try {
    contacts.value = await getContacts()
  } catch (error) {
    console.error('Не удалось загрузить контакты', error)
  }
})
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <nav v-for="column in footerColumns" :key="column.key" class="footer__col" :aria-label="t(`nav.${column.key}`)">
          <h3 class="footer__title">{{ t(`nav.${column.key}`) }}</h3>
          <ul class="footer__links">
            <li v-for="link in column.links" :key="link.key">
              <AppLink :to="link.to" :href="link.href">{{ t(`nav.${link.key}`) }}</AppLink>
            </li>
          </ul>
        </nav>

        <div class="footer__col">
          <h3 class="footer__title">{{ t('footer.contacts') }}</h3>
          <ul class="footer__contacts">
            <li>
              <img :src="mapPinIcon" alt="" width="18" height="18" />
              <span>{{ t('footer.address') }}</span>
            </li>
            <li>
              <img :src="phoneIcon" alt="" width="18" height="18" />
              <a :href="`tel:${contacts.phoneHref}`">{{ contacts.phone }}</a>
            </li>
            <li>
              <img :src="mailIcon" alt="" width="18" height="18" />
              <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a>
            </li>
          </ul>
          <ul class="footer__socials">
            <li v-for="social in footerSocials" :key="social.name">
              <a :href="social.href" target="_blank" rel="noopener noreferrer" :aria-label="social.name">
                <AppIcon :name="social.icon" :size="20" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">{{ t('footer.copyright') }}</p>
        <ul class="footer__legal">
          <li v-for="link in legalLinks" :key="link.key">
            <a :href="link.href">{{ t(`footer.${link.key}`) }}</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding-top: 80px;
  background: var(--color-footer);
  color: var(--color-footer-text);
}

.footer__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px 24px;
  padding-bottom: 40px;
}

.footer__title {
  margin-bottom: 12px;
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  color: var(--color-link-footer);
}

.footer__links {
  display: grid;
  gap: 8px;
}

.footer__links a,
.footer__contacts a {
  font-size: 16px;
  line-height: 24px;
  transition: color var(--transition);
}

.footer__links a:hover,
.footer__links a.router-link-exact-active,
.footer__contacts a:hover,
.footer__legal a:hover {
  color: var(--color-white);
}

.footer__contacts {
  display: grid;
  gap: 12px;
}

.footer__contacts li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 16px;
  line-height: 24px;
}

.footer__contacts img {
  margin-top: 3px;
  flex-shrink: 0;
}

.footer__socials {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.footer__socials a {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-footer-chip);
  color: var(--color-white);
  transition: background-color var(--transition);
}

.footer__socials a:hover {
  background: var(--color-primary);
}

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  padding-block: 24px;
  border-top: 1px solid rgb(255 255 255 / 0.1);
  font-size: 15px;
  line-height: 1.3;
  color: var(--color-footer-muted);
}

.footer__legal {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 26px;
}

.footer__legal a {
  transition: color var(--transition);
}

@media (max-width: 1023.98px) {
  .footer {
    padding-top: 56px;
  }

  .footer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 559.98px) {
  .footer {
    padding-top: 48px;
  }

  .footer__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer__title {
    font-size: 18px;
  }

  .footer__links a,
  .footer__contacts li,
  .footer__contacts a {
    font-size: 15px;
  }

  .footer__bottom {
    font-size: 14px;
  }
}
</style>
