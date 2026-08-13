---
title: "Forms and v-model"
description: "Bind Vue form inputs with v-model, handle checkboxes and selects, validate a simple flow, and use defineModel for custom field components."
date: 2026-04-10
tags: ["vue", "forms", "v-model", "defineModel"]
draft: false
readingTime: "9 min"
---

## v-model is sugar for value plus input

On a native input, `v-model` means: bind `value` and listen to `input` (or `change` for some controls). You still own the state in a `ref`.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
</script>

<template>
  <label>
    Email
    <input v-model.trim="email" type="email" autocomplete="email">
  </label>
</template>
```

Modifiers you will use:

- `.trim` strips whitespace
- `.number` casts to number (empty input becomes `0` or `NaN`; validate yourself)
- `.lazy` updates on `change` instead of every `input`

## Checkboxes, radios, selects

```vue
<script setup lang="ts">
import { ref } from 'vue'

const rememberMe = ref(false)
const plan = ref<'free' | 'pro'>('free')
const stacks = ref<string[]>([])
</script>

<template>
  <label><input v-model="rememberMe" type="checkbox"> Remember me</label>

  <label><input v-model="plan" type="radio" value="free"> Free</label>
  <label><input v-model="plan" type="radio" value="pro"> Pro</label>

  <select v-model="stacks" multiple>
    <option value="vue">Vue</option>
    <option value="node">Node</option>
  </select>
</template>
```

A checkbox bound to an array toggles membership. A radio group shares one `ref`.

## Native form submit

Use a real `<form>` and `@submit.prevent`:

```vue
<script setup lang="ts">
const email = ref('')
const errorMessage = ref('')

const handleSubmit = () => {
  errorMessage.value = ''

  if (!email.value.includes('@')) {
    errorMessage.value = 'Enter a valid email.'
    return
  }

  // POST the payload
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model.trim="email" type="email" required>
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
    <button type="submit">Continue</button>
  </form>
</template>
```

Keep validation next to the submit handler for small forms. Pull in a library only when schemas get large.

## Custom inputs with defineModel

Vue 3.4+ `defineModel` is the clean way to wrap an input:

```vue
<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>

<template>
  <input
    :value="model"
    @input="model = ($event.target as HTMLInputElement).value"
  >
</template>
```

Parent:

```vue
<TextField v-model="email" />
```

That is `modelValue` + `update:modelValue` without the ceremony. Do not invent a second event name for the same job.

## Checklist

- State lives in refs, not in the DOM
- Checkboxes and radios use the right `v-model` type
- Submit goes through `@submit.prevent` on a `<form>`
- Custom fields use `defineModel` or `modelValue`

## Official sources

- [Form input bindings](https://vuejs.org/guide/essentials/forms.html)
- [defineModel](https://vuejs.org/api/sfc-script-setup.html#definemodel)
