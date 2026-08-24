<script setup lang="ts">
import type { BlogPost } from '~/composables/usePosts'

type BlogDocument = BlogPost & Record<string, unknown>

const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()
const slug = computed(() => route.params.slug as string[])
const path = computed(() => `/blog/${slug.value.join('/')}`)
const frenchPath = computed(() => `/blog-fr/${slug.value.join('/')}`)
const isFrenchRoute = computed(() => locale.value === 'fr' || route.path.startsWith('/fr/'))

const queryCollectionLoose = queryCollection as unknown as (collection: string) => {
  path: (value: string) => { first: () => Promise<BlogDocument | null> }
}

const englishPost = await queryCollection('posts').path(path.value).first() as BlogDocument | null

if (!englishPost) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

const frenchPost = isFrenchRoute.value
  ? await queryCollectionLoose('postsFr').path(frenchPath.value).first()
  : null

const post = ((): BlogDocument => {
  if (!isFrenchRoute.value) {
    return englishPost
  }

  if (frenchPost) {
    return {
      ...englishPost,
      ...frenchPost,
      path: englishPost.path,
      date: frenchPost.date || englishPost.date,
      tags: Array.isArray(frenchPost.tags) && frenchPost.tags.length > 0
        ? frenchPost.tags
        : englishPost.tags,
      cover: frenchPost.cover || englishPost.cover,
      readingTime: frenchPost.readingTime || englishPost.readingTime
    }
  }

  return {
    ...englishPost,
    title: englishPost.titleFr || englishPost.title,
    description: englishPost.descriptionFr || englishPost.description
  }
})()

const allPosts = await usePosts(locale.value)
const currentIndex = allPosts.findIndex((item) => item.path === englishPost.path)
const prevPost = computed(() => (currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null))
const nextPost = computed(() => (currentIndex > 0 ? allPosts[currentIndex - 1] : null))
const coverUrl = computed(() => post.cover || '/banner-test.jpg')
const seoTitle = computed(() => post.title)
const seoDescription = computed(() => post.description)
const coverAlt = computed(() => (
  isFrenchRoute.value
    ? post.coverAltFr || post.coverAlt || `${seoTitle.value} cover image`
    : post.coverAlt || `${seoTitle.value} cover image`
))
const visibleTags = computed(() => (post.tags || []).slice(0, 4))
const publishedOn = computed(() => new Date(post.date).toLocaleDateString(isFrenchRoute.value ? 'fr-FR' : 'en-US'))

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => `${seoTitle.value} | Briac // Terminal Portfolio`,
  ogDescription: () => seoDescription.value,
  ogImage: coverUrl.value,
  ogImageAlt: () => coverAlt.value,
  ogLocale: () => isFrenchRoute.value ? 'fr_FR' : 'en_US',
  twitterCard: 'summary_large_image',
  twitterImage: coverUrl.value,
  twitterImageAlt: () => coverAlt.value
})
</script>

<template>
  <article class="blog-article-main space-y-6">
      <header class="space-y-3 border-b border-zinc-800 pb-6">
        <NuxtImg
          :src="coverUrl"
          :alt="coverAlt"
          class="mb-4 w-full rounded-none border border-zinc-700 object-cover aspect-[16/6]"
          loading="lazy"
          format="webp"
        />
        <p class="text-xs uppercase tracking-wide text-zinc-400">{{ publishedOn }}</p>
        <h1 class="text-3xl font-bold leading-tight sm:text-4xl">{{ post.title }}</h1>
        <p class="text-zinc-300">{{ post.description }}</p>
        <div class="flex flex-wrap gap-2">
          <TagPill v-for="tag in visibleTags" :key="tag" :label="tag" />
        </div>
      </header>

      <nav class="border border-zinc-700 p-4" :aria-label="t('blogDetail.toc')">
        <p class="text-xs uppercase tracking-wide text-zinc-400">{{ t('blogDetail.toc') }}</p>
        <ul v-if="post.body?.toc?.links?.length" class="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="(item, index) in post.body.toc.links" :key="item.id" class="flex items-start gap-2">
            <span class="inline-flex h-5 min-w-5 shrink-0 items-center justify-center border border-zinc-700 px-1 font-mono text-[10px] leading-none text-zinc-400">{{ index + 1 }}</span>
            <a :href="`#${item.id}`" class="min-w-0 no-underline hover:underline">{{ item.text }}</a>
          </li>
        </ul>
        <p v-else class="mt-3 text-sm text-zinc-400">{{ t('blogDetail.noHeadings') }}</p>
      </nav>

      <ContentRenderer :value="post" class="prose prose-invert blog-prose max-w-none" />

      <nav class="grid gap-4 border-t border-zinc-800 pt-6 sm:grid-cols-2" :aria-label="t('blogDetail.navigationAria')">
        <NuxtLink
          v-if="prevPost"
          :to="localePath(prevPost.path)"
          class="button-like border border-zinc-700 p-4 no-underline hover:bg-white hover:text-black"
        >
          <p class="text-xs uppercase text-zinc-400">{{ t('blogDetail.previous') }}</p>
          <p class="text-base font-semibold">{{ prevPost.title }}</p>
        </NuxtLink>
        <NuxtLink
          v-if="nextPost"
          :to="localePath(nextPost.path)"
          class="button-like border border-zinc-700 p-4 no-underline hover:bg-white hover:text-black"
        >
          <p class="text-xs uppercase text-zinc-400">{{ t('blogDetail.next') }}</p>
          <p class="text-base font-semibold">{{ nextPost.title }}</p>
        </NuxtLink>
      </nav>
  </article>
</template>
