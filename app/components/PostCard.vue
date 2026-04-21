<script setup lang="ts">
const props = defineProps<{
  post: {
    path: string
    title: string
    description: string
    date?: string
    cover?: string
    tags?: string[]
    readingTime?: string
  }
}>()

const visibleTags = computed(() => (props.post.tags || []).slice(0, 4))
</script>

<template>
  <article class="brutal-card group flex h-full flex-col p-3">
    <NuxtLink :to="post.path" class="mb-3 block no-underline">
      <NuxtImg
        :src="post.cover || '/banner-test.jpg'"
        :alt="`${post.title} banner`"
        class="h-24 w-full border border-zinc-700 object-cover"
        loading="lazy"
        format="webp"
      />
    </NuxtLink>

    <p v-if="post.date" class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
      {{ new Date(post.date).toLocaleDateString('fr-FR') }}
      <span v-if="post.readingTime"> · {{ post.readingTime }}</span>
    </p>

    <h3 class="mb-2 text-lg font-bold uppercase leading-tight">
      <NuxtLink :to="post.path" class="no-underline">
        {{ post.title }}
      </NuxtLink>
    </h3>

    <p class="mb-4 text-sm leading-6 text-zinc-300">{{ post.description }}</p>

    <div class="mt-auto flex items-end justify-between gap-3">
      <div class="flex flex-wrap gap-2">
        <TagPill v-for="tag in visibleTags" :key="tag" :label="tag" />
      </div>
      <NuxtLink :to="post.path" class="card-open-link text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 no-underline transition group-hover:text-white">
        open &gt;
      </NuxtLink>
    </div>
  </article>
</template>
