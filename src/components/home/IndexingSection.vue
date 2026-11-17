<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { indexingBases } from '@/data/home'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import LogoBox from '@/components/ui/LogoBox.vue'

const { t } = useI18n()

const AUTOPLAY_MS = 3500
const total = indexingBases.length

const viewport = ref(null)
const perView = ref(5)
const index = ref(0) // position inside the (cloned) track
const animate = ref(true)
const paused = ref(false)

// Clones of the first slides at the end make the loop seamless
const slides = computed(() => [...indexingBases, ...indexingBases.slice(0, perView.value)])
const activeDot = computed(() => index.value % total)

let timer = null
let resizeObserver = null

function next() {
  if (index.value >= total) return
  animate.value = true
  index.value += 1
}

async function prev() {
  if (index.value === 0) {
    // jump (without animation) to the cloned copy, then slide back by one
    animate.value = false
    index.value = total
    await nextTick()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animate.value = true
        index.value = total - 1
      })
    })
    return
  }
  animate.value = true
  index.value -= 1
}

function goTo(i) {
  animate.value = true
  index.value = i
}

function onTransitionEnd() {
  if (index.value >= total) {
    animate.value = false
    index.value = 0
  }
}

function updatePerView() {
  const width = viewport.value?.clientWidth ?? 0
  const value = width >= 1000 ? 5 : width >= 760 ? 4 : width >= 520 ? 3 : 2
  if (value !== perView.value) {
    perView.value = value
    animate.value = false
    index.value = 0
  }
}

function startAutoplay() {
  stopAutoplay()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = window.setInterval(() => {
    if (!paused.value && !document.hidden) next()
  }, AUTOPLAY_MS)
}

function stopAutoplay() {
  if (timer) window.clearInterval(timer)
  timer = null
}

onMounted(() => {
  updatePerView()
  resizeObserver = new ResizeObserver(updatePerView)
  resizeObserver.observe(viewport.value)
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  resizeObserver?.disconnect()
})
</script>

<template>
  <section class="section" aria-labelledby="indexing-title">
    <div class="container">
      <SectionHeader id="indexing-title" :title="t('indexing.title')" :subtitle="t('indexing.subtitle')" />

      <div
        class="carousel"
        aria-roledescription="carousel"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
        @focusin="paused = true"
        @focusout="paused = false"
      >
        <button type="button" class="carousel__arrow" :aria-label="t('indexing.prev')" @click="prev">
          <AppIcon name="chevron-left" :size="24" />
        </button>

        <div ref="viewport" class="carousel__viewport">
          <ul
            class="carousel__track"
            :class="{ 'is-animated': animate }"
            :style="{ '--index': index, '--per-view': perView }"
            @transitionend.self="onTransitionEnd"
          >
            <li
              v-for="(base, i) in slides"
              :key="`${base.name}-${i}`"
              class="carousel__slide"
              :aria-hidden="i < index || i >= index + perView"
            >
              <a
                class="index-card"
                :href="base.href"
                target="_blank"
                rel="noopener noreferrer"
                :tabindex="i < index || i >= index + perView ? -1 : 0"
              >
                <LogoBox :src="base.logo" :alt="base.name" :box="base.box" ratio="182 / 104" />
              </a>
            </li>
          </ul>
        </div>

        <button type="button" class="carousel__arrow" :aria-label="t('indexing.next')" @click="next">
          <AppIcon name="chevron-right" :size="24" />
        </button>
      </div>

      <div class="dots" role="tablist" :aria-label="t('indexing.slides')">
        <button
          v-for="i in total"
          :key="i"
          type="button"
          class="dots__dot"
          :class="{ 'is-active': activeDot === i - 1 }"
          role="tab"
          :aria-selected="activeDot === i - 1"
          :aria-label="t('indexing.slide', { n: i })"
          @click="goTo(i - 1)"
        />
      </div>

      <p class="indexing__note">{{ t('indexing.note') }}</p>
    </div>
  </section>
</template>

<style scoped>
.carousel {
  display: grid;
  grid-template-columns: 40px minmax(0, 1126px) 40px;
  justify-content: center;
  align-items: center;
  gap: 21px;
}

.carousel__arrow {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-white);
  color: var(--color-primary);
  box-shadow: var(--shadow-float);
  transition:
    background-color var(--transition),
    color var(--transition);
}

.carousel__arrow:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

.carousel__viewport {
  overflow: hidden;
}

.carousel__track {
  --gap: 24px;
  display: flex;
  gap: var(--gap);
  transform: translateX(calc(var(--index) * -1 * (100% + var(--gap)) / var(--per-view)));
}

.carousel__track.is-animated {
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.carousel__slide {
  flex: 0 0 calc((100% - var(--gap) * (var(--per-view) - 1)) / var(--per-view));
  min-width: 0;
}

.index-card {
  display: block;
  padding: 11px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    border-color var(--transition),
    background-color var(--transition);
}

.index-card:hover {
  background: var(--color-white);
  border-color: var(--color-primary-light);
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.dots__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-dot);
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.dots__dot.is-active {
  width: 32px;
  background: var(--color-primary);
}

.indexing__note {
  margin-top: 30px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: var(--color-text);
}

@media (max-width: 767.98px) {
  .carousel {
    grid-template-columns: 36px minmax(0, 1fr) 36px;
    gap: 8px;
  }

  .carousel__arrow {
    width: 36px;
    height: 36px;
  }

  .carousel__track {
    --gap: 12px;
  }

  .indexing__note {
    margin-top: 20px;
    font-size: 15px;
  }
}
</style>
