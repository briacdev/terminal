---
title: "Sniper Link: improve email confirmation after signup"
description: "A Sniper Link opens the confirmation email in Gmail or Outlook instead of a generic inbox. See how it works, with examples and a simple plan to ship it."
titleFr: "Sniper Link : améliorer la confirmation d'email après inscription"
descriptionFr: "Un Sniper Link ouvre l'email de confirmation dans Gmail ou Outlook, pas toute la boîte. Définition, exemples et plan simple pour l'ajouter à votre inscription."
date: 2026-08-24
tags: [onboarding, email, growth, ux, frontend]
draft: false
readingTime: 8 min
cover: /blog-media/sniper-link-email-confirmation/cover-en.webp
coverAlt: "Four-step Sniper Link path: sign up, Open Gmail, filtered search, then confirm."
coverAltFr: "Parcours Sniper Link en quatre étapes : inscription, Ouvrir Gmail, recherche filtrée, confirmation."
---

A signup is not finished when the form is submitted. It is finished when the user confirms their email.

Most products still show a dead-end screen: "Check your inbox." The user leaves your app, opens a crowded mailbox, searches by hand, and often never comes back. A **Sniper Link** removes that scavenger hunt. One click opens the right mailbox, already filtered on your message.

This article explains the pattern, gives copy-paste URLs, and ends with a plan you can ship in an afternoon. Dan Benoni named the idea in 2019. [Growth.design later published an experiment](https://growth.design/sniper-link) around it. The implementation below is written from a product-engineering angle, not as a recap of that page.

## What a Sniper Link is

A Sniper Link is a button on the "verify your email" page. It does not point to a generic webmail homepage. It points to a **pre-scoped inbox view**:

- the user's provider (Gmail, Outlook, Yahoo, Proton, iCloud);
- preferably the same account they just typed;
- a search that only shows mail from your domain;
- when the provider allows it, spam and promotions as well as the inbox;
- a short time window, so old mail from you does not hide the new one.

The user still has to click Confirm in the email. You are not skipping verification. You are removing the empty space between "I signed up" and "I found the message."

That gap is expensive. People bounce because the mailbox is noisy, the email landed in spam, or they had three Gmail sessions open and opened the wrong one. A good Sniper Link attacks those three problems at once.

![Two onboarding paths: a generic check-your-inbox screen versus a Sniper Link that opens a filtered Gmail search.](/blog-media/sniper-link-email-confirmation/flow-before-after-en.webp){width="1600" height="900"}

## Why "check your inbox" fails

The usual post-signup screen outsources the hard part to the user.

They must remember which address they used, pick the correct webmail, find your message among newsletters, and notice it even if a filter buried it. On mobile, they also have to switch apps. Every extra step is a chance to drop.

A Sniper Link works because it replaces a vague instruction with a **specific next action**: "Open Gmail and show the email from us." The destination is already filtered. If your mail is in spam, a Gmail search with `in:anywhere` still surfaces it.

You should still send a clear email, with a short subject and a single button. The Sniper Link does not fix a weak message. It makes a decent message easier to reach.

## Anatomy of a Gmail Sniper Link

Gmail is the best place to start. It exposes a search hash that you can fill from the signup email.

Readable search:

```text
from:@yourdomain.com in:anywhere newer_than:1d
```

Full URL:

```text
https://mail.google.com/mail/u/jane.doe@gmail.com/#search/from%3A%40yourdomain.com+in%3Aanywhere+newer_than%3A1d
```

Each piece has a job:

| Part | Role |
| --- | --- |
| `mail.google.com/mail/` | Opens Gmail in the browser. |
| `u/jane.doe@gmail.com` | Targets that account when several are signed in. |
| `#search/` | Runs a search instead of showing the full inbox. |
| `from:@yourdomain.com` | Keeps only mail from your domain. |
| `in:anywhere` | Includes spam, trash, and promotions. |
| `newer_than:1d` | Limits results to the last day. Use `1h` for magic links. |

Use your real sending domain, not a personal mailbox, if several addresses can send (`noreply@`, `hello@`, `support@`). The `@yourdomain.com` form matches all of them.

If you send from Google Workspace on a custom domain, the same Gmail URL still works. The provider is Gmail. The user's address is `name@company.com`.

![Annotated Gmail Sniper Link URL with webmail, account, search, sender, spam, and time fragments.](/blog-media/sniper-link-email-confirmation/gmail-url-anatomy-en.webp){width="1600" height="900"}

## URLs for other providers

Not every webmail lets you deep-link a search. Ship Gmail first, then add the rest as "open this mailbox" fallbacks.

### Outlook

```text
https://outlook.live.com/mail/?login_hint=jane.doe%40outlook.com
```

Outlook does not give you a public equivalent of Gmail's `from:` + `in:anywhere` search. `login_hint` at least opens the right account. Ask the user to search for your brand if the message is not on top.

Microsoft 365 work accounts often live on `https://outlook.office.com/mail/`. You can detect them with MX records (see below) and switch the host.

### Yahoo

```text
https://mail.yahoo.com/d/search/keyword=from%253Anoreply%40yourdomain.com
```

Yahoo can filter on the sender. It is less reliable than Gmail for spam. Keep a "Not seeing the email? Check spam" line next to the button.

### Proton

```text
https://mail.proton.me/u/0/all-mail#from=noreply%40yourdomain.com
```

`/u/0/` is the first account in the session. If the user has several Proton accounts, this can open the wrong one. A safer fallback is `https://mail.proton.me/switch`, at the cost of losing the sender filter.

### iCloud

```text
https://www.icloud.com/mail/
```

iCloud Mail has no useful public search deep link. Open Mail, show the exact address you sent to, and offer a resend action.

### Mobile

On iOS you can try app schemes as a secondary CTA, then fall back to HTTPS:

| Provider | App URL |
| --- | --- |
| Gmail | `googlegmail://` |
| Outlook | `ms-outlook://` |
| Yahoo | `ymail://` |
| Proton | `protonmail://` |
| Mail.app | `message://` |

Do not rely on app schemes alone. They rarely carry the same search filters, and they fail when the app is missing. HTTPS webmail is the default. The app URL is an extra on phones.

## Detect the email provider

You only need the address the user typed. Start with the domain. That is enough for a first experiment.

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

This misses Google Workspace and Microsoft 365 on a company domain (`dev@acme.com`). That is acceptable for v1 if most signups are consumer addresses.

When custom domains matter, resolve MX records on the server:

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

Email validation APIs can also return the provider. Use them if you already pay for them. Do not add a paid lookup only for this CTA.

## Put it on the confirmation page

Replace the passive sentence with a button whose label names the provider.

Bad: "We sent you an email. Check your inbox."

Better: "We sent a confirmation to `jane.doe@gmail.com`. Open Gmail to confirm."

Keep a second path: resend the email, change the address, and a short note about spam. The Sniper Link is the primary CTA, not the only one.

![Post-signup screen with an Open Gmail button next to a filtered Gmail search showing only the confirmation email.](/blog-media/sniper-link-email-confirmation/confirmation-cta-en.webp){width="1600" height="900"}

A Vue 3 example:

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
    <h1>Confirm your email</h1>
    <p>
      We sent a link to <strong>{{ email }}</strong>.
    </p>
    <button
      v-if="inboxUrl && provider !== 'unknown'"
      type="button"
      class="inline-flex rounded-none border-2 border-white px-4 py-2 font-semibold"
      :aria-label="`Open the confirmation email in ${providerLabel[provider]}`"
      @click="handleOpenInbox"
    >
      Open {{ providerLabel[provider] }}
    </button>
    <p v-else>
      Open your inbox and look for a message from us.
    </p>
    <button type="button" class="underline" @click="handleResend">
      Resend email
    </button>
  </section>
</template>
```

If you already send mail from a Spring Boot app, keep that pipeline as it is. The Sniper Link is a frontend concern. See [Sending emails with Spring Boot Starter Mail](/blog/sending-emails-with-spring-boot-starter-mail) for the server side.

## A helper to build the URL

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

Call this on the server or in the client after signup. Do not log the generated URL in analytics tools that you would not already allow to see the email address. The URL contains the user's mailbox.

## Measure before you polish

Do not copy someone else's lift. Measure yours.

Track at least:

- confirmation rate: confirmed users / signups;
- median time from signup to confirm;
- click rate on the Sniper Link;
- share of clicks that never confirm (wrong account, blocked popup, expired link).

Baseline a week of the old screen, then show the Sniper Link to 50% of new signups. Gmail-only is a valid first test: you will get a clean comparison with little code.

If confirmation rate does not move, inspect deliverability before blaming the CTA. A Sniper Link cannot save an email that never arrives.

## A 30-minute action plan

1. Write down today's confirmation rate and median time to confirm.
2. Detect `@gmail.com` / `@googlemail.com` on the success page.
3. Render one button: "Open Gmail". Use the search URL with `from:@yourdomain.com`, `in:anywhere`, and `newer_than:1d`.
4. Keep Resend and "check spam" next to it.
5. After a few days, read confirmation rate, time to confirm, and button clicks. Then add Outlook and MX lookup.

That is enough. A full provider matrix is optional until Gmail proves the mechanic.

## Mistakes to avoid

- **Generic "Open mailbox" with no provider.** The whole point is a specific destination.
- **Search that only covers the inbox.** Gmail without `in:anywhere` misses spam.
- **No time window on magic links.** Users then confirm an old login email.
- **Sniper Link as the only recovery path.** Always offer resend and change email.
- **Ignoring Workspace / Microsoft 365.** Domain parsing is not enough for B2B.
- **Opening the link in the same tab without a way back.** Prefer a new tab, or keep your app shell visible.
- **Over-scoping the first version.** Gmail plus a fallback sentence beats eight half-broken deep links.

## FAQ

### What is a Sniper Link?

It is a post-signup link that opens the user's webmail on a filtered view of your confirmation email, instead of telling them to "check their inbox."

### Does it work if the email is in spam?

On Gmail, yes, if you include `in:anywhere`. Other providers are weaker. You still need a healthy sending domain and a spam-folder hint.

### Do I need a paid email API?

No. Domain parsing is enough to start. MX lookup is free. A validation API is optional.

### Is this compatible with GDPR?

You already have the email from the form. Building a URL from it is not a new processing purpose. Do not send that URL to extra third parties, and do not put the raw address in public logs.

### Does it replace double opt-in?

No. The user still confirms. You only shorten the path to the message.

### What about Apple Hide My Email or plus addressing?

Use the exact address returned by the form, including `+tag` or a Relay address. Do not normalize it. The mailbox the provider opens must match what you sent to.

## Takeaway

The confirmation email is part of onboarding, not a background chore. A Sniper Link turns "go look somewhere" into "open this view of your mailbox." Start with Gmail, measure confirmation rate and time to confirm, then extend to other providers if the first test earns it.
