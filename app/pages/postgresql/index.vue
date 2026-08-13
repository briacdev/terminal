<script setup lang="ts">
import { useI18n, useLocalePath } from '#i18n'
import { postgresqlRoadmapSteps, type PostgresqlRoadmapStepDefinition } from '../../data/postgresql-roadmap'

interface PostgresqlRoadmapStepView {
  id: number
  side: 'left' | 'right'
  phase: string
  title: string
  points: string[]
  path: string
}

const { locale } = useI18n()
const localePath = useLocalePath()

const steps = computed<PostgresqlRoadmapStepView[]>(() =>
  postgresqlRoadmapSteps.map((step: PostgresqlRoadmapStepDefinition) => ({
    id: step.id,
    side: step.side,
    phase: step.phase[locale.value === 'fr' ? 'fr' : 'en'],
    title: step.title[locale.value === 'fr' ? 'fr' : 'en'],
    points: step.points[locale.value === 'fr' ? 'fr' : 'en'],
    path: `/postgresql/${step.slug}`
  }))
)

const pageUi = computed(() =>
  locale.value === 'fr'
    ? {
        kicker: "Parcours d'apprentissage",
        title: 'Roadmap PostgreSQL',
        intro:
          'Un parcours unique, du premier SELECT jusqu’aux opérations en production. Suis les étapes dans l’ordre : chaque page prépare la suivante.',
        openTutorial: 'Ouvrir le tutoriel >',
        seoTitle: 'Roadmap PostgreSQL | Briac',
        seoDescription:
          'Roadmap PostgreSQL bilingue et progressive : installation, SQL, index, transactions, JSONB, sauvegardes et production.',
        seoOgTitle: 'Roadmap PostgreSQL | Briac // Terminal Portfolio'
      }
    : {
        kicker: 'Learning Path',
        title: 'PostgreSQL Roadmap',
        intro:
          'One path, from your first SELECT to production operations. Follow the steps in order: each page prepares the next one.',
        openTutorial: 'Open tutorial >',
        seoTitle: 'PostgreSQL Roadmap | Briac',
        seoDescription:
          'Bilingual PostgreSQL learning roadmap: installation, SQL, indexes, transactions, JSONB, backups, and production operations.',
        seoOgTitle: 'PostgreSQL Roadmap | Briac // Terminal Portfolio'
      }
)

useSeoMeta({
  title: () => pageUi.value.seoTitle,
  description: () => pageUi.value.seoDescription,
  ogTitle: () => pageUi.value.seoOgTitle,
  ogDescription: () => pageUi.value.seoDescription,
  ogLocale: () => (locale.value === 'fr' ? 'fr_FR' : 'en_US')
})
</script>

<template>
  <section class="postgresql-roadmap space-y-8">
    <header class="space-y-3 border border-zinc-700 bg-zinc-950 p-5 sm:p-7">
      <p class="section-kicker">{{ pageUi.kicker }}</p>
      <h1 class="text-3xl font-black uppercase tracking-tight sm:text-5xl">{{ pageUi.title }}</h1>
      <p class="max-w-3xl text-zinc-300">
        {{ pageUi.intro }}
      </p>
    </header>

    <div class="roadmap-wrap">
      <div class="roadmap-line" aria-hidden="true" />

      <article
        v-for="step in steps"
        :key="step.id"
        class="roadmap-node"
        :class="step.side === 'left' ? 'node-left' : 'node-right'"
      >
        <div class="node-dot" aria-hidden="true">{{ step.id }}</div>

        <div class="node-card">
          <p class="node-phase">{{ step.phase }}</p>
          <h2 class="node-title">{{ step.title }}</h2>
          <ul class="node-list">
            <li v-for="point in step.points" :key="point">{{ point }}</li>
          </ul>
          <NuxtLink
            :to="localePath(step.path)"
            class="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300 no-underline hover:underline"
          >
            {{ pageUi.openTutorial }}
          </NuxtLink>
        </div>
      </article>
    </div>

    <RoadmapArticleFeed roadmap-name="PostgreSQL" :search-terms="['postgresql']" search-query="postgresql" />
  </section>
</template>

<style scoped>
.postgresql-roadmap {
  max-width: 1100px;
  margin: 0 auto;
}

.roadmap-wrap {
  position: relative;
  display: grid;
  gap: 1.4rem;
  padding: 0.5rem 0;
}

.roadmap-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(to bottom, #2d2d2d, #8a8a8a 45%, #2d2d2d);
}

.roadmap-node {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

.node-left .node-card {
  grid-column: 1;
  margin-right: 2rem;
}

.node-right .node-card {
  grid-column: 2;
  margin-left: 2rem;
}

.node-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2rem;
  height: 2rem;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  border: 2px solid #fff;
  background: #000;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  z-index: 2;
}

.node-card {
  border: 2px solid #3e3e3e;
  background: #070707;
  padding: 1rem;
  transition: border-color 120ms ease, transform 120ms ease;
}

.node-card:hover {
  border-color: #fff;
  transform: translateY(-2px);
}

.node-phase {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #9f9f9f;
}

.node-title {
  margin: 0.4rem 0 0.7rem 0;
  font-size: clamp(1rem, 0.9rem + 0.35vw, 1.35rem);
  line-height: 1.15;
  text-transform: uppercase;
}

.node-list {
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.45rem;
  color: #d8d8d8;
}

.node-list li {
  line-height: 1.45;
}

@media (max-width: 900px) {
  .roadmap-line {
    left: 0.7rem;
    transform: none;
  }

  .roadmap-node {
    grid-template-columns: 1fr;
    padding-left: 2rem;
  }

  .node-left .node-card,
  .node-right .node-card {
    grid-column: 1;
    margin: 0;
  }

  .node-dot {
    left: 0.7rem;
    transform: translate(-50%, -50%);
  }
}
</style>
