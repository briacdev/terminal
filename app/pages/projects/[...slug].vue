<script setup lang="ts">
import { useI18n, useLocalePath } from '#i18n'
import type { ProjectItem } from '~/composables/useProjects'

const route = useRoute()
const localePath = useLocalePath()
const { t, locale } = useI18n()
const slug = computed(() => route.params.slug as string[])
const projectSlug = computed(() => slug.value.join('/'))
const defaultPath = computed(() => `/projects/${projectSlug.value}`)
const frPath = computed(() => `/projects-fr/${projectSlug.value}`)
const queryCollectionLoose = queryCollection as unknown as (collection: string) => {
  path: (value: string) => { first: () => Promise<ProjectItem | null> }
}

const defaultProject = await queryCollection('projects').path(defaultPath.value).first() as ProjectItem | null
const projectFr = locale.value === 'fr'
  ? await queryCollectionLoose('projectsFr').path(frPath.value).first()
  : null
const project = projectFr || defaultProject

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const allProjects = await useProjects()
const currentPath = computed(() => defaultProject?.path || project.path)
const currentIndex = computed(() => allProjects.findIndex((item) => item.path === currentPath.value))
const prevProject = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < allProjects.length - 1
    ? allProjects[currentIndex.value + 1]
    : null
)
const nextProject = computed(() =>
  currentIndex.value > 0
    ? allProjects[currentIndex.value - 1]
    : null
)
const coverUrl = computed(() => project.cover || '/banner-test.jpg')
const visibleTags = computed(() => (project.tags || []).slice(0, 4))

const stackIconMap: Record<string, { icon: string, color: string, label: string }> = {
  nuxt: { icon: 'i-simple-icons-nuxtdotjs', color: '#00DC82', label: 'Nuxt' },
  typescript: { icon: 'i-simple-icons-typescript', color: '#3178C6', label: 'TypeScript' },
  content: { icon: 'i-simple-icons-markdown', color: '#FFFFFF', label: 'Content' },
  tailwind: { icon: 'i-simple-icons-tailwindcss', color: '#06B6D4', label: 'Tailwind CSS' },
  vue: { icon: 'i-simple-icons-vuedotjs', color: '#42B883', label: 'Vue.js' },
  springboot: { icon: 'i-simple-icons-springboot', color: '#6DB33F', label: 'Spring Boot' },
  postgresql: { icon: 'i-simple-icons-postgresql', color: '#4169E1', label: 'PostgreSQL' },
  ollama: { icon: 'i-lucide-bot', color: '#FFFFFF', label: 'Ollama' },
  java: { icon: 'i-simple-icons-openjdk', color: '#EA2D2E', label: 'Java' }
}

const isStackIcon = (
  value: { icon: string, color: string, label: string } | undefined
): value is { icon: string, color: string, label: string } => Boolean(value)

const normalizeStackKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const stackIcons = computed(() => {
  const source = (project.stack?.length ? project.stack : project.tags) || []
  return source
    .map((item) => stackIconMap[normalizeStackKey(item)])
    .filter(isStackIcon)
    .slice(0, 6)
})

useSeoMeta({
  title: project.title,
  description: project.description,
  ogTitle: `${project.title} | Briac`,
  ogDescription: project.description
})
</script>

<template>
  <article class="blog-article-grid grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
    <div class="blog-article-main space-y-6">
      <header class="space-y-3 border-b border-zinc-800 pb-6">
        <NuxtLink
          :to="localePath('/projects')"
          class="button-like inline-flex items-center gap-2 border border-zinc-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300 no-underline hover:border-white hover:bg-white hover:text-black"
        >
          <span>←</span>
          <span>{{ t('projectsDetail.back') }}</span>
        </NuxtLink>
        <NuxtImg
          :src="coverUrl"
          :alt="`${project.title} cover image`"
          class="mb-4 h-[240px] w-full rounded-none border border-zinc-700 object-cover object-top sm:h-[300px] lg:h-[360px]"
          loading="lazy"
          format="webp"
        />
        <div class="flex items-center gap-2">
          <p class="text-xs uppercase tracking-wide text-zinc-400">{{ project.year }}</p>
          <span class="h-3.5 w-px bg-zinc-700" aria-hidden="true" />
          <span
            class="inline-flex items-center border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
            :class="project.active
              ? 'border-white bg-white text-black'
              : 'border-zinc-600 text-zinc-400'"
          >
            {{ project.active ? t('projects.statusActive') : t('projects.statusInactive') }}
          </span>
        </div>
        <div class="flex flex-wrap items-start justify-between gap-3">
          <h1 class="text-3xl font-bold leading-tight sm:text-4xl">{{ project.title }}</h1>
          <div v-if="stackIcons.length" class="flex items-center gap-2">
            <span class="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{{ t('projectsDetail.stack') }}</span>
            <div class="flex items-center gap-2">
              <UIcon
                v-for="item in stackIcons"
                :key="`${item.label}-${item.icon}`"
                :name="item.icon"
                class="size-4"
                :style="{ color: item.color }"
                :title="item.label"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <p class="max-w-3xl text-zinc-300">{{ project.description }}</p>
        <div class="flex flex-wrap gap-2">
          <TagPill v-for="tag in visibleTags" :key="tag" :label="tag" />
        </div>
        <div class="flex flex-wrap gap-3 pt-2">
          <UButton
            v-if="project.links?.repo"
            :to="project.links.repo"
            target="_blank"
            color="neutral"
            variant="outline"
            class="cta-repository rounded-none border-2 border-zinc-500 bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-100 no-underline"
          >
            <UIcon name="i-simple-icons-github" class="size-4" />
            {{ t('projectsDetail.repository') }}
          </UButton>
          <UButton
            v-if="project.links?.demo"
            :to="project.links.demo"
            target="_blank"
            color="neutral"
            variant="outline"
            class="cta-live-demo rounded-none border-2 border-white bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black no-underline"
          >
            <UIcon name="i-lucide-external-link" class="size-4" />
            {{ t('projectsDetail.liveDemo') }}
          </UButton>
        </div>
      </header>

      <ContentRenderer :value="project" class="prose prose-invert blog-prose max-w-none" />

      <nav class="grid gap-4 border-t border-zinc-800 pt-6 sm:grid-cols-2" :aria-label="t('projectsDetail.navigationAria')">
        <NuxtLink
          v-if="prevProject"
          :to="prevProject.path"
          class="button-like border border-zinc-700 p-4 no-underline hover:bg-white hover:text-black"
        >
          <p class="text-xs uppercase text-zinc-400">{{ t('projectsDetail.previous') }}</p>
          <p class="text-base font-semibold">{{ prevProject.title }}</p>
        </NuxtLink>
        <NuxtLink
          v-if="nextProject"
          :to="nextProject.path"
          class="button-like border border-zinc-700 p-4 no-underline hover:bg-white hover:text-black"
        >
          <p class="text-xs uppercase text-zinc-400">{{ t('projectsDetail.next') }}</p>
          <p class="text-base font-semibold">{{ nextProject.title }}</p>
        </NuxtLink>
      </nav>
    </div>

    <aside class="space-y-3 lg:sticky lg:top-24 lg:self-start">
      <p class="text-xs uppercase tracking-wide text-zinc-400">{{ t('projectsDetail.toc') }}</p>
      <ul v-if="project.body?.toc?.links?.length" class="space-y-2 border border-zinc-700 p-4 text-sm">
        <li v-for="item in project.body.toc.links" :key="item.id">
          <a :href="`#${item.id}`" class="no-underline hover:underline">{{ item.text }}</a>
        </li>
      </ul>
      <p v-else class="border border-zinc-700 p-4 text-sm text-zinc-400">{{ t('projectsDetail.noHeadings') }}</p>
    </aside>
  </article>
</template>
