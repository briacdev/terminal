---
title: Security - Application Security Basics
description: "Secure Java APIs with AuthN/AuthZ, token vs session strategies, endpoint hardening, secret handling, and safe error responses."
date: 2025-01-15
tags: [java, security, api, auth]
draft: false
readingTime: 16 min
---

## Why this step matters

Security is architecture, not a late patch.
Weak security boundaries create expensive incidents in production.

Every backend endpoint is an attack surface until proven otherwise.

## AuthN vs AuthZ

- Authentication (AuthN): who is the caller?
- Authorization (AuthZ): what can this caller do?

Both are required for secure APIs.
Never treat “logged in” as “allowed to do everything”.

## Token vs session approach

Session-based:

- state kept server-side
- simple for classic web apps
- needs scalable session storage and CSRF protection for cookie sessions

Token-based:

- stateless requests with a signed token
- common for APIs and distributed services
- requires strict validation, expiration, and revocation strategy

Choose based on architecture constraints, not fashion.

## Endpoint hardening checklist

- deny-by-default access policy
- explicit public routes only
- input validation and payload size limits
- rate limiting for sensitive endpoints
- strict CORS policy where relevant
- HTTPS everywhere in production

## Password and secret handling

- never store plain credentials
- use strong one-way hashing for passwords (for example bcrypt/argon2 via a vetted library)
- rotate and externalize secrets
- avoid logging tokens, passwords, or personal secrets
- prefer short-lived access tokens with refresh controls

## Error response strategy

Return generic auth errors to avoid leaking internal details.
Example: use a clear `401` / `403` contract without exposing whether an email exists, unless product requirements demand otherwise.

## Practical access model

Use role/permission checks close to business operations:

- role for coarse access (`admin`, `member`)
- permission for fine-grained actions (`read:invoice`, `write:invoice`)

Centralize authorization decisions so they are testable and auditable.

## Threat basics for APIs

Watch for:

- injection (SQL, command, template)
- broken access control (IDOR)
- mass assignment / over-posting
- insecure deserialization
- excessive data exposure in responses

## Common mistakes

- mixing auth logic with business logic everywhere
- endpoints accidentally left public
- missing token/session expiration policy
- no audit trail for security-sensitive actions
- trusting client-side role claims without server validation

## Practice checklist

- classify one API’s routes as public vs authenticated vs authorized
- design a permission check for a sensitive write action
- remove secrets from config files into environment variables
- verify error responses do not leak stack traces or user enumeration details

## Takeaway

1. Separate identity (AuthN) and permissions (AuthZ) clearly
2. Choose token or session based on architecture constraints
3. Harden endpoints with a deny-by-default mindset
4. Treat secrets, credentials, and auth logs as critical assets
