<script setup lang="ts">
import { useI18n, useLocalePath } from '#i18n'
import { springBootRoadmapSteps, type SpringBootRoadmapStepDefinition } from '../../data/spring-boot-roadmap'

interface SpringBootRoadmapStepView {
  id: number
  side: 'left' | 'right'
  phase: string
  title: string
  points: string[]
  path: string
}

const { locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const language = computed(() => (locale.value === 'fr' ? 'fr' : 'en'))

const steps = computed<SpringBootRoadmapStepView[]>(() =>
  springBootRoadmapSteps.map((step: SpringBootRoadmapStepDefinition) => ({
    id: step.id,
    side: step.side,
    phase: step.phase[language.value],
    title: step.title[language.value],
    points: step.points[language.value],
    path: `/spring-boot/${step.slug}`
  }))
)

const pageUi = computed(() =>
  locale.value === 'fr'
    ? {
        kicker: "Parcours d'apprentissage",
        title: 'Roadmap Spring Boot',
        intro:
          'Un parcours en 21 leçons, à suivre dans l\'ordre: des bases Spring Boot jusqu\'à une API sécurisée, testée et prête pour la production.',
        howTitle: 'Comment suivre ce parcours',
        howPoints: [
          'Ouvrez les leçons dans l\'ordre, de 1 à 21.',
          'Chaque page couvre une seule compétence, sans recopier les articles du blog.',
          'En bas de page, passez à l\'étape suivante. Le blog sert d\'approfondissement, pas de doublon.'
        ],
        openTutorial: 'Ouvrir la leçon >',
        seoTitle: 'Roadmap Spring Boot',
        seoDescription:
          'Parcours Spring Boot bilingue en 21 leçons: API REST, JPA, sécurité, tests, cache, Actuator, Docker et production.',
        seoOgTitle: 'Roadmap Spring Boot | Briac // Terminal Portfolio'
      }
    : {
        kicker: 'Learning Path',
        title: 'Spring Boot Roadmap',
        intro:
          'A 21-lesson path to follow in order: from Spring Boot basics to a secure, tested, production-ready API.',
        howTitle: 'How to follow this path',
        howPoints: [
          'Open the lessons in order, from 1 to 21.',
          'Each page teaches one skill and does not copy the blog tutorials.',
          'Use the next-lesson link at the bottom. Blog posts are deeper dives, not duplicates.'
        ],
        openTutorial: 'Open lesson >',
        seoTitle: 'Spring Boot Roadmap',
        seoDescription:
          'Bilingual 21-lesson Spring Boot path: REST APIs, JPA, security, testing, caching, Actuator, Docker, and production.',
        seoOgTitle: 'Spring Boot Roadmap | Briac // Terminal Portfolio'
      }
)

const pageUrl = computed(() =>
  locale.value === 'fr' ? `${config.public.siteUrl}/fr/spring-boot` : `${config.public.siteUrl}/spring-boot`
)

useSeoMeta({
  title: () => pageUi.value.seoTitle,
  description: () => pageUi.value.seoDescription,
  ogTitle: () => pageUi.value.seoOgTitle,
  ogDescription: () => pageUi.value.seoDescription,
  ogUrl: () => pageUrl.value,
  ogType: 'website'
})

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: pageUi.value.title,
        description: pageUi.value.seoDescription,
        url: pageUrl.value,
        numberOfItems: steps.value.length,
        itemListElement: steps.value.map((step) => ({
          '@type': 'ListItem',
          position: step.id,
          name: step.title,
          url: `${config.public.siteUrl}${localePath(step.path)}`
        }))
      })
    }
  ]
}))
</script>

<template>
  <section class="springboot-roadmap space-y-8">
    <header class="space-y-3 border border-zinc-700 bg-zinc-950 p-5 sm:p-7">
      <p class="section-kicker">{{ pageUi.kicker }}</p>
      <h1 class="text-3xl font-black uppercase tracking-tight sm:text-5xl">{{ pageUi.title }}</h1>
      <p class="max-w-3xl text-zinc-300">
        {{ pageUi.intro }}
      </p>
    </header>

    <section class="border border-zinc-700 bg-zinc-950 p-5 sm:p-7" :aria-labelledby="`spring-boot-how-title`">
      <h2 id="spring-boot-how-title" class="text-lg font-bold uppercase tracking-tight">{{ pageUi.howTitle }}</h2>
      <ol class="mt-4 grid gap-2 text-zinc-300">
        <li v-for="(point, index) in pageUi.howPoints" :key="point" class="flex gap-3">
          <span class="font-mono text-zinc-500">{{ index + 1 }}.</span>
          <span>{{ point }}</span>
        </li>
      </ol>
    </section>

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

    <RoadmapArticleFeed roadmap-name="Spring Boot" :search-terms="['spring boot', 'springboot']" search-query="spring boot" />
  </section>
</template>

<style scoped>
.springboot-roadmap {
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
