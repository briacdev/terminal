---
title: "Réactivité avec ref et reactive"
description: "Choisir ref ou reactive en Vue 3, comprendre .value, et éviter de casser la réactivité en destructurant un objet proxy."
date: 2026-04-05
tags: ["vue", "reactivite", "ref", "composition-api"]
draft: false
readingTime: "10 min"
---

## Ce que « réactif » veut dire

Vue mémorise les valeurs lues pendant le rendu. Quand elles changent, le composant se re-rend. Pas de `setState` : tu assigns un `ref` ou tu mutes un objet `reactive`.

Cette page s'arrête à `ref` et `reactive`. `computed` et `watch` viennent ensuite.

## ref : le choix par défaut

`ref` enveloppe n'importe quelle valeur.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const compteur = ref(0)
const titre = ref('Boîte de réception')

const handleIncrementer = () => {
  compteur.value += 1
}
</script>

<template>
  <button type="button" @click="handleIncrementer">
    {{ titre }} · {{ compteur }}
  </button>
</template>
```

En script, tu passes par `.value`. Dans le template, Vue déballe tout seul : `{{ compteur }}`, pas `{{ compteur.value }}`.

`ref` reste réactif si tu **remplaces** toute la valeur :

```ts
const lecteur = ref<{ id: string; nom: string } | null>(null)
lecteur.value = { id: 'l1', nom: 'Camille' }
```

C'est pour ça que `ref` est le défaut en Vue 3 moderne.

## reactive : un objet sans .value

```ts
import { reactive } from 'vue'

const fiche = reactive({
  email: '',
  souvenir: false
})

fiche.email = 'camille@example.com'
```

Limites :

- `reactive` refuse les primitifs
- `const { email } = fiche` **coupe** la réactivité
- tu ne peux pas réassigner `fiche = { ... }`

Garde `reactive` pour un formulaire muté sur place. Si la valeur peut être remplacée (null puis objet), `ref` est plus simple.

## toRefs

Pour destructurer sans tout casser :

```ts
import { reactive, toRefs } from 'vue'

const fiche = reactive({ email: '', nom: '' })
const { email, nom } = toRefs(fiche)
email.value = 'camille@example.com'
```

`toRef(fiche, 'email')` crée un seul ref branché sur la propriété.

## Données imbriquées

`ref` et `reactive` suivent les objets imbriqués par défaut. `shallowRef` sert surtout à stocker une instance lourde (carte, graphe) que Vue n'a pas à proxifier en profondeur.

## Pièges fréquents

- Oublier `.value` dans le script
- Destructurer un `reactive` en variables nues
- Copier un objet (`{ ...lecteur.value }`) et s'étonner que l'UI ne suive plus
- Envelopper un `ref` dans `reactive` sans connaître les règles d'unwrap

## Checklist

- `ref` est le primitive par défaut
- `.value` seulement en script
- Tu sais pourquoi destructurer `reactive` casse les mises à jour
- Tu peux remplacer un objet tenu dans un `ref`

## Sources

- [Fondamentaux de la réactivité](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [ref vs reactive](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive)
- [Réactivité en profondeur](https://vuejs.org/guide/extras/reactivity-in-depth.html)
