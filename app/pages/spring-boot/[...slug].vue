<script setup lang="ts">
import { useI18n, useLocalePath } from '#i18n'
import type { SpringBootRoadmapPost } from '../../composables/useSpringBootRoadmaps'
import { getSpringBootRoadmapStepBySlug, normalizeSpringBootRoadmapPath } from '../../data/spring-boot-roadmap'

const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()
const config = useRuntimeConfig()

const slug = computed(() => route.params.slug as string[])
const currentSlug = computed(() => slug.value.join('/'))

const loadedPost = await useSpringBootRoadmapPost(slug.value)

if (!loadedPost) {
  throw createError({ statusCode: 404, statusMessage: 'Spring Boot roadmap article not found' })
}

const post: SpringBootRoadmapPost = loadedPost
const allPosts = await useSpringBootRoadmaps()
const currentIndex = computed(() => allPosts.findIndex((item: SpringBootRoadmapPost) => item.path === normalizeSpringBootRoadmapPath(post.path)))
const prevPost = computed(() => (currentIndex.value > 0 ? allPosts[currentIndex.value - 1] : null))
const nextPost = computed(() => (currentIndex.value < allPosts.length - 1 ? allPosts[currentIndex.value + 1] : null))
const visibleTags = computed(() => (post.tags || []).slice(0, 4))
const currentStep = computed(() => getSpringBootRoadmapStepBySlug(currentSlug.value))

const ui = computed(() =>
  locale.value === 'fr'
    ? {
        back: 'Retour à la roadmap Spring Boot',
        previous: 'Leçon précédente',
        next: 'Leçon suivante',
        toc: 'Table des matières',
        noHeadings: 'Aucun titre dans cet article.',
        navAria: 'Navigation des leçons Spring Boot',
        stepLabel: currentStep.value ? `Leçon ${currentStep.value.id} sur 21` : 'Leçon Spring Boot'
      }
    : {
        back: 'Back to Spring Boot Roadmap',
        previous: 'Previous lesson',
        next: 'Next lesson',
        toc: 'Table of contents',
        noHeadings: 'No headings in this post.',
        navAria: 'Spring Boot lesson navigation',
        stepLabel: currentStep.value ? `Lesson ${currentStep.value.id} of 21` : 'Spring Boot lesson'
      }
)

const pageUrl = computed(() =>
  locale.value === 'fr'
    ? `${config.public.siteUrl}/fr/spring-boot/${currentSlug.value}`
    : `${config.public.siteUrl}/spring-boot/${currentSlug.value}`
)

useSeoMeta({
  title: post.title,
  description: post.description,
  ogTitle: `${post.title} | Briac`,
  ogDescription: post.description,
  ogUrl: pageUrl.value,
  ogType: 'article'
})

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: post.title,
        description: post.description,
        url: pageUrl.value,
        inLanguage: locale.value === 'fr' ? 'fr-FR' : 'en-US',
        learningResourceType: 'Lesson',
        isPartOf: {
          '@type': 'Course',
          name: locale.value === 'fr' ? 'Roadmap Spring Boot' : 'Spring Boot Roadmap',
          url: locale.value === 'fr' ? `${config.public.siteUrl}/fr/spring-boot` : `${config.public.siteUrl}/spring-boot`
        },
        position: currentStep.value?.id
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale.value === 'fr' ? 'Roadmaps' : 'Roadmaps',
            item: `${config.public.siteUrl}${localePath('/roadmaps')}`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: locale.value === 'fr' ? 'Roadmap Spring Boot' : 'Spring Boot Roadmap',
            item: `${config.public.siteUrl}${localePath('/spring-boot')}`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: pageUrl.value
          }
        ]
      })
    }
  ]
}))
</script>

<template>
  <article class="blog-article-main space-y-6">
      <header class="space-y-3 border-b border-zinc-800 pb-6">
        <NuxtLink
          :to="localePath('/spring-boot')"
          class="button-like inline-flex items-center gap-2 border border-zinc-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300 no-underline hover:border-white hover:bg-white hover:text-black"
        >
          <span>←</span>
          <span>{{ ui.back }}</span>
        </NuxtLink>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{{ ui.stepLabel }}</p>
        <h1 class="text-3xl font-bold leading-tight sm:text-4xl">{{ post.title }}</h1>
        <p class="text-zinc-300">{{ post.description }}</p>
        <div class="flex flex-wrap gap-2">
          <TagPill v-for="tag in visibleTags" :key="tag" :label="tag" />
        </div>
      </header>

      <nav class="border border-zinc-700 p-4" :aria-label="ui.toc">
        <p class="text-xs uppercase tracking-wide text-zinc-400">{{ ui.toc }}</p>
        <ul v-if="post.body?.toc?.links?.length" class="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="(item, index) in post.body.toc.links" :key="item.id" class="flex items-start gap-2">
            <span class="inline-flex h-5 min-w-5 shrink-0 items-center justify-center border border-zinc-700 px-1 font-mono text-[10px] leading-none text-zinc-400">{{ index + 1 }}</span>
            <a :href="`#${item.id}`" class="min-w-0 no-underline hover:underline">{{ item.text }}</a>
          </li>
        </ul>
        <p v-else class="mt-3 text-sm text-zinc-400">{{ ui.noHeadings }}</p>
      </nav>

      <ContentRenderer :value="post" class="prose prose-invert blog-prose max-w-none" />

      <nav class="grid gap-4 border-t border-zinc-800 pt-6 sm:grid-cols-2" :aria-label="ui.navAria">
        <NuxtLink
          v-if="prevPost"
          :to="localePath(prevPost.path)"
          class="button-like border border-zinc-700 p-4 no-underline hover:bg-white hover:text-black"
        >
          <p class="text-xs uppercase text-zinc-400">{{ ui.previous }}</p>
          <p class="text-base font-semibold">{{ prevPost.title }}</p>
        </NuxtLink>
        <NuxtLink
          v-if="nextPost"
          :to="localePath(nextPost.path)"
          class="button-like border border-zinc-700 p-4 no-underline hover:bg-white hover:text-black"
        >
          <p class="text-xs uppercase text-zinc-400">{{ ui.next }}</p>
          <p class="text-base font-semibold">{{ nextPost.title }}</p>
        </NuxtLink>
      </nav>
  </article>
</template>
