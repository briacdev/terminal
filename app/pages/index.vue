<script setup lang="ts">
import { useI18n, useLocalePath } from '#i18n'

const { t, locale } = useI18n()
const posts = await usePosts(locale.value)
const localePath = useLocalePath()
const projects = await useProjects(locale.value)

const latestPosts = computed(() => posts.slice(0, 3))
const featuredProjects = computed(() => projects.slice(0, 3))
const featuredRoadmaps = computed(() => ([
  {
    path: localePath('/java'),
    title: 'Java Roadmap',
    description: locale.value === 'fr'
      ? "Parcours d'apprentissage de A à Z, des bases Java à l'ingénierie backend en production."
      : 'A to Z learning path from Java fundamentals to production-grade backend engineering.',
    tags: ['roadmap', 'java'],
    cover: '/roadmaps/java-roadmap.webp'
  },
  {
    path: localePath('/spring-boot'),
    title: 'Spring Boot Roadmap',
    description: locale.value === 'fr'
      ? 'Parcours complet de Spring Boot: architecture API, securite, tests et production.'
      : 'Complete Spring Boot learning path covering API architecture, security, testing, and production.',
    tags: ['roadmap', 'spring-boot'],
    cover: '/banner-test.jpg'
  },
  {
    path: localePath('/postgresql'),
    title: 'PostgreSQL Roadmap',
    description: locale.value === 'fr'
      ? 'Parcours progressif de PostgreSQL: modelisation, requetes, performance et operations en production.'
      : 'Progressive PostgreSQL path covering modeling, querying, performance, and production operations.',
    tags: ['roadmap', 'postgresql'],
    cover: '/banner-test.jpg'
  },
  {
    path: localePath('/vue-js'),
    title: 'Vue.js Roadmap',
    description: locale.value === 'fr'
      ? 'Parcours Vue.js progressif: reactivite, composants, routing, state management et frontend de production.'
      : 'Progressive Vue.js path covering reactivity, components, routing, state management, and production frontend architecture.',
    tags: ['roadmap', 'vue'],
    cover: '/banner-test.jpg'
  },
  {
    path: localePath('/nuxt'),
    title: 'Nuxt Roadmap',
    description: locale.value === 'fr'
      ? 'Parcours Nuxt progressif: rendu, routing, contenu, logique serveur et applications frontend en production.'
      : 'Progressive Nuxt path covering rendering, routing, content, server logic, and production-ready frontend applications.',
    tags: ['roadmap', 'nuxt'],
    cover: '/banner-test.jpg'
  },
  {
    path: localePath('/ai'),
    title: 'AI Roadmap',
    description: locale.value === 'fr'
      ? 'Parcours progressif sur l IA moderne: LLMs, prompting, RAG, serving et mise en production.'
      : 'Progressive AI path covering LLMs, prompting, RAG, serving, and production systems.',
    tags: ['roadmap', 'ai'],
    cover: '/banner-test.jpg'
  },
  {
    path: localePath('/seo'),
    title: 'SEO Roadmap',
    description: locale.value === 'fr'
      ? 'Roadmap pas à pas, des fondamentaux SEO à la mise en pratique technique.'
      : 'Step-by-step roadmap from SEO fundamentals to technical execution and long-term growth.',
    tags: ['roadmap', 'seo'],
    cover: '/roadmaps/seo-roadmap.webp'
  }
]).slice(0, 3))

interface GithubStats {
  metrics: {
    publicReposLabel: string
    totalStarsLabel: string
    contributionsLastYearLabel: string
    followersLabel: string
  }
  calendar: {
    weeks: Array<Array<{
      date: string
      count: number
      level: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE'
    }>>
    streak: {
      current: number
      longest: number
      activeDays30: number
    }
  }
  repos: Array<{
    name: string
    status: string
    stars: number
    pushedDaysAgo: number
    url: string
  }>
}

const { data: githubStats } = await useFetch<GithubStats>('/api/github-stats', {
  server: true
})

const metrics = computed(() => ({
  publicRepos: githubStats.value?.metrics.publicReposLabel || '0',
  totalStars: githubStats.value?.metrics.totalStarsLabel || '0',
  contributionsYear: githubStats.value?.metrics.contributionsLastYearLabel || 'N/A',
  followers: githubStats.value?.metrics.followersLabel || '0'
}))

const activeRepos = computed(() => githubStats.value?.repos || [])
const calendarWeeks = computed(() => githubStats.value?.calendar.weeks || [])
const hoveredContribution = ref<{ date: string, count: number } | null>(null)

const contributionLevelClass = (level: string) => {
  if (level === 'FOURTH_QUARTILE') return 'contrib-lvl-4'
  if (level === 'THIRD_QUARTILE') return 'contrib-lvl-3'
  if (level === 'SECOND_QUARTILE') return 'contrib-lvl-2'
  if (level === 'FIRST_QUARTILE') return 'contrib-lvl-1'
  return 'contrib-lvl-0'
}

const contributionHoverLabel = computed(() => {
  if (!hoveredContribution.value) {
    return t('home.contributionHoverEmpty')
  }

  const formattedDate = new Date(hoveredContribution.value.date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  if (hoveredContribution.value.count > 1) {
    return t('home.contributionHoverPlural', { date: formattedDate, count: hoveredContribution.value.count })
  }

  return t('home.contributionHoverSingle', { date: formattedDate, count: hoveredContribution.value.count })
})

useSeoMeta({
  title: () => t('home.seo.title'),
  description: () => t('home.seo.description'),
  ogTitle: () => t('home.seo.ogTitle'),
  ogDescription: () => t('home.seo.description'),
  twitterTitle: () => t('home.seo.ogTitle'),
  twitterDescription: () => t('home.seo.twitterDescription')
})
</script>

<template>
  <div class="relative space-y-10 overflow-hidden sm:space-y-14">
    <ClientOnly>
      <ThreeAsciiBackground />
    </ClientOnly>

    <div class="relative z-10 space-y-10 sm:space-y-14">
      <TerminalHero />

      <section class="brutal-panel-dark p-4 sm:p-6">
        <div class="mb-3 flex items-center justify-between gap-3 border-b border-zinc-700 pb-2">
          <p class="section-kicker">{{ t('home.liveOps') }}</p>
          <p class="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{{ t('home.realTimeStatus') }}</p>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <div class="panel-window p-4 lg:col-span-2">
            <div class="mb-3 flex items-center justify-between gap-3">
              <p class="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{{ t('home.contributionGraph') }}</p>
              <p class="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{{ t('home.contributionsInYear', { count: metrics.contributionsYear }) }}</p>
            </div>
            <div class="contrib-heatmap" :style="{ gridTemplateColumns: `repeat(${calendarWeeks.length || 53}, minmax(0, 1fr))` }">
              <div v-for="(week, weekIndex) in calendarWeeks" :key="`week-${weekIndex}`" class="contrib-week">
                <div
                  v-for="day in week"
                  :key="day.date"
                  class="contrib-cell"
                  :class="contributionLevelClass(day.level)"
                  :title="t('home.contributionHoverPlural', { date: day.date, count: day.count })"
                  tabindex="0"
                  @mouseenter="hoveredContribution = { date: day.date, count: day.count }"
                  @mouseleave="hoveredContribution = null"
                  @focus="hoveredContribution = { date: day.date, count: day.count }"
                  @blur="hoveredContribution = null"
                />
              </div>
            </div>
            <p class="mt-3 text-xs uppercase tracking-[0.14em] text-zinc-400">{{ contributionHoverLabel }}</p>
          </div>
        </div>

        <div class="mt-4 grid gap-4 lg:grid-cols-2">
          <div class="panel-window p-4">
            <p class="mb-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">{{ t('home.performanceMetrics') }}</p>
            <ul class="space-y-2">
              <li class="metric-row">
                <span>{{ t('home.publicRepos') }}</span>
                <strong>{{ metrics.publicRepos }}</strong>
              </li>
              <li class="metric-row">
                <span>{{ t('home.totalStars') }}</span>
                <strong>{{ metrics.totalStars }}</strong>
              </li>
              <li class="metric-row">
                <span>{{ t('home.contributionsYear') }}</span>
                <strong>{{ metrics.contributionsYear }}</strong>
              </li>
              <li class="metric-row">
                <span>{{ t('home.followers') }}</span>
                <strong>{{ metrics.followers }}</strong>
              </li>
            </ul>
          </div>

          <div class="panel-window p-4">
            <p class="mb-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">{{ t('home.repositoryActivity') }}</p>
            <ul class="space-y-2 text-xs">
              <li v-for="repo in activeRepos" :key="repo.name" class="node-row">
                <a :href="repo.url" target="_blank" rel="noopener noreferrer" class="no-underline hover:underline">
                  {{ repo.name }}
                </a>
                <span>{{ repo.status }}</span>
                <span>{{ repo.pushedDaysAgo }}d · ★{{ repo.stars }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="brutal-panel-dark p-5 sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="section-kicker">{{ t('home.knowledgeBase') }}</p>
            <h2 class="section-title">{{ t('home.latestArticles') }}</h2>
          </div>
          <NuxtLink class="button-like section-link" :to="localePath('/blog')">{{ t('home.viewAll') }}</NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <PostCard v-for="post in latestPosts" :key="post.path" :post="post" />
        </div>
      </section>

      <section class="brutal-panel-dark p-5 sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="section-kicker">{{ t('home.executionLayer') }}</p>
            <h2 class="section-title">{{ t('home.featuredProjects') }}</h2>
          </div>
          <NuxtLink class="button-like section-link" :to="localePath('/projects')">{{ t('home.viewAll') }}</NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <ProjectCard v-for="project in featuredProjects" :key="project.path" :project="project" />
        </div>
      </section>

      <section class="brutal-panel-dark p-5 sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="section-kicker">{{ t('home.learningPaths') }}</p>
            <h2 class="section-title">{{ t('home.roadmaps') }}</h2>
          </div>
          <NuxtLink class="button-like section-link" :to="localePath('/roadmaps')">{{ t('home.viewAll') }}</NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <PostCard v-for="roadmap in featuredRoadmaps" :key="roadmap.path" :post="roadmap" />
        </div>
      </section>
    </div>
  </div>
</template>
