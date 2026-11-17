<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PageBanner from '@/components/page/PageBanner.vue'
import PageWithSidebar from '@/components/page/PageWithSidebar.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { editorialTabs } from '@/data/editorial'

const { t } = useI18n()

const activeTab = ref(editorialTabs[0].id)
const members = computed(() => editorialTabs.find((tab) => tab.id === activeTab.value)?.members ?? [])

/* arrow-key navigation between tabs (WAI-ARIA tabs pattern) */
function onTabKeydown(event, index) {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
  if (!step) return
  const next = editorialTabs[(index + step + editorialTabs.length) % editorialTabs.length]
  activeTab.value = next.id
  document.getElementById(`tab-${next.id}`)?.focus()
}
</script>

<template>
  <div class="inner-page">
    <PageBanner :title="t('nav.editorial')" :crumbs="[{ label: t('nav.about') }, { label: t('nav.editorial') }]" />

    <PageWithSidebar>
      <div class="tabs-card">
        <div class="tabs" role="tablist" :aria-label="t('nav.editorial')">
          <button
            v-for="(tab, index) in editorialTabs"
            :id="`tab-${tab.id}`"
            :key="tab.id"
            type="button"
            class="tabs__tab"
            :class="{ 'is-active': activeTab === tab.id }"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`panel-${tab.id}`"
            :tabindex="activeTab === tab.id ? 0 : -1"
            @click="activeTab = tab.id"
            @keydown="onTabKeydown($event, index)"
          >
            {{ t(`editorial.tabs.${tab.id}`) }}
          </button>
        </div>
      </div>

      <ul :id="`panel-${activeTab}`" class="members" role="tabpanel" :aria-labelledby="`tab-${activeTab}`">
        <li v-for="member in members" :key="member.id" class="member">
          <div class="member__photo">
            <img v-if="member.photo" :src="member.photo" :alt="t(`editorial.members.${member.id}.name`)" loading="lazy" />
            <AppIcon v-else name="users" :size="96" :stroke-width="1" />
          </div>
          <div class="member__text">
            <h3 class="member__name">{{ t(`editorial.members.${member.id}.name`) }}</h3>
            <p class="member__position">{{ t(`editorial.members.${member.id}.position`) }}</p>
          </div>
        </li>
      </ul>
    </PageWithSidebar>
  </div>
</template>

<style scoped>
.inner-page {
  background: var(--color-bg-topbar);
}

/* ---------- Tabs ---------- */
.tabs-card {
  padding: 12px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.tabs {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 3px;
  padding: 3px;
  border-radius: var(--radius-md);
  background: var(--color-bg-topbar);
}

.tabs__tab {
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: 18px;
  line-height: 23px;
  font-weight: 500;
  color: var(--color-text-muted);
  transition:
    background-color var(--transition),
    border-color var(--transition),
    color var(--transition);
}

.tabs__tab:hover {
  color: var(--color-primary);
}

/* active tab is a raised white "pill" inside the grey segmented control */
.tabs__tab.is-active {
  background: var(--color-white);
  border-color: var(--color-border);
  box-shadow: 0 1px 3px rgb(16 24 40 / 0.08);
  color: var(--color-heading);
}

/* ---------- Members ---------- */
.members {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.member {
  display: flex;
  flex-direction: column;
  padding: 6px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  transition:
    box-shadow var(--transition),
    transform var(--transition);
}

.member:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgb(16 24 40 / 0.1);
}

.member__photo {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--color-bg-topbar);
  color: var(--color-primary-light);
}

.member__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.member__text {
  padding: 14px 8px 14px;
}

.member__name {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  color: var(--color-heading);
}

.member__position {
  margin-top: 2px;
  font-size: 16px;
  line-height: 25px;
  color: var(--color-text);
}

@media (max-width: 1279.98px) {
  .members {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767.98px) {
  .members {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .tabs {
    display: flex;
  }

  .tabs__tab {
    flex: 1 1 auto;
    font-size: 16px;
  }

  .member__name {
    font-size: 17px;
    line-height: 24px;
  }

  .member__position {
    font-size: 14px;
    line-height: 20px;
  }
}

@media (max-width: 419.98px) {
  .members {
    grid-template-columns: 1fr;
  }
}
</style>
