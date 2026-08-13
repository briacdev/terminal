<script setup lang="ts">
import { useLocalePath } from '#i18n'

interface RoadmapItem {
  path: string
  title: string
  description: string
  tags: string[]
  cover?: string
}

const roadmaps: RoadmapItem[] = [
  {
    path: '/java',
    title: 'Java Roadmap',
    description: 'A practical A-to-Z path from Java fundamentals to backend production skills.',
    tags: ['roadmap', 'java', 'backend'],
    cover: '/roadmaps/java-roadmap.webp'
  },
  {
    path: '/spring-boot',
    title: 'Spring Boot Roadmap',
    description: 'A complete path from Spring Boot fundamentals to secure, testable, production-grade APIs.',
    tags: ['roadmap', 'spring-boot', 'backend'],
    cover: '/banner-test.jpg'
  },
  {
    path: '/postgresql',
    title: 'PostgreSQL Roadmap',
    description: 'A single bilingual path from installation and SQL to indexes, transactions, backups, and production operations.',
    tags: ['roadmap', 'postgresql', 'data'],
    cover: '/banner-test.jpg'
  },
  {
    path: '/vue-js',
    title: 'Vue.js Roadmap',
    description: 'A practical path from Vue fundamentals to modern, production-ready frontend architecture.',
    tags: ['roadmap', 'vue', 'frontend'],
    cover: '/banner-test.jpg'
  },
  {
    path: '/nuxt',
    title: 'Nuxt Roadmap',
    description: 'A practical path from Nuxt fundamentals to full-stack, content-driven, production-ready applications.',
    tags: ['roadmap', 'nuxt', 'frontend'],
    cover: '/banner-test.jpg'
  },
  {
    path: '/ai',
    title: 'AI Roadmap',
    description: 'A practical path from AI fundamentals to modern LLM systems, RAG pipelines, and production deployment.',
    tags: ['roadmap', 'ai', 'llm'],
    cover: '/banner-test.jpg'
  },
  {
    path: '/seo',
    title: 'SEO Roadmap',
    description: 'A structured path from SEO basics to technical implementation and long-term growth.',
    tags: ['roadmap', 'seo', 'marketing'],
    cover: '/roadmaps/seo-roadmap.webp'
  }
]

const search = ref('')
const activeTag = ref<string | null>(null)
const localePath = useLocalePath()

const allTags = computed(() => {
  return Array.from(new Set(roadmaps.flatMap((item) => item.tags))).sort((a, b) => a.localeCompare(b))
})

const filteredRoadmaps = computed(() => {
  const term = search.value.trim().toLowerCase()

  return roadmaps.filter((item) => {
    const matchTerm =
      !term ||
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.tags.join(' ').toLowerCase().includes(term)

    const matchTag = !activeTag.value || item.tags.includes(activeTag.value)

    return matchTerm && matchTag
  })
})

useSeoMeta({
  title: 'Roadmaps',
  description: 'Learning roadmaps for Java, Spring Boot, PostgreSQL, Vue.js, Nuxt, AI, and SEO with visual progression and practical resources.',
  ogTitle: 'Roadmaps | Briac',
  ogDescription: 'Learning roadmaps for Java, Spring Boot, PostgreSQL, Vue.js, Nuxt, AI, and SEO with visual progression and practical resources.'
})
</script>

<template>
  <section class="space-y-8">
    <div class="space-y-3 border border-zinc-700 bg-zinc-950 p-5 sm:p-7">
      <p class="section-kicker">Learning Paths</p>
      <h1 class="text-3xl font-black uppercase tracking-tight sm:text-5xl">Roadmaps</h1>
      <p class="max-w-3xl text-zinc-300">
        Explore visual learning paths designed to move from fundamentals to production-ready execution.
      </p>
    </div>

    <div class="space-y-4 border border-zinc-700 bg-zinc-950 p-5 sm:p-6">
      <SearchInput v-model="search" placeholder="Filter roadmaps by title, description or tag..." />

      <div class="flex flex-wrap gap-2">
        <button
          class="button-like tag-filter-btn border px-3 py-1 text-sm"
          :class="!activeTag ? 'bg-white text-black border-white' : 'border-zinc-700 hover:bg-white hover:text-black'"
          @click="activeTag = null"
        >
          All
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          class="button-like tag-filter-btn border px-3 py-1 text-sm"
          :class="activeTag === tag ? 'bg-white text-black border-white' : 'border-zinc-700 hover:bg-white hover:text-black'"
          @click="activeTag = tag"
        >
          #{{ tag }}
        </button>
      </div>

      <p class="text-xs uppercase tracking-[0.14em] text-zinc-500">
        {{ filteredRoadmaps.length }} roadmap<span v-if="filteredRoadmaps.length > 1">s</span> visible
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in filteredRoadmaps" :key="item.path" class="brutal-card group flex h-full flex-col p-5">
        <NuxtLink :to="localePath(item.path)" class="mb-3 block no-underline">
          <NuxtImg
            :src="item.cover || '/banner-test.jpg'"
            :alt="`${item.title} cover`"
            class="h-24 w-full border border-zinc-700 object-cover"
            loading="lazy"
            format="webp"
          />
        </NuxtLink>
        <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">roadmap</p>

        <h2 class="mb-2 text-xl font-bold uppercase leading-tight">
          <NuxtLink :to="localePath(item.path)" class="no-underline">
            {{ item.title }}
          </NuxtLink>
        </h2>

        <p class="mb-5 text-sm leading-6 text-zinc-300">{{ item.description }}</p>

          <div class="mt-auto flex items-end justify-between gap-3">
            <div class="flex flex-wrap gap-2">
              <TagPill v-for="tag in item.tags.slice(0, 4)" :key="tag" :label="tag" />
            </div>
          <NuxtLink :to="localePath(item.path)" class="card-open-link text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 no-underline transition group-hover:text-white">
            open &gt;
          </NuxtLink>
        </div>
      </article>
    </div>

    <p v-if="!filteredRoadmaps.length" class="border border-zinc-700 p-4 text-zinc-400">
      No matching roadmaps found.
    </p>
  </section>
</template>
