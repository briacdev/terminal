---
title: "Testing Vue Applications"
description: "Test Vue 3 components with Vitest and Vue Test Utils: query the DOM, fire events, and keep a clear split between unit tests and integration tests."
date: 2026-04-16
tags: ["vue", "vitest", "testing", "vue-test-utils"]
draft: false
readingTime: "10 min"
---

## What to test in a Vue SPA

You do not need a test for every `ref`. You do need tests for:

- rendering that depends on props
- events the parent must receive
- a composable with real branching
- a form that enables submit only when valid

End-to-end tools (Playwright, Cypress) cover full routes. This page is **Vitest + Vue Test Utils** at the component layer.

## Setup

If you scaffolded with the Vitest option, you already have a config. Otherwise:

```bash
npm install -D vitest @vue/test-utils jsdom
```

Point Vitest at `jsdom` so `mount` has a DOM. Put tests next to files (`Counter.spec.ts`) or in `src/__tests__`.

## Mount, query, click

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Counter from '@/components/Counter.vue'

describe('Counter', () => {
  it('increments the label when clicked', async () => {
    const wrapper = mount(Counter)

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('1')
  })
})
```

Prefer `get` (throws if missing) over `find` (silent empty). Use `data-testid` only when the accessible role is awkward. Prefer `getByRole` style queries if you add Testing Library.

## Props and emitted events

```ts
it('emits complete with the task id', async () => {
  const wrapper = mount(TaskCard, {
    props: { id: 't1', title: 'Ship' }
  })

  await wrapper.get('button').trigger('click')

  expect(wrapper.emitted('complete')?.[0]).toEqual(['t1'])
})
```

Assert on `emitted()`, not on internals like `wrapper.vm.count`. Tests should survive a refactor of private refs.

## Testing a composable

Call it inside `setup` via a tiny harness, or use `vitest` with `@vue/test-utils` `createApp`. The simple path:

```ts
import { useToggle } from '@/composables/useToggle'

it('turns on', () => {
  const { isOn, handleOn } = useToggle()
  handleOn()
  expect(isOn.value).toBe(true)
})
```

This works because `useToggle` does not use lifecycle hooks. If it uses `onMounted`, wrap it with `mount` of a stub component.

## Unit vs integration

| Type | Scope | Example |
| --- | --- | --- |
| Unit | One function or composable | `useToggle` |
| Component | One SFC with stubs | `TaskCard` emits |
| Integration | Several real children | `TaskList` with real `TaskCard` |

Stub network calls. Do not hit a live API from Vitest.

## Checklist

- Vitest runs in CI
- Tests click visible elements and read visible text
- Emits are asserted, private state is not
- Fetches are mocked

## Official sources

- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest](https://vitest.dev/guide/)
- [Vue: Testing](https://vuejs.org/guide/scaling-up/testing.html)
