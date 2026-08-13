---
title: "Données asynchrones et appels API"
description: "Charger une API dans Vue 3 avec états loading / erreur, recharger au changement de param de route, et annuler les requêtes en vol pour éviter les courses."
date: 2026-04-13
tags: ["vue", "fetch", "async", "api"]
draft: false
readingTime: "10 min"
---

## Vue ne fetch pas à ta place

Il n'y a pas de `useFetch` dans une SPA Vite. C'est une API **Nuxt**. En Vue, tu appelles `fetch` (ou `ofetch` / `axios`) dans un composable ou une vue, et tu modèles **idle / chargement / succès / erreur** toi-même.

Cette page reste côté client. Le chargement serveur est pour la roadmap Nuxt.

## Un composable qui dit la vérité

```ts
// src/composables/useLivre.ts
import { ref } from 'vue'

interface Livre {
  id: string
  titre: string
}

export const useLivre = () => {
  const livre = ref<Livre | null>(null)
  const estChargement = ref(false)
  const messageErreur = ref('')

  const handleCharger = async (id: string, signal?: AbortSignal) => {
    estChargement.value = true
    messageErreur.value = ''

    try {
      const reponse = await fetch(`/api/livres/${id}`, { signal })

      if (!reponse.ok) {
        throw new Error(`Échec HTTP ${reponse.status}`)
      }

      livre.value = await reponse.json() as Livre
    } catch (erreur) {
      if (erreur instanceof DOMException && erreur.name === 'AbortError') {
        return
      }

      livre.value = null
      messageErreur.value = 'Impossible de charger ce livre.'
    } finally {
      estChargement.value = false
    }
  }

  return { livre, estChargement, messageErreur, handleCharger }
}
```

Le template affiche spinner, alerte ou titre. Ne laisse pas l'ancien livre à l'écran pendant le chargement du suivant sans signal visuel.

## Recharger quand la route change

```vue
<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLivre } from '@/composables/useLivre'

const route = useRoute()
const { livre, estChargement, messageErreur, handleCharger } = useLivre()
let abortController: AbortController | null = null

watch(
  () => route.params.id,
  (id) => {
    abortController?.abort()
    abortController = new AbortController()

    if (typeof id !== 'string') {
      return
    }

    void handleCharger(id, abortController.signal)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  abortController?.abort()
})
</script>
```

`immediate: true` couvre la première visite. Aborter la requête précédente évite qu'une réponse lente pour l'id `1` écrase l'id `2`.

## Flicker et vides

- Passe `estChargement` à true **avant** d'effacer des données utiles, ou garde un squelette
- Pas de toast sur chaque abort
- Un 404 mérite une vue dédiée, pas un « erreur réseau » générique

## Où vit l'appel

| Endroit | Quand |
| --- | --- |
| Vue + composable | Une route possède la ressource |
| Action Pinia | Deux routes partagent le cache |
| Enfant | L'enfant est le seul consommateur et reçoit l'id en prop |

Un bouton présentational ne fetch pas.

## Checklist

- Chargement, erreur et données sont trois refs
- Un changement de param relance la requête
- Les requêtes en vol sont abortées
- Tu n'as pas collé `useFetch` Nuxt dans une app Vite en espérant du SSR

## Sources

- [Watchers Vue](https://vuejs.org/guide/essentials/watchers.html)
- [AbortController](https://developer.mozilla.org/fr/docs/Web/API/AbortController)
- [fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API)
