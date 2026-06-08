<script setup lang="ts">
defineProps<{ id?: string }>()
</script>

<template>
  <h6 :id="id">
    <slot />
  </h6>
</template>
