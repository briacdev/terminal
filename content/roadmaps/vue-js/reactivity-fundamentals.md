---
title: "Reactivity with ref and reactive"
description: "Learn Vue 3 reactivity: when to use ref versus reactive, how .value works, and how to avoid losing reactivity when you destructure objects."
date: 2026-04-05
tags: ["vue", "reactivity", "ref", "composition-api"]
draft: false
readingTime: "10 min"
---

## What reactivity means in Vue 3

Vue tracks which values a component reads while rendering. When those values change, Vue re-renders that component. You do not call `setState`. You assign a new value to a `ref` or mutate a `reactive` object.

This page is only `ref` and `reactive`. `computed` and `watch` are the next step.

## ref: the default choice

`ref` wraps any value: string, number, boolean, object, array.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const title = ref('Inbox')

const handleIncrement = () => {
  count.value += 1
}
</script>

<template>
  <button type="button" @click="handleIncrement">
    {{ title }} · {{ count }}
  </button>
</template>
```

In script, you read and write `.value`. In the template, Vue unwraps refs for you, so you write `{{ count }}`, not `{{ count.value }}`.

Use `ref` for almost everything in new Vue 3 code. It stays reactive if you replace the whole value:

```ts
const user = ref<{ id: string; name: string } | null>(null)
user.value = { id: 'u1', name: 'Ada' }
```

## reactive: object state without .value

`reactive` takes an object and returns a reactive proxy. There is no `.value`.

```ts
import { reactive } from 'vue'

const form = reactive({
  email: '',
  rememberMe: false
})

form.email = 'ada@example.com'
```

Limits you must remember:

- `reactive` only works on objects (not `string` / `number`)
- destructuring `const { email } = form` **drops reactivity**
- replacing the whole object (`form = { ... }`) is not possible; the binding is const

Prefer `ref` when the value might be replaced. Use `reactive` for a form or a local object you will mutate in place.

## toRefs and toRef

If you must destructure a reactive object, wrap properties:

```ts
import { reactive, toRefs } from 'vue'

const form = reactive({ email: '', name: '' })
const { email, name } = toRefs(form)
email.value = 'ada@example.com'
```

`toRef(form, 'email')` creates one ref linked to that property.

## Nested data

Both `ref` and `reactive` deep-track nested objects by default. You rarely need `shallowRef` unless you hold a large third-party instance (a map, a chart, a WebGL context).

## Common traps

- Forgetting `.value` in script (`count++` does nothing useful on a ref object)
- Destructuring `reactive` state into plain variables
- Wrapping a `ref` inside `reactive` and then being surprised by extra unwrapping
- Storing a non-reactive copy: `const snapshot = { ...user.value }` will not update the UI

## Checklist

- You use `ref` as the default reactive primitive
- You only touch `.value` in script, not in the template
- You know why destructuring `reactive` breaks updates
- You can replace an object held in a `ref`

## Official sources

- [Reactivity fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [ref vs reactive](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive)
- [Reactivity in depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
