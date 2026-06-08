<script setup lang="ts">
const rows = [
  { label: 'Code search', before: 17765, after: 1408, savings: 92 },
  { label: 'SRE debugging', before: 65694, after: 5118, savings: 92 },
  { label: 'GitHub triage', before: 54174, after: 14761, savings: 73 },
  { label: 'Codebase exploration', before: 78502, after: 41254, savings: 47 }
]

const formatTokens = (value: number) => new Intl.NumberFormat('en-US').format(value)
</script>

<template>
  <UCard
    class="not-prose my-6 rounded-none border-2 border-zinc-700 bg-black"
    :ui="{ body: 'p-4 sm:p-5' }"
  >
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Public benchmarks</p>
        <h3 class="mt-1 text-base font-bold uppercase tracking-[0.04em] text-zinc-100">Tokens before / after</h3>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-left text-sm">
        <thead>
          <tr class="border-b border-zinc-800 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            <th class="py-2 pr-4 font-semibold">Use case</th>
            <th class="px-4 py-2 text-right font-semibold">Before</th>
            <th class="px-4 py-2 text-right font-semibold">After</th>
            <th class="py-2 pl-4 text-right font-semibold">Savings</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.label"
            class="border-b border-zinc-900 last:border-b-0"
          >
            <td class="py-2.5 pr-4 font-semibold text-zinc-100">{{ row.label }}</td>
            <td class="px-4 py-2.5 text-right text-zinc-400">{{ formatTokens(row.before) }}</td>
            <td class="px-4 py-2.5 text-right text-cyan-200">{{ formatTokens(row.after) }}</td>
            <td class="py-2.5 pl-4 text-right font-bold text-zinc-100">-{{ row.savings }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-3 text-[11px] leading-4 text-zinc-500">
      Order-of-magnitude figures from public Headroom examples. Measure on your own data.
    </p>
  </UCard>
</template>
