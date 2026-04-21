<script setup lang="ts">
import { useI18n } from '#i18n'

const props = defineProps<{
  project: {
    path: string
    title: string
    description: string
    tags?: string[]
    year: number
    active?: boolean
    cover?: string
  }
}>()

const visibleTags = computed(() => (props.project.tags || []).slice(0, 4))
const { t } = useI18n()
</script>

<template>
  <article class="brutal-card group flex h-full flex-col p-3">
    <NuxtLink :to="project.path" class="mb-3 block no-underline">
      <NuxtImg
        :src="project.cover || '/banner-test.jpg'"
        :alt="`${project.title} banner`"
        class="h-24 w-full border border-zinc-700 object-cover object-top"
        loading="lazy"
        format="webp"
      />
    </NuxtLink>

    <div class="mb-2 flex items-center gap-2">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">{{ project.year }}</p>
      <span class="h-3 w-px bg-zinc-700" aria-hidden="true" />
      <span
        class="inline-flex items-center border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
        :class="project.active
          ? 'border-white bg-white text-black'
          : 'border-zinc-600 text-zinc-400'"
      >
        {{ project.active ? t('projects.statusActive') : t('projects.statusInactive') }}
      </span>
    </div>

    <h3 class="mb-2 text-lg font-bold uppercase leading-tight">
      <NuxtLink :to="project.path" class="no-underline">
        {{ project.title }}
      </NuxtLink>
    </h3>

    <p class="mb-4 text-sm leading-6 text-zinc-300">{{ project.description }}</p>

    <div class="mt-auto flex items-end justify-between gap-3">
      <div class="flex flex-wrap gap-2">
        <TagPill v-for="tag in visibleTags" :key="tag" :label="tag" />
      </div>
      <NuxtLink :to="project.path" class="card-open-link text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 no-underline transition group-hover:text-white">
        inspect &gt;
      </NuxtLink>
    </div>
  </article>
</template>
