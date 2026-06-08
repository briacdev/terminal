<script setup lang="ts">
import { useI18n, useLocalePath } from '#i18n'

interface JavaRoadmapPost {
  path: string
  title: string
  description: string
  date: string
  tags?: string[]
  draft?: boolean
  readingTime?: string
  body?: {
    toc?: {
      links?: Array<{
        id: string
        text: string
      }>
    }
  }
}

const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

const slug = computed(() => route.params.slug as string[])
const path = computed(() => `/java/${slug.value.join('/')}`)
const legacyEnPath = computed(() => `/roadmaps/java/${slug.value.join('/')}`)
const legacyFrPath = computed(() => `/roadmaps-fr/java/${slug.value.join('/')}`)

const queryCollectionLoose = queryCollection as unknown as (collection: string) => {
  path: (value: string) => { first: () => Promise<JavaRoadmapPost | null> }
  where: (field: string, operator: '=', value: boolean) => { all: () => Promise<JavaRoadmapPost[]> }
}

let post: JavaRoadmapPost | null = null

if (locale.value === 'fr') {
  post = await queryCollectionLoose('roadmapsFr').path(path.value).first()
  if (!post) {
    post = await queryCollectionLoose('roadmapsFr').path(legacyFrPath.value).first()
  }
}

if (!post) {
  post = await queryCollection('roadmaps').path(path.value).first() as JavaRoadmapPost | null
  if (!post) {
    post = await queryCollection('roadmaps').path(legacyEnPath.value).first() as JavaRoadmapPost | null
  }
}

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Java roadmap article not found' })
}

const normalizeJavaPath = (value: string) => {
  if (value.startsWith('/java/')) {
    return value
  }
  if (value.startsWith('/roadmaps/java/')) {
    return value.replace('/roadmaps/java/', '/java/')
  }
  if (value.startsWith('/roadmaps-fr/java/')) {
    return value.replace('/roadmaps-fr/java/', '/java/')
  }
  return value
}

const rawPosts = locale.value === 'fr'
  ? await queryCollectionLoose('roadmapsFr').where('draft', '=', false).all()
  : await queryCollection('roadmaps').where('draft', '=', false).all() as JavaRoadmapPost[]

const javaPosts = rawPosts
  .filter((item) =>
    item.path.startsWith('/java/') ||
    item.path.startsWith('/roadmaps/java/') ||
    item.path.startsWith('/roadmaps-fr/java/')
  )
  .map((item) => ({ ...item, path: normalizeJavaPath(item.path) }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const currentIndex = computed(() => javaPosts.findIndex((item) => item.path === normalizeJavaPath(post.path)))
const prevPost = computed(() => (currentIndex.value < javaPosts.length - 1 ? javaPosts[currentIndex.value + 1] : null))
const nextPost = computed(() => (currentIndex.value > 0 ? javaPosts[currentIndex.value - 1] : null))
const visibleTags = computed(() => (post.tags || []).slice(0, 4))

const ui = computed(() => locale.value === 'fr'
  ? {
      back: 'Retour à la roadmap Java',
      previous: 'Précédent',
      next: 'Suivant',
      toc: 'Table des matières',
      noHeadings: 'Aucun titre dans cet article.',
      navAria: 'Navigation des articles de roadmap Java'
    }
  : {
      back: 'Back to Java Roadmap',
      previous: 'Previous',
      next: 'Next',
      toc: 'Table of contents',
      noHeadings: 'No headings in this post.',
      navAria: 'Java roadmap article navigation'
    }
)

useSeoMeta({
  title: post.title,
  description: post.description,
  ogTitle: `${post.title} | Briac`,
  ogDescription: post.description
})
</script>

<template>
  <article class="blog-article-main space-y-6">
      <header class="space-y-3 border-b border-zinc-800 pb-6">
        <NuxtLink
          :to="localePath('/java')"
          class="button-like inline-flex items-center gap-2 border border-zinc-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300 no-underline hover:border-white hover:bg-white hover:text-black"
        >
          <span>←</span>
          <span>{{ ui.back }}</span>
        </NuxtLink>
        <h1 class="text-3xl font-bold leading-tight sm:text-4xl">{{ post.title }}</h1>
        <p class="text-zinc-300">{{ post.description }}</p>
        <div class="flex flex-wrap gap-2">
          <TagPill v-for="tag in visibleTags" :key="tag" :label="tag" />
        </div>
      </header>

      <nav class="border border-zinc-700 p-4" :aria-label="ui.toc">
        <p class="text-xs uppercase tracking-wide text-zinc-400">{{ ui.toc }}</p>
        <ul v-if="post.body?.toc?.links?.length" class="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="item in post.body.toc.links" :key="item.id">
            <a :href="`#${item.id}`" class="no-underline hover:underline">{{ item.text }}</a>
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
