<script setup lang="ts">
import type { BlogPost } from '~/composables/usePosts'

const route = useRoute()
const slug = computed(() => route.params.slug as string[])
const path = computed(() => `/blog/${slug.value.join('/')}`)

const post = await queryCollection('posts').path(path.value).first() as BlogPost | null

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

const allPosts = await usePosts()
const currentIndex = allPosts.findIndex((item) => item.path === post.path)
const prevPost = computed(() => (currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null))
const nextPost = computed(() => (currentIndex > 0 ? allPosts[currentIndex - 1] : null))
const coverUrl = computed(() => post.cover || '/banner-test.jpg')
const visibleTags = computed(() => (post.tags || []).slice(0, 4))

useSeoMeta({
  title: post.title,
  description: post.description,
  ogTitle: `${post.title} | Briac // Terminal Portfolio`,
  ogDescription: post.description
})
</script>

<template>
  <article class="blog-article-grid grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
    <div class="blog-article-main space-y-6">
      <header class="space-y-3 border-b border-zinc-800 pb-6">
        <NuxtImg
          :src="coverUrl"
          :alt="`${post.title} cover image`"
          class="mb-4 w-full rounded-none border border-zinc-700 object-cover aspect-[16/6]"
          loading="lazy"
          format="webp"
        />
        <p class="text-xs uppercase tracking-wide text-zinc-400">{{ new Date(post.date).toLocaleDateString('fr-FR') }}</p>
        <h1 class="text-3xl font-bold leading-tight sm:text-4xl">{{ post.title }}</h1>
        <p class="max-w-3xl text-zinc-300">{{ post.description }}</p>
        <div class="flex flex-wrap gap-2">
          <TagPill v-for="tag in visibleTags" :key="tag" :label="tag" />
        </div>
      </header>

      <ContentRenderer :value="post" class="prose prose-invert blog-prose max-w-none" />

      <nav class="grid gap-4 border-t border-zinc-800 pt-6 sm:grid-cols-2" aria-label="Article navigation">
        <NuxtLink
          v-if="prevPost"
          :to="prevPost.path"
          class="button-like border border-zinc-700 p-4 no-underline hover:bg-white hover:text-black"
        >
          <p class="text-xs uppercase text-zinc-400">Previous</p>
          <p class="text-base font-semibold">{{ prevPost.title }}</p>
        </NuxtLink>
        <NuxtLink
          v-if="nextPost"
          :to="nextPost.path"
          class="button-like border border-zinc-700 p-4 no-underline hover:bg-white hover:text-black"
        >
          <p class="text-xs uppercase text-zinc-400">Next</p>
          <p class="text-base font-semibold">{{ nextPost.title }}</p>
        </NuxtLink>
      </nav>
    </div>

    <aside class="space-y-3 lg:sticky lg:top-24 lg:self-start">
      <p class="text-xs uppercase tracking-wide text-zinc-400">Table of contents</p>
      <ul v-if="post.body?.toc?.links?.length" class="space-y-2 border border-zinc-700 p-4 text-sm">
        <li v-for="item in post.body.toc.links" :key="item.id">
          <a :href="`#${item.id}`" class="no-underline hover:underline">{{ item.text }}</a>
        </li>
      </ul>
      <p v-else class="border border-zinc-700 p-4 text-sm text-zinc-400">No headings in this post.</p>
    </aside>
  </article>
</template>
