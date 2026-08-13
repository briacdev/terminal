---
title: "Accessibility and UX in Vue"
description: "Build accessible Vue UIs: semantic HTML, keyboard support, ARIA only when needed, and focus management when components open or route."
date: 2026-04-15
tags: ["vue", "a11y", "ux", "aria"]
draft: false
readingTime: "9 min"
---

## Vue does not make a page accessible

A Vue component can render a `<div>` that looks like a button. Screen readers and keyboards will treat it as a div. Accessibility is HTML first, Vue second.

This page is about patterns that Vue apps get wrong: clickable divs, missing labels, and focus lost after a route or modal.

## Prefer native elements

```vue
<!-- Bad -->
<div class="btn" @click="handleSave">Save</div>

<!-- Good -->
<button type="button" @click="handleSave">Save</button>
```

`type="button"` prevents accidental form submit. Links that navigate use `<RouterLink>` or `<a href>`. Do not attach `@click` to a `<span>` and add `role="button"` unless you also add `tabindex="0"` and `@keydown` for Enter and Space. Native `<button>` is shorter.

## Labels and errors

```vue
<label for="email">Email</label>
<input id="email" v-model.trim="email" type="email" autocomplete="email" :aria-invalid="Boolean(errorMessage)" :aria-describedby="errorMessage ? 'email-error' : undefined">
<p v-if="errorMessage" id="email-error" role="alert">{{ errorMessage }}</p>
```

Every input has a visible `<label>` bound with `for` / `id`. `placeholder` is not a label. `role="alert"` announces errors without a page reload.

## Keyboard and Vue events

If you must make a non-button interactive, handle both click and keyboard:

```vue
<div
  role="button"
  tabindex="0"
  aria-label="Open filters"
  @click="handleOpenFilters"
  @keydown.enter.prevent="handleOpenFilters"
  @keydown.space.prevent="handleOpenFilters"
>
  Filters
</div>
```

Vue's `.enter` and `.space` modifiers keep the template readable. Prefer a real button anyway.

## Focus when the UI changes

When a modal opens, move focus into it. When it closes, return focus to the opener.

```ts
import { nextTick, ref } from 'vue'

const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const openerRef = ref<HTMLButtonElement | null>(null)

const handleOpen = async () => {
  isOpen.value = true
  await nextTick()
  panelRef.value?.focus()
}

const handleClose = () => {
  isOpen.value = false
  openerRef.value?.focus()
}
```

`nextTick` waits until Vue has rendered the dialog. Skip it and `focus()` runs on a node that is still `v-if`'d away.

## Images and icons

Decorative icons get `aria-hidden="true"`. Meaningful images get `alt`. Icon-only buttons need `aria-label`.

## Checklist

- Buttons are `<button>`, links are links
- Forms have labels, `autocomplete`, and announced errors
- Modals restore focus
- You did not sprinkle ARIA on markup that already has a native role

## Official sources

- [Vue: Accessibility](https://vuejs.org/guide/best-practices/accessibility.html)
- [MDN: Using ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
