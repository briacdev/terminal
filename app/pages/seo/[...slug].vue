<script setup lang="ts">
import { useI18n, useLocalePath } from "#i18n"
import type { SeoRoadmapPost } from "../../composables/useSeoRoadmaps"
import { normalizeSeoRoadmapPath } from "../../data/seo-roadmap"

const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

const slug = computed(() => route.params.slug as string[])
const path = computed(() => `/seo/${slug.value.join("/")}`)
const legacyEnPath = computed(() => `/roadmaps/seo/${slug.value.join("/")}`)
const legacyFrPath = computed(() => `/roadmaps-fr/seo/${slug.value.join("/")}`)

const queryCollectionLoose = queryCollection as unknown as (collection: string) => {
  path: (value: string) => { first: () => Promise<SeoRoadmapPost | null> }
}

let post: SeoRoadmapPost | null = null

if (locale.value === "fr") {
  post = await queryCollectionLoose("roadmapsFr").path(path.value).first()
  if (!post) {
    post = await queryCollectionLoose("roadmapsFr").path(legacyFrPath.value).first()
  }
}

if (!post) {
  post = (await queryCollection("roadmaps").path(path.value).first()) as SeoRoadmapPost | null
  if (!post) {
    post = (await queryCollection("roadmaps").path(legacyEnPath.value).first()) as SeoRoadmapPost | null
  }
}

if (!post) {
  throw createError({ statusCode: 404, statusMessage: "SEO roadmap article not found" })
}

const allPosts = await useSeoRoadmaps()
const currentIndex = computed(() => allPosts.findIndex((item: SeoRoadmapPost) => item.path === normalizeSeoRoadmapPath(post.path)))
const prevPost = computed(() => (currentIndex.value > 0 ? allPosts[currentIndex.value - 1] : null))
const nextPost = computed(() => (currentIndex.value < allPosts.length - 1 ? allPosts[currentIndex.value + 1] : null))
const visibleTags = computed(() => (post.tags || []).slice(0, 4))

const ui = computed(() =>
  locale.value === "fr"
    ? {
        back: "Retour à la roadmap SEO",
        previous: "Précédent",
        next: "Suivant",
        toc: "Table des matières",
        noHeadings: "Aucun titre dans cette page.",
        navAria: "Navigation des pages de la roadmap SEO"
      }
    : {
        back: "Back to SEO Roadmap",
        previous: "Previous",
        next: "Next",
        toc: "Table of contents",
        noHeadings: "No headings in this page.",
        navAria: "SEO roadmap article navigation"
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
          :to="localePath('/seo')"
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
