---
title: "Formulaires et v-model"
description: "Lier les champs Vue avec v-model, gérer checkbox, radio et select, valider à la soumission, et envelopper un input custom avec defineModel."
date: 2026-04-10
tags: ["vue", "formulaires", "v-model", "defineModel"]
draft: false
readingTime: "9 min"
---

## v-model = valeur + événement input

Sur un input natif, `v-model` relie `value` et écoute `input` (parfois `change`). L'état reste un `ref`.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
</script>

<template>
  <label>
    E-mail
    <input v-model.trim="email" type="email" autocomplete="email">
  </label>
</template>
```

Modificateurs utiles : `.trim`, `.number` (valide toi-même le vide), `.lazy` (maj sur `change`).

## Checkbox, radio, select

```vue
<script setup lang="ts">
import { ref } from 'vue'

const souvenir = ref(false)
const formule = ref<'libre' | 'pro'>('libre')
const piles = ref<string[]>([])
</script>

<template>
  <label><input v-model="souvenir" type="checkbox"> Se souvenir de moi</label>

  <label><input v-model="formule" type="radio" value="libre"> Libre</label>
  <label><input v-model="formule" type="radio" value="pro"> Pro</label>

  <select v-model="piles" multiple>
    <option value="vue">Vue</option>
    <option value="node">Node</option>
  </select>
</template>
```

Checkbox + tableau = appartenance. Radios = un seul `ref` partagé.

## Soumettre un vrai formulaire

```vue
<script setup lang="ts">
const email = ref('')
const messageErreur = ref('')

const handleSoumettre = () => {
  messageErreur.value = ''

  if (!email.value.includes('@')) {
    messageErreur.value = 'Indique un e-mail valide.'
    return
  }

  // POST
}
</script>

<template>
  <form @submit.prevent="handleSoumettre">
    <input v-model.trim="email" type="email" required>
    <p v-if="messageErreur" role="alert">{{ messageErreur }}</p>
    <button type="submit">Continuer</button>
  </form>
</template>
```

Pour un petit formulaire, la validation reste à côté du submit. Une lib de schéma n'est utile que quand les règles explosent.

## Champ custom : defineModel

Depuis Vue 3.4 :

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

Le parent écrit `<ChampTexte v-model="email" />`. C'est `modelValue` + `update:modelValue` sans le bruit. N'invente pas un second événement pour le même job.

## Checklist

- L'état est dans des refs, pas dans le DOM
- Checkbox et radio ont le bon type de `v-model`
- `@submit.prevent` sur un `<form>`
- Les champs custom passent par `defineModel`

## Sources

- [Liaisons de formulaires](https://vuejs.org/guide/essentials/forms.html)
- [defineModel](https://vuejs.org/api/sfc-script-setup.html#definemodel)
