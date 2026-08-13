---
title: "Components, Props, and Events"
description: "Split a Vue UI into child components, pass data down with typed props, and send actions up with emit. One-way data flow without extra libraries."
date: 2026-04-07
tags: ["vue", "props", "emit", "components"]
draft: false
readingTime: "9 min"
---

## One-way data flow

Vue components communicate in two directions:

- **Props** go down: parent to child
- **Events** go up: child to parent

The parent owns the data. The child never mutates a prop. If the child needs a change, it emits an event and the parent updates the source.

This page is props and emits. Slots are the next page.

## Define typed props

```vue
<script setup lang="ts">
interface TaskCardProps {
  title: string
  done?: boolean
}

const props = withDefaults(defineProps<TaskCardProps>(), {
  done: false
})
</script>

<template>
  <article>
    <h2>{{ props.title }}</h2>
    <p v-if="props.done">Completed</p>
  </article>
</template>
```

In the template you can also write `{{ title }}` because props are unwrapped. In script, `props.title` is explicit and easier to search.

Optional props need a default via `withDefaults`, or the parent must pass them.

## Emit events

```vue
<script setup lang="ts">
const emit = defineEmits<{
  complete: [id: string]
  rename: [id: string, title: string]
}>()

const handleComplete = (id: string) => {
  emit('complete', id)
}
</script>

<template>
  <button type="button" @click="handleComplete('t1')">Mark done</button>
</template>
```

The parent listens with `v-on`:

```vue
<TaskCard
  :title="task.title"
  :done="task.done"
  @complete="handleTaskComplete"
/>
```

Name events like DOM events: `complete`, `update:title`. Avoid `onComplete` as the emit name.

## Do not mutate props

This is wrong:

```ts
props.done = true
```

Vue will warn in development. Emit instead, or use a local `ref` initialized from the prop if the child needs a draft value that is not yet saved.

For true two-way binding on a custom input, wait for the `v-model` page and `defineModel`.

## When to split a component

Split when:

- a block is reused in two places
- a template is hard to scan because it mixes list, form, and header
- you want to test a piece in isolation

Do not split every `<button>`. A component should earn its file.

## Checklist

- Props are typed and have defaults when optional
- Children emit events instead of writing to props
- The parent is the source of truth
- Event names are short and past-tense or noun-like, not `onX`

## Official sources

- [Props](https://vuejs.org/guide/components/props.html)
- [Events](https://vuejs.org/guide/components/events.html)
- [Component basics](https://vuejs.org/guide/essentials/component-basics.html)
