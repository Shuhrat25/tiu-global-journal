<script setup>
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getGallery } from '@/api/home'
import buildingImage from '@/assets/images/university-building.jpg'
import bookIcon from '@/assets/icons/book-open.svg'
import downloadIcon from '@/assets/icons/download.svg'

const { t, locale } = useI18n()

// Номер журнала из API: title и files — PDF журнала (type: 'file') и обложка (type: 'image')
const journal = ref(null)
const pdfUrl = ref('#')
const coverUrl = ref('')

async function loadJournal() {
  try {
    journal.value = await getGallery()
    for (const file of journal.value.files) {
      if (file.type === 'file') pdfUrl.value = file.img
      if (file.type === 'image') coverUrl.value = file.img
    }
  } catch (error) {
    console.error('Не удалось загрузить журнал', error)
  }
}

onMounted(loadJournal)
watch(locale, loadJournal) // название на другом языке
</script>

<template>
  <section class="section" :aria-label="t('journal.label')">
    <div class="container">
      <div class="journal">
        <img class="journal__bg" :src="buildingImage" alt="" loading="lazy" />

        <div class="journal__book">
          <span class="journal__spine">
            <img :src="bookIcon" alt="" width="32" height="32" />
          </span>
          <span class="journal__cover">
            <img v-if="coverUrl" :src="coverUrl" :alt="t('journal.coverAlt')" width="168" height="237" loading="lazy" />
          </span>
        </div>

        <h2 class="journal__title">{{ journal?.title }}</h2>

        <a class="journal__cta" :href="pdfUrl" target="_blank" rel="noopener noreferrer">
          <img :src="downloadIcon" alt="" width="24" height="24" />
          {{ t('journal.cta') }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.journal {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 309px;
  padding: 20px;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: var(--color-footer);
}

.journal__bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Dark overlay (#101828 / 50%) */
.journal::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgb(16 24 40 / 0.5);
}

.journal__book {
  display: flex;
  flex-shrink: 0;
  height: 269px;
}

.journal__spine {
  display: grid;
  place-items: center;
  width: 50px;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

.journal__cover {
  display: block;
  width: 200px;
  padding: 16px;
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  background: var(--color-white);
}

.journal__cover img {
  width: 168px;
  height: 237px;
  object-fit: cover;
  border: 1px solid var(--color-border-cover);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-cover);
}

.journal__title {
  max-width: 400px;
  font-size: 24px;
  line-height: 1.3;
  font-weight: 600;
  color: var(--color-white);
}

.journal__cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;
  padding: 12px 20px;
  border: 1px solid rgb(255 255 255 / 0.3);
  border-radius: var(--radius-md);
  background: linear-gradient(180deg, var(--color-primary-bright) 0%, var(--color-primary) 100%);
  color: var(--color-white);
  font-size: 18px;
  line-height: 1.4;
  font-weight: 500;
  white-space: nowrap;
  transition:
    box-shadow var(--transition),
    transform var(--transition);
}

.journal__cta:hover {
  box-shadow: 0 10px 24px rgb(8 30 58 / 0.35);
  transform: translateY(-1px);
}

@media (max-width: 1023.98px) {
  /* Text + button stacked to the right of the book */
  .journal {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    column-gap: 24px;
    row-gap: 20px;
  }

  .journal__book {
    grid-row: 1 / 3;
  }

  .journal__title {
    align-self: end;
  }

  .journal__cta {
    align-self: start;
    justify-self: start;
    margin-left: 0;
  }
}

@media (max-width: 599.98px) {
  .journal {
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 24px 16px;
    text-align: center;
  }

  .journal__book {
    grid-row: auto;
    height: 220px;
  }

  .journal__spine {
    width: 40px;
  }

  .journal__cover {
    width: 164px;
    padding: 12px;
  }

  .journal__cover img {
    width: 140px;
    height: 196px;
  }

  .journal__title {
    font-size: 20px;
  }

  .journal__cta {
    justify-self: center;
    font-size: 16px;
  }
}
</style>
