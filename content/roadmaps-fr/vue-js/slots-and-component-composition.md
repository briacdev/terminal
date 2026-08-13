---
title: "Slots et composition"
description: "Composer des layouts Vue avec slot par défaut, slots nommés et slots scopés, pour injecter du markup sans exploser l'API du composant enfant."
date: 2026-04-08
tags: ["vue", "slots", "composition", "composants"]
draft: false
readingTime: "8 min"
---

## Les props transportent des données. Les slots transportent du markup.

Une prop ne reçoit pas un bloc d'UI. Un **slot** si. Le parent décide ce qui va dans la carte, la modale, la cellule. L'enfant garde le chrome : bordure, titre de section, padding.

## Slot par défaut

```vue
<!-- Panneau.vue -->
<template>
  <section class="border border-zinc-700 p-4">
    <slot>Rien à afficher.</slot>
  </section>
</template>
```

```vue
<Panneau>
  <p>Latence serveur : 42 ms.</p>
</Panneau>
```

Le contenu dans `<slot>` n'apparaît que si le parent ne passe rien.

## Slots nommés

```vue
<template>
  <article>
    <header>
      <slot name="entete" />
    </header>
    <div>
      <slot />
    </div>
    <footer>
      <slot name="pied" />
    </footer>
  </article>
</template>
```

```vue
<Panneau>
  <template #entete>
    <h2>Déploiement</h2>
  </template>
  <p>Dernier run : 12h04</p>
  <template #pied>
    <button type="button">Relancer</button>
  </template>
</Panneau>
```

`#entete` = `v-slot:entete`. Le slot sans nom est le défaut.

## Slots scopés

L'enfant peut envoyer des données dans le slot. Typique d'une liste :

```vue
<!-- ListeDonnees.vue -->
<template>
  <ul>
    <li v-for="ligne in lignes" :key="ligne.id">
      <slot name="item" :ligne="ligne" />
    </li>
  </ul>
</template>
```

```vue
<ListeDonnees :lignes="adherents">
  <template #item="{ ligne }">
    <span>{{ ligne.email }}</span>
  </template>
</ListeDonnees>
```

Le parent dessine la ligne. L'enfant possède la boucle et les keys.

## Layouts, pas usines à slots

Utile : `CoquilleApp` (`entete`, défaut, `sidebar`), `Modale` (`titre` + corps), `Tableau` avec `#cellule` scopé.

Inutile : vingt slots nommés, ou un slot qui ne wrappe qu'une string (une prop suffisait).

## Checklist

- Corps principal = slot par défaut
- Chrome = slots nommés
- Donnée de l'enfant rendue par le parent = slot scopé
- Une string seule = prop, pas slot

## Sources

- [Slots](https://vuejs.org/guide/components/slots.html)
- [Attributs fallthrough](https://vuejs.org/guide/components/attrs.html)
