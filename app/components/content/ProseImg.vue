<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

withDefaults(defineProps<{
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
}>(), {
  src: '',
  alt: ''
})
</script>

<template>
  <NuxtImg
    v-if="src"
    v-bind="$attrs"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    class="my-6 w-full rounded-none border border-zinc-700 object-cover"
    loading="lazy"
    format="webp"
  />
</template>
