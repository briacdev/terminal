---
title: "Fetching Data in Vue"
description: "Fetch APIs in Vue 3 with loading and error states, reload on route param changes, and cancel in-flight requests so the UI does not flicker or race."
date: 2026-04-13
tags: ["vue", "fetch", "async", "api"]
draft: false
readingTime: "10 min"
---

## Vue does not fetch for you

There is no built-in `useFetch` in a Vite Vue SPA. That helper is a Nuxt API. In Vue you call `fetch` (or `ofetch` / `axios`) inside a composable or a view, and you model **idle / loading / success / error** yourself.

This page stays on the client. Server-side data loading belongs to the Nuxt roadmap.

## A composable that does not lie about state

```ts
// src/composables/useProject.ts
import { ref } from 'vue'

interface Project {
  id: string
  name: string
}

export const useProject = () => {
  const project = ref<Project | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const handleLoad = async (id: string, signal?: AbortSignal) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await fetch(`/api/projects/${id}`, { signal })

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`)
      }

      project.value = await response.json() as Project
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      project.value = null
      errorMessage.value = 'Could not load this project.'
    } finally {
      isLoading.value = false
    }
  }

  return { project, isLoading, errorMessage, handleLoad }
}
```

The template can then show a spinner, an alert, or the name. Never leave the previous project on screen while a new id loads without a visual reset.

## Reload when the route changes

```vue
<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProject } from '@/composables/useProject'

const route = useRoute()
const { project, isLoading, errorMessage, handleLoad } = useProject()
let abortController: AbortController | null = null

watch(
  () => route.params.id,
  (id) => {
    abortController?.abort()
    abortController = new AbortController()

    if (typeof id !== 'string') {
      return
    }

    void handleLoad(id, abortController.signal)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  abortController?.abort()
})
</script>
```

`immediate: true` covers the first visit. Aborting the previous request avoids a race: a slow response for id `1` must not overwrite id `2`.

## Flicker and empty states

- Set `isLoading` true **before** clearing useful data, or keep a skeleton of the previous page with a dim overlay
- Do not toast on every abort
- Map HTTP 404 to a dedicated empty view, not a generic "network error"

## Where the call lives

| Place | Use when |
| --- | --- |
| View + composable | One route owns the resource |
| Pinia action | Two routes must share the cached entity |
| Child component | The child is the only consumer and receives an id prop |

Do not fetch in a presentational button component.

## Checklist

- Loading, error, and data are three separate refs
- Route param changes retrigger the request
- In-flight requests are aborted
- You did not copy Nuxt `useFetch` into a Vite app and expect SSR

## Official sources

- [Vue: Watchers](https://vuejs.org/guide/essentials/watchers.html)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
