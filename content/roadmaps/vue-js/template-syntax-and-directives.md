---
title: "Template Syntax and Directives"
description: "Learn Vue template syntax: interpolation, v-bind, v-on, v-if, v-show, and v-for, with rules for keys and when not to use a directive."
date: 2026-04-04
tags: ["vue", "templates", "directives", "v-for"]
draft: false
readingTime: "9 min"
---

## Templates are HTML plus Vue directives

A Vue template looks like HTML. Directives are special attributes that start with `v-`. They tell Vue how to bind data, listen to events, or repeat nodes.

This page covers the directives you need every day. Reactivity (`ref`) is next; here we assume you already have values in `<script setup>`.

## Text and attributes

Interpolation prints a value as text:

```vue
<p>{{ username }}</p>
```

`v-bind` (shortcut `:`) sets an attribute:

```vue
<img :src="avatarUrl" :alt="username">
<button :disabled="isSaving">Save</button>
```

`v-html` injects HTML. Skip it for user content unless you sanitize it. Prefer interpolation.

## Events

`v-on` (shortcut `@`) listens to DOM events:

```vue
<button type="button" @click="handleSave">Save</button>
<input :value="query" @input="handleQueryInput">
```

Name handlers with a `handle` prefix so templates stay readable. Inline expressions are fine for one-liners; move anything with branches into a function.

## Conditional rendering

| Directive | Behavior |
| --- | --- |
| `v-if` / `v-else-if` / `v-else` | Adds or removes nodes from the DOM |
| `v-show` | Toggles `display` and keeps the node mounted |

Use `v-if` when the block is rare or expensive. Use `v-show` when you toggle often and want to keep state inside the hidden tree.

```vue
<p v-if="status === 'error'">Could not load the list.</p>
<p v-else-if="items.length === 0">No items yet.</p>
<ul v-else>
  <li v-for="item in items" :key="item.id">{{ item.label }}</li>
</ul>
```

## Lists and keys

`v-for` repeats a node. Always set a **stable `:key`** from your data, never the array index if the list can reorder.

```vue
<li v-for="task in tasks" :key="task.id">
  {{ task.title }}
</li>
```

Do not put `v-if` and `v-for` on the same element. Filter the list in script, or wrap the `v-for` in a `<template>` and put `v-if` inside.

## Shorthand cheat sheet

| Full | Short |
| --- | --- |
| `v-bind:src` | `:src` |
| `v-on:click` | `@click` |
| `v-slot:header` | `#header` |

Learn the short forms; Vue codebases use them.

## What templates cannot do

Templates are not a general-purpose language. Keep `map` / `filter` / complex math in `<script setup>`. The template should read like a view: bind, branch, repeat.

## Checklist

- You can bind text, attributes, and events
- You know when `v-if` beats `v-show`
- Every `v-for` has a stable `:key`
- You never combine `v-if` and `v-for` on one node

## Official sources

- [Template syntax](https://vuejs.org/guide/essentials/template-syntax.html)
- [List rendering](https://vuejs.org/guide/essentials/list.html)
- [Event handling](https://vuejs.org/guide/essentials/event-handling.html)
