<script setup lang="ts">
import { useI18n } from '#i18n'

const route = useRoute()
const initialSearch = typeof route.query.search === 'string' ? route.query.search : ''
const search = ref(initialSearch)
const activeTag = ref<string | null>(null)
const { t, locale } = useI18n()
const posts = await usePosts(locale.value)

const allTags = computed(() => {
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b))
})

const filteredPosts = computed(() => {
  const term = search.value.trim().toLowerCase()

  return posts.filter((post) => {
    const matchTerm =
      !term || (
      post.title.toLowerCase().includes(term) ||
      post.description.toLowerCase().includes(term) ||
      post.tags.join(' ').toLowerCase().includes(term)
    )

    const matchTag = !activeTag.value || post.tags.includes(activeTag.value)

    return matchTerm && matchTag
  })
})

const visibleCountLabel = computed(() => {
  if (filteredPosts.value.length > 1 || filteredPosts.value.length === 0) {
    return t('blog.visiblePlural', { count: filteredPosts.value.length })
  }

  return t('blog.visibleSingle', { count: filteredPosts.value.length })
})

useSeoMeta({
  title: () => t('blog.seo.title'),
  description: () => t('blog.seo.description'),
  ogTitle: () => t('blog.seo.ogTitle'),
  ogDescription: () => t('blog.seo.description')
})
</script>

<template>
  <section class="space-y-8">
    <div class="space-y-3 border border-zinc-700 bg-zinc-950 p-5 sm:p-7">
      <p class="section-kicker">{{ t('blog.kicker') }}</p>
      <h1 class="text-3xl font-black uppercase tracking-tight sm:text-5xl">{{ t('blog.title') }}</h1>
      <p class="max-w-3xl text-zinc-300">
        {{ t('blog.description') }}
      </p>
    </div>

    <div class="space-y-4 border border-zinc-700 bg-zinc-950 p-5 sm:p-6">
      <SearchInput v-model="search" :placeholder="t('blog.searchPlaceholder')" />
      <div class="flex flex-wrap gap-2">
        <button
          class="button-like tag-filter-btn border px-3 py-1 text-sm"
          :class="!activeTag ? 'bg-white text-black border-white' : 'border-zinc-700 hover:bg-white hover:text-black'"
          @click="activeTag = null"
        >
          {{ t('blog.all') }}
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
      <PostCard v-for="post in filteredPosts" :key="post.path" :post="post" />
    </div>

    <p v-if="!filteredPosts.length" class="border border-zinc-700 p-4 text-zinc-400">
      {{ t('blog.empty') }}
    </p>
  </section>
</template>
