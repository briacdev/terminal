---
title: "Tester une application Vue"
description: "Tester des composants Vue 3 avec Vitest et Vue Test Utils : interroger le DOM, déclencher des clics, et séparer tests unitaires et d'intégration."
date: 2026-04-16
tags: ["vue", "vitest", "tests", "vue-test-utils"]
draft: false
readingTime: "10 min"
---

## Quoi tester dans une SPA Vue

Pas un test par `ref`. Oui pour :

- un rendu qui dépend des props
- un événement que le parent doit recevoir
- un composable avec de vraies branches
- un formulaire qui n'active submit que s'il est valide

Playwright / Cypress couvrent les parcours complets. Ici : **Vitest + Vue Test Utils** au niveau composant.

## Setup

Si le scaffold a coché Vitest, la conf est déjà là. Sinon :

```bash
npm install -D vitest @vue/test-utils jsdom
```

Vitest a besoin de `jsdom` pour `mount`. Tests à côté des fichiers (`Compteur.spec.ts`) ou dans `src/__tests__`.

## Monter, cliquer, lire

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Compteur from '@/components/Compteur.vue'

describe('Compteur', () => {
  it('incrémente le libellé au clic', async () => {
    const wrapper = mount(Compteur)

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('1')
  })
})
```

Préfère `get` (erreur si absent) à `find`. `data-testid` seulement si le rôle accessible est trop pénible.

## Props et événements émis

```ts
it('émet rendre avec l id du livre', async () => {
  const wrapper = mount(CarteLivre, {
    props: { id: 'l1', titre: 'Dune' }
  })

  await wrapper.get('button').trigger('click')

  expect(wrapper.emitted('rendre')?.[0]).toEqual(['l1'])
})
```

Asserte `emitted()`, pas `wrapper.vm.compteur`. Le test doit survivre à un refactor des refs privées.

## Tester un composable

S'il n'a pas de hooks de cycle de vie, appelle-le directement :

```ts
import { useBasculer } from '@/composables/useBasculer'

it('active', () => {
  const { estActif, handleActiver } = useBasculer()
  handleActiver()
  expect(estActif.value).toBe(true)
})
```

S'il utilise `onMounted`, monte un composant harnais.

## Unitaire vs intégration

| Type | Périmètre | Exemple |
| --- | --- | --- |
| Unitaire | Fonction ou composable | `useBasculer` |
| Composant | Un SFC, enfants stubbés | `CarteLivre` émet |
| Intégration | Plusieurs enfants réels | `ListeLivres` + `CarteLivre` |

Stub le réseau. Vitest ne tape pas une API live.

## Checklist

- Vitest tourne en CI
- Les tests cliquent des éléments visibles
- On assert les emits, pas l'état privé
- Les fetch sont mockés

## Sources

- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest](https://vitest.dev/guide/)
- [Vue : tests](https://vuejs.org/guide/scaling-up/testing.html)
