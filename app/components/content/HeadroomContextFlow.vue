<script setup lang="ts">
const pipeline = [
  { title: 'CacheAligner', detail: 'stable prefix' },
  { title: 'ContentRouter', detail: 'content type' },
  { title: 'IntelligentContext', detail: 'token budget' },
  { title: 'CCR', detail: 'cache + retrieve' }
]
</script>

<template>
  <UCard
    class="not-prose my-6 rounded-none border-2 border-zinc-700 bg-black"
    :ui="{ body: 'p-4 sm:p-5' }"
  >
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Context flow</p>
        <h3 class="mt-1 text-base font-bold uppercase tracking-[0.04em] text-zinc-100">Agent -> Headroom -> LLM</h3>
      </div>
      <UBadge color="neutral" variant="outline" class="rounded-none border-zinc-600 text-[10px] uppercase tracking-[0.14em] text-zinc-300">
        local proxy
      </UBadge>
    </div>

    <div class="grid gap-3 lg:grid-cols-[1fr_auto_1.7fr_auto_1fr] lg:items-stretch">
      <section class="border border-zinc-800 bg-zinc-950 p-3">
        <div class="mb-2 flex items-center gap-2">
          <UIcon name="i-lucide-terminal" class="size-4 text-zinc-300" />
          <p class="text-sm font-bold text-zinc-100">Agent</p>
        </div>
        <p class="text-xs leading-5 text-zinc-400">tools, files, logs, RAG chunks</p>
      </section>

      <div class="hidden items-center text-zinc-600 lg:flex">
        <UIcon name="i-lucide-arrow-right" class="size-5" />
      </div>

      <section class="border-2 border-zinc-600 bg-zinc-950 p-3">
        <div class="mb-3 flex items-center justify-between gap-2">
          <p class="text-sm font-bold uppercase tracking-[0.08em] text-white">Headroom</p>
          <span class="text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300">compression</span>
        </div>
        <ol class="grid gap-2 sm:grid-cols-2">
          <li
            v-for="(step, index) in pipeline"
            :key="step.title"
            class="grid grid-cols-[1.5rem_1fr] gap-2 border border-zinc-800 bg-black p-2"
          >
            <span class="text-xs font-bold text-zinc-500">{{ index + 1 }}</span>
            <span>
              <span class="block text-xs font-bold text-zinc-100">{{ step.title }}</span>
              <span class="block text-[11px] leading-4 text-zinc-500">{{ step.detail }}</span>
            </span>
          </li>
        </ol>
      </section>

      <div class="hidden items-center text-zinc-600 lg:flex">
        <UIcon name="i-lucide-arrow-right" class="size-5" />
      </div>

      <section class="border border-zinc-800 bg-zinc-950 p-3">
        <div class="mb-2 flex items-center gap-2">
          <UIcon name="i-lucide-brain-circuit" class="size-4 text-zinc-300" />
          <p class="text-sm font-bold text-zinc-100">LLM</p>
        </div>
        <p class="text-xs leading-5 text-zinc-400">fewer tokens, originals recoverable by hash</p>
      </section>
    </div>
  </UCard>
</template>
