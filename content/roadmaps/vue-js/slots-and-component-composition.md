---
title: "Slots and Component Composition"
description: "Build flexible Vue layout components with default slots, named slots, and scoped slots so parents inject markup without breaking the child API."
date: 2026-04-08
tags: ["vue", "slots", "composition", "components"]
draft: false
readingTime: "8 min"
---

## Props pass data. Slots pass markup.

A prop cannot receive a block of UI. A **slot** can. Use slots when the parent should decide what goes inside a card, a modal, or a table cell, while the child owns the chrome (border, header, padding).

This is composition: small layout components with holes, filled by the parent.

## Default slot

```vue
<!-- Panel.vue -->
<template>
  <section class="border border-zinc-700 p-4">
    <slot>Nothing here yet.</slot>
  </section>
</template>
```

```vue
<Panel>
  <p>Server latency is 42 ms.</p>
</Panel>
```

Fallback content inside `<slot>` shows only when the parent passes nothing.

## Named slots

```vue
<template>
  <article>
    <header>
      <slot name="header" />
    </header>
    <div>
      <slot />
    </div>
    <footer>
      <slot name="footer" />
    </footer>
  </article>
</template>
```

Parent:

```vue
<Panel>
  <template #header>
    <h2>Deploy</h2>
  </template>
  <p>Last run: 12:04</p>
  <template #footer>
    <button type="button">Retry</button>
  </template>
</Panel>
```

`#header` is shorthand for `v-slot:header`. The default slot has no name.

## Scoped slots

The child can pass data into the slot. This is how a list component lets the parent render each row:

```vue
<!-- DataList.vue -->
<template>
  <ul>
    <li v-for="row in rows" :key="row.id">
      <slot name="item" :row="row" />
    </li>
  </ul>
</template>
```

```vue
<DataList :rows="users">
  <template #item="{ row }">
    <span>{{ row.email }}</span>
  </template>
</DataList>
```

The parent owns the row UI. The child owns the loop and keys.

## Layout components, not god components

Good slot usage:

- `AppShell` with `header`, `default`, `sidebar`
- `Modal` with `title` and default body
- `Table` with a scoped `#cell`

Bad slot usage:

- twenty named slots on one file
- a slot that only wraps a string you could have passed as a prop

If the parent always passes a string, use a prop.

## Checklist

- Default slot for the main body
- Named slots for header/footer chrome
- Scoped slots when the child has data the parent must render
- No slot for a single string that should be a prop

## Official sources

- [Slots](https://vuejs.org/guide/components/slots.html)
- [Fallthrough attributes](https://vuejs.org/guide/components/attrs.html)
