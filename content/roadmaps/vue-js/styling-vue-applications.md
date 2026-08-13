---
title: "Styling Vue Applications"
description: "Style Vue 3 components with scoped CSS, :deep when needed, and Tailwind utilities, without leaking styles or fighting the SFC compiler."
date: 2026-04-14
tags: ["vue", "css", "scoped", "tailwind"]
draft: false
readingTime: "8 min"
---

## Three layers, one rule

Style a Vue app in this order:

1. **Reset / tokens** in a global CSS file imported from `main.ts`
2. **Utilities** (Tailwind or similar) for spacing, color, and layout
3. **Scoped CSS** in an SFC only when a component needs a one-off rule

Do not invent a fourth system (inline styles everywhere, plus CSS modules, plus a UI kit) on a small app.

## Scoped CSS

```vue
<template>
  <p class="status">Ready</p>
</template>

<style scoped>
.status {
  color: #d4d4d8;
  font-variant: small-caps;
}
</style>
```

Vue adds a unique attribute to elements in this template. The selector becomes something like `.status[data-v-f3f3eg]`. Sibling components will not pick it up.

## When you need :deep()

Scoped styles do **not** reach into a child component's root internals by default. To style a child from the parent:

```vue
<style scoped>
.panel :deep(h2) {
  margin: 0;
}
</style>
```

Use `:deep` sparingly. If you constantly pierce a child, the child is missing a prop or a slot.

`:slotted()` targets content the parent passed into a child slot. `:global()` escapes scoping for one selector. Prefer a global stylesheet for true globals.

## Tailwind with Vue

Install Tailwind the Vite way, then use classes in templates:

```vue
<button
  type="button"
  class="border border-zinc-600 px-3 py-1 text-xs uppercase tracking-wide hover:bg-white hover:text-black"
>
  Deploy
</button>
```

Tailwind does not replace scoped CSS. It replaces most of it. Keep `scoped` for animations or selectors Tailwind expresses poorly.

This site's own UI is utility-first. Copy that habit: readable class lists, no nested SCSS architecture unless the design system needs it.

## CSS modules (optional)

```vue
<template>
  <p :class="$style.caption">Meta</p>
</template>

<style module>
.caption {
  font-size: 0.75rem;
}
</style>
```

Modules hash class names. Useful in large design systems. Overkill for a 20-component SPA.

## Checklist

- Global tokens live in one CSS entry
- Component CSS is `scoped` unless it is truly global
- `:deep` is a last resort
- Utility classes cover spacing and color before custom CSS

## Official sources

- [SFC CSS features](https://vuejs.org/api/sfc-css-features.html)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)
