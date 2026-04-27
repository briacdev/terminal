<script setup lang="ts">
import { useI18n } from '#i18n'

const { t, locale } = useI18n()
const projects = await useProjects(locale.value)
const search = ref('')
const activeTag = ref<string | null>(null)

const allTags = computed(() => {
  return Array.from(new Set(projects.flatMap((project) => project.tags))).sort((a, b) => a.localeCompare(b))
})

const filteredProjects = computed(() => {
  const term = search.value.trim().toLowerCase()

  return projects.filter((project) => {
    const matchTerm =
      !term ||
      project.title.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.tags.join(' ').toLowerCase().includes(term)

    const matchTag = !activeTag.value || project.tags.includes(activeTag.value)

    return matchTerm && matchTag
  })
})

const visibleCountLabel = computed(() => {
  if (filteredProjects.value.length > 1 || filteredProjects.value.length === 0) {
    return t('projects.visiblePlural', { count: filteredProjects.value.length })
  }

  return t('projects.visibleSingle', { count: filteredProjects.value.length })
})

useSeoMeta({
  title: () => t('projects.seo.title'),
  description: () => t('projects.seo.description'),
  ogTitle: () => t('projects.seo.ogTitle'),
  ogDescription: () => t('projects.seo.description')
})
</script>

<template>
  <section class="space-y-8">
    <div class="space-y-3 border border-zinc-700 bg-zinc-950 p-5 sm:p-7">
      <p class="section-kicker">{{ t('projects.kicker') }}</p>
      <h1 class="text-3xl font-black uppercase tracking-tight sm:text-5xl">{{ t('projects.title') }}</h1>
      <p class="max-w-3xl text-zinc-300">
        {{ t('projects.description') }}
      </p>
    </div>

    <div class="space-y-4 border border-zinc-700 bg-zinc-950 p-5 sm:p-6">
      <SearchInput v-model="search" :placeholder="t('projects.searchPlaceholder')" />

      <div class="flex flex-wrap gap-2">
        <button
          class="button-like tag-filter-btn border px-3 py-1 text-sm"
          :class="!activeTag ? 'bg-white text-black border-white' : 'border-zinc-700 hover:bg-white hover:text-black'"
          @click="activeTag = null"
        >
          {{ t('projects.all') }}
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
        {{ visibleCountLabel }}
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ProjectCard v-for="project in filteredProjects" :key="project.path" :project="project" />
    </div>

    <p v-if="!filteredProjects.length" class="border border-zinc-700 p-4 text-zinc-400">{{ t('projects.empty') }}</p>
  </section>
</template>
