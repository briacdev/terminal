<script setup lang="ts">
import { useI18n, useLocalePath } from '#i18n'

const props = defineProps<{
  roadmapName: string
  searchTerms: string[]
  searchQuery?: string
}>()

const { locale } = useI18n()
const localePath = useLocalePath()
const posts = await usePosts(locale.value)

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const matchesTitle = (title: string, term: string) => {
  const normalizedTitle = title.toLowerCase()
  const normalizedTerm = term.toLowerCase().trim()

  if (!normalizedTerm) {
    return false
  }

  if (normalizedTerm.includes(' ')) {
    return normalizedTitle.includes(normalizedTerm)
  }

  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedTerm)}([^a-z0-9]|$)`, 'i')
  return pattern.test(normalizedTitle)
}

const relatedPosts = computed(() => posts
  .filter((post) => props.searchTerms.some((term) => matchesTitle(post.title, term)))
  .slice(0, 3))

const viewAllTarget = computed(() => localePath({
  path: '/blog',
  query: {
    search: props.searchQuery || props.searchTerms[0] || props.roadmapName.toLowerCase()
  }
}))

const ui = computed(() => locale.value === 'fr'
  ? {
      kicker: 'Articles du blog',
      title: `En lien avec ${props.roadmapName}`,
      description: `Une sélection de trois articles du blog dont le titre contient ${props.roadmapName}.`,
      viewAll: 'Voir tout'
    }
  : {
      kicker: 'From the Blog',
      title: `Related to ${props.roadmapName}`,
      description: `A selection of three blog posts whose title contains ${props.roadmapName}.`,
      viewAll: 'View all'
    }
)
</script>

<template>
  <section v-if="relatedPosts.length" class="brutal-panel-dark p-5 sm:p-6">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <p class="section-kicker">{{ ui.kicker }}</p>
        <h2 class="section-title">{{ ui.title }}</h2>
        <p class="mt-2 max-w-3xl text-sm text-zinc-400">{{ ui.description }}</p>
      </div>
      <NuxtLink class="button-like section-link" :to="viewAllTarget">{{ ui.viewAll }}</NuxtLink>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <PostCard v-for="post in relatedPosts" :key="post.path" :post="post" />
    </div>
  </section>
</template>
