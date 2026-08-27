---
title: "Sniper Link : améliorer la confirmation d'email après inscription"
description: "Un Sniper Link ouvre l'email de confirmation dans Gmail ou Outlook, pas toute la boîte. Définition, exemples et plan simple pour l'ajouter à votre inscription."
date: 2026-08-24
tags: [onboarding, email, growth, ux, frontend]
draft: false
readingTime: 8 min
cover: /blog-media/sniper-link-email-confirmation/cover-fr.webp
coverAlt: "Parcours Sniper Link en quatre étapes : inscription, Ouvrir Gmail, recherche filtrée, confirmation."
---

Une inscription n'est pas terminée quand le formulaire est envoyé. Elle est terminée quand la personne confirme son email.

La plupart des produits affichent encore un écran passif : « Vérifiez votre boîte mail ». L'utilisateur quitte l'app, ouvre une inbox saturée, cherche à la main, et souvent ne revient pas. Un **Sniper Link** supprime cette chasse au trésor. Un clic ouvre la bonne messagerie, déjà filtrée sur votre message.

Cet article définit le pattern, donne des URLs prêtes à l'emploi, et se termine par un plan que vous pouvez livrer dans l'après-midi. Dan Benoni a nommé l'idée en 2019. [Growth.design a ensuite publié une expérience](https://growth.design/sniper-link) sur le sujet. La suite est une version produit / engineering, pas une recopie de cette page.

## Qu'est-ce qu'un Sniper Link ?

Un Sniper Link est un bouton sur la page « confirmez votre email ». Il ne pointe pas vers la page d'accueil d'un webmail. Il ouvre une **vue déjà cadrée** :

- le fournisseur de la personne (Gmail, Outlook, Yahoo, Proton, iCloud) ;
- de préférence le même compte que l'adresse saisie ;
- une recherche limitée aux emails de votre domaine ;
- quand le fournisseur le permet, spam et promotions inclus ;
- une fenêtre de temps courte, pour ne pas noyer le nouveau mail dans d'anciens messages.

La personne doit toujours cliquer sur Confirmer dans l'email. Vous ne contournez pas la vérification. Vous enlevez le vide entre « je me suis inscrit » et « j'ai trouvé le message ».

Ce vide coûte cher. On part parce que la boîte est bruyante, parce que le mail est en spam, ou parce que trois sessions Gmail sont ouvertes et que la mauvaise s'affiche. Un bon Sniper Link traite ces trois cas.

![Deux parcours d'inscription : un écran générique « vérifiez votre boîte » versus un Sniper Link qui ouvre une recherche Gmail filtrée.](/blog-media/sniper-link-email-confirmation/flow-before-after-fr.webp){width="1600" height="900"}

## Pourquoi « vérifiez votre boîte mail » ne suffit pas

L'écran classique délègue le travail difficile.

Il faut se souvenir de l'adresse utilisée, choisir le bon webmail, trouver votre message au milieu des newsletters, et le voir même si un filtre l'a déplacé. Sur mobile, il faut aussi changer d'application. Chaque étape est une occasion d'abandonner.

Le Sniper Link marche parce qu'il remplace une consigne floue par une **action précise** : « Ouvrir Gmail et afficher l'email de notre part ». La destination est déjà filtrée. Si le mail est en spam, une recherche Gmail avec `in:anywhere` le montre quand même.

Vous devez toujours envoyer un email clair, sujet court, un seul bouton. Le Sniper Link ne rattrape pas un mauvais message. Il rend un message correct plus facile à atteindre.

## Anatomie d'un Sniper Link Gmail

Gmail est le meilleur point de départ. Il expose un hash de recherche que vous pouvez remplir avec l'email d'inscription.

Recherche lisible :

```text
from:@votredomaine.com in:anywhere newer_than:1d
```

URL complète :

```text
https://mail.google.com/mail/u/jane.doe@gmail.com/#search/from%3A%40votredomaine.com+in%3Aanywhere+newer_than%3A1d
```

Chaque morceau a un rôle :

| Partie | Rôle |
| --- | --- |
| `mail.google.com/mail/` | Ouvre Gmail dans le navigateur. |
| `u/jane.doe@gmail.com` | Cible ce compte quand plusieurs sessions sont ouvertes. |
| `#search/` | Lance une recherche, pas l'inbox complète. |
| `from:@votredomaine.com` | Garde uniquement les mails de votre domaine. |
| `in:anywhere` | Inclut spam, corbeille et promotions. |
| `newer_than:1d` | Limite aux dernières 24 h. Utilisez `1h` pour un magic link. |

Utilisez le domaine d'envoi réel, pas une adresse personnelle, si plusieurs expéditeurs existent (`noreply@`, `hello@`, `support@`). La forme `@votredomaine.com` les couvre tous.

Si vous envoyez depuis Google Workspace sur un domaine custom, la même URL Gmail fonctionne. Le fournisseur est Gmail. L'adresse utilisateur est `prenom@entreprise.com`.

![Anatomie d'une URL Sniper Link Gmail : webmail, compte, recherche, expéditeur, spam et fenêtre de temps.](/blog-media/sniper-link-email-confirmation/gmail-url-anatomy-fr.webp){width="1600" height="900"}

## URLs pour les autres fournisseurs

Tous les webmails ne permettent pas une recherche en deep link. Livrez Gmail d'abord, puis ajoutez les autres comme simples « ouvrir cette boîte ».

### Outlook

```text
https://outlook.live.com/mail/?login_hint=jane.doe%40outlook.com
```

Outlook n'offre pas l'équivalent public de `from:` + `in:anywhere`. `login_hint` ouvre au moins le bon compte. Invitez la personne à chercher votre marque si le message n'est pas en haut.

Les comptes Microsoft 365 pro passent souvent par `https://outlook.office.com/mail/`. Vous pouvez les détecter via les MX (plus bas) et changer l'hôte.

### Yahoo

```text
https://mail.yahoo.com/d/search/keyword=from%253Anoreply%40votredomaine.com
```

Yahoo peut filtrer sur l'expéditeur. C'est moins solide que Gmail pour le spam. Gardez une phrase « Pas reçu ? Regardez les indésirables » à côté du bouton.

### Proton

```text
https://mail.proton.me/u/0/all-mail#from=noreply%40votredomaine.com
```

`/u/0/` est le premier compte de la session. Avec plusieurs comptes Proton, ce n'est pas toujours le bon. Un repli plus sûr est `https://mail.proton.me/switch`, au prix du filtre expéditeur.

### iCloud

```text
https://www.icloud.com/mail/
```

iCloud Mail n'a pas de deep link de recherche public utile. Ouvrez Mail, affichez l'adresse exacte visée, et proposez un renvoi.

### Mobile

Sur iOS, vous pouvez proposer le schéma d'app en CTA secondaire, puis retomber sur HTTPS :

| Fournisseur | URL d'app |
| --- | --- |
| Gmail | `googlegmail://` |
| Outlook | `ms-outlook://` |
| Yahoo | `ymail://` |
| Proton | `protonmail://` |
| Mail.app | `message://` |

Ne misez pas sur les schémas d'app seuls. Ils portent rarement les mêmes filtres, et ils échouent si l'app n'est pas installée. Le webmail HTTPS reste le défaut. L'URL d'app est un plus sur téléphone.

## Détecter le fournisseur d'email

L'adresse saisie suffit. Commencez par le domaine. C'est assez pour un premier test.

```ts
export type MailProvider = 'gmail' | 'outlook' | 'yahoo' | 'proton' | 'icloud' | 'unknown'

const PROVIDER_DOMAINS: Record<Exclude<MailProvider, 'unknown'>, string[]> = {
  gmail: ['gmail.com', 'googlemail.com'],
  outlook: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'],
  yahoo: ['yahoo.com', 'ymail.com', 'rocketmail.com'],
  proton: ['proton.me', 'protonmail.com', 'pm.me'],
  icloud: ['icloud.com', 'me.com', 'mac.com']
}

export const detectMailProvider = (email: string): MailProvider => {
  const domain = email.split('@')[1]?.trim().toLowerCase()
  if (!domain) {
    return 'unknown'
  }

  const match = (Object.entries(PROVIDER_DOMAINS) as Array<[Exclude<MailProvider, 'unknown'>, string[]]>)
    .find(([, domains]) => domains.includes(domain))

  return match?.[0] ?? 'unknown'
}
```

Cette version ignore Google Workspace et Microsoft 365 sur domaine d'entreprise (`dev@acme.com`). C'est acceptable en v1 si la majorité des inscriptions sont des adresses grand public.

Quand les domaines custom comptent, résolvez les MX côté serveur :

```ts
import { resolveMx } from 'node:dns/promises'

export const resolveMailProviderFromMx = async (email: string): Promise<MailProvider> => {
  const domain = email.split('@')[1]?.trim().toLowerCase()
  if (!domain) {
    return 'unknown'
  }

  const records = await resolveMx(domain)
  const mxHost = records.sort((left, right) => left.priority - right.priority)[0]?.exchange.toLowerCase() ?? ''

  if (mxHost.includes('google') || mxHost.includes('gmail')) {
    return 'gmail'
  }
  if (mxHost.includes('outlook') || mxHost.includes('microsoft')) {
    return 'outlook'
  }
  if (mxHost.includes('yahoo')) {
    return 'yahoo'
  }
  if (mxHost.includes('proton')) {
    return 'proton'
  }
  if (mxHost.includes('icloud') || mxHost.includes('apple')) {
    return 'icloud'
  }

  return 'unknown'
}
```

Les APIs de validation d'email peuvent aussi renvoyer le fournisseur. Utilisez-les si vous les payez déjà. N'ajoutez pas un appel payant uniquement pour ce bouton.

## L'afficher sur la page de confirmation

Remplacez la phrase passive par un bouton qui nomme le fournisseur.

À éviter : « Nous vous avons envoyé un email. Vérifiez votre boîte. »

Mieux : « Nous avons envoyé une confirmation à `jane.doe@gmail.com`. Ouvrez Gmail pour confirmer. »

Gardez un second chemin : renvoyer l'email, changer l'adresse, et une note courte sur le spam. Le Sniper Link est le CTA principal, pas le seul.

![Écran après inscription avec un bouton Ouvrir Gmail, à côté d'une recherche Gmail filtrée qui n'affiche que l'email de confirmation.](/blog-media/sniper-link-email-confirmation/confirmation-cta-fr.webp){width="1600" height="900"}

Exemple Vue 3 :

```vue
<script setup lang="ts">
type MailProvider = 'gmail' | 'outlook' | 'yahoo' | 'proton' | 'icloud' | 'unknown'

const props = defineProps<{
  email: string
  provider: MailProvider
  inboxUrl: string | null
}>()

const emit = defineEmits<{
  resend: []
}>()

const providerLabel: Record<Exclude<MailProvider, 'unknown'>, string> = {
  gmail: 'Gmail',
  outlook: 'Outlook',
  yahoo: 'Yahoo Mail',
  proton: 'Proton Mail',
  icloud: 'iCloud Mail'
}

const handleOpenInbox = () => {
  if (!props.inboxUrl) {
    return
  }

  window.open(props.inboxUrl, '_blank', 'noopener,noreferrer')
}

const handleResend = () => {
  emit('resend')
}
</script>

<template>
  <section class="space-y-4">
    <h1>Confirmez votre email</h1>
    <p>
      Nous avons envoyé un lien à <strong>{{ email }}</strong>.
    </p>
    <button
      v-if="inboxUrl && provider !== 'unknown'"
      type="button"
      class="inline-flex rounded-none border-2 border-white px-4 py-2 font-semibold"
      :aria-label="`Ouvrir l'email de confirmation dans ${providerLabel[provider]}`"
      @click="handleOpenInbox"
    >
      Ouvrir {{ providerLabel[provider] }}
    </button>
    <p v-else>
      Ouvrez votre boîte mail et cherchez un message de notre part.
    </p>
    <button type="button" class="underline" @click="handleResend">
      Renvoyer l'email
    </button>
  </section>
</template>
```

Si l'envoi part déjà d'une app Spring Boot, ne touchez pas à ce pipeline. Le Sniper Link est un sujet front. Voir [Envoyer des emails avec Spring Boot Starter Mail](/blog/sending-emails-with-spring-boot-starter-mail) pour le côté serveur.

## Un helper pour construire l'URL

```ts
type MailProvider = 'gmail' | 'outlook' | 'yahoo' | 'proton' | 'icloud' | 'unknown'

type SniperLinkInput = {
  email: string
  provider: MailProvider
  senderDomain: string
}

export const buildSniperLink = ({ email, provider, senderDomain }: SniperLinkInput): string | null => {
  const encodedEmail = encodeURIComponent(email)
  const encodedSender = encodeURIComponent(`noreply@${senderDomain}`)
  const encodedDomain = encodeURIComponent(`@${senderDomain}`)

  if (provider === 'gmail') {
    return `https://mail.google.com/mail/u/${encodedEmail}/#search/from%3A${encodedDomain}+in%3Aanywhere+newer_than%3A1d`
  }
  if (provider === 'outlook') {
    return `https://outlook.live.com/mail/?login_hint=${encodedEmail}`
  }
  if (provider === 'yahoo') {
    return `https://mail.yahoo.com/d/search/keyword=from%253A${encodedSender}`
  }
  if (provider === 'proton') {
    return `https://mail.proton.me/u/0/all-mail#from=${encodedSender}`
  }
  if (provider === 'icloud') {
    return 'https://www.icloud.com/mail/'
  }

  return null
}
```

Appelez ce helper après l'inscription, côté serveur ou client. Ne loggez pas l'URL générée dans un outil analytics si vous n'acceptez pas déjà d'y envoyer l'email. L'URL contient la boîte de l'utilisateur.

## Mesurez avant d'embellir

Ne copiez pas le lift d'un autre site. Mesurez le vôtre.

Suivez au minimum :

- le taux de confirmation : comptes confirmés / inscriptions ;
- le temps médian entre inscription et confirmation ;
- le taux de clic sur le Sniper Link ;
- la part de clics sans confirmation (mauvais compte, popup bloquée, lien expiré).

Gardez une semaine de l'ancien écran, puis montrez le Sniper Link à 50 % des nouvelles inscriptions. Un test Gmail seul est valable : peu de code, comparaison lisible.

Si le taux ne bouge pas, regardez la délivrabilité avant de blâmer le CTA. Un Sniper Link ne sauve pas un email qui n'arrive jamais.

## Plan d'action en 30 minutes

1. Notez le taux de confirmation actuel et le temps médian avant confirmation.
2. Détectez `@gmail.com` / `@googlemail.com` sur la page de succès.
3. Affichez un bouton : « Ouvrir Gmail ». URL de recherche avec `from:@votredomaine.com`, `in:anywhere` et `newer_than:1d`.
4. Gardez Renvoyer et « vérifiez les spams » à côté.
5. Après quelques jours, lisez taux, délai et clics. Ensuite seulement, ajoutez Outlook et la résolution MX.

C'est suffisant. Une matrice complète de fournisseurs est optionnelle tant que Gmail n'a pas prouvé le mécanisme.

## Erreurs à éviter

- **Un bouton « Ouvrir la boîte » sans fournisseur.** L'intérêt, c'est une destination précise.
- **Une recherche limitée à l'inbox.** Sans `in:anywhere`, Gmail rate le spam.
- **Pas de fenêtre de temps sur les magic links.** Les gens confirment un ancien email de login.
- **Le Sniper Link comme seul recours.** Proposez toujours renvoyer et changer d'adresse.
- **Oublier Workspace / Microsoft 365.** Parser le domaine ne suffit pas en B2B.
- **Ouvrir le lien dans le même onglet sans retour.** Préférez un nouvel onglet, ou gardez le shell de l'app.
- **Trop viser la v1.** Gmail plus une phrase de repli bat huit deep links à moitié cassés.

## FAQ

### Qu'est-ce qu'un Sniper Link ?

C'est un lien après inscription qui ouvre le webmail sur une vue filtrée de votre email de confirmation, au lieu de dire « allez voir votre boîte ».

### Est-ce que ça marche si l'email est en spam ?

Sur Gmail, oui, avec `in:anywhere`. Les autres fournisseurs sont plus faibles. Il faut quand même un domaine d'envoi sain et une mention spam.

### Faut-il une API email payante ?

Non. Parser le domaine suffit pour commencer. La résolution MX est gratuite. Une API de validation est optionnelle.

### Est-ce compatible RGPD ?

Vous avez déjà l'email via le formulaire. En déduire une URL n'est pas une nouvelle finalité. N'envoyez pas cette URL à des tiers supplémentaires, et ne mettez pas l'adresse en clair dans des logs publics.

### Est-ce que ça remplace le double opt-in ?

Non. La personne confirme toujours. Vous raccourcissez seulement le chemin vers le message.

### Que faire avec « Hide My Email » d'Apple ou le plus-addressing ?

Utilisez l'adresse exacte renvoyée par le formulaire, y compris un `+tag` ou une adresse Relay. Ne la normalisez pas. La boîte ouverte doit être celle à laquelle vous avez envoyé le mail.

## À retenir

L'email de confirmation fait partie de l'onboarding, ce n'est pas une tâche de fond. Un Sniper Link transforme « allez chercher quelque part » en « ouvrez cette vue de votre boîte ». Commencez par Gmail, mesurez le taux et le délai de confirmation, puis élargissez aux autres fournisseurs si le premier test le justifie.
