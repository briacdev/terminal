<script setup lang="ts">
defineProps<{ id?: string }>()
</script>

<template>
  <h5 :id="id">
    <slot />
  </h5>
</template>
