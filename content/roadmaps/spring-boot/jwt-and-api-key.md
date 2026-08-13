---
title: JWT and API Key Approaches
description: "Choose API authentication: JWT for user sessions, API keys for service-to-service calls, plus rotation and trade-offs."
date: 2026-03-23
tags: [spring-boot, security, jwt, api-key]
draft: false
readingTime: 11 min
---

## Where this lesson sits

The filter chain is in place. Now pick a credential style for an API. This is not a JWT library tutorial and not a copy of the API-key blog post. It is a decision lesson with a small validation flow.

## What you will learn

- When JWT fits user-facing APIs
- When API keys fit service-to-service calls
- What rotation and validation look like at a high level

## Mental model

**JWT**: the client sends `Authorization: Bearer <token>`. The resource server validates signature, expiry, and issuer, then maps claims to a `Authentication`. Good for users and short-lived access tokens. Store refresh tokens carefully. Do not put secrets or PII in claims.

**API key**: the client sends a header such as `X-API-Key`. The server looks up a hashed key, checks status and scopes, then authenticates a technical principal. Good for jobs, partners, and CLIs. Keys must be hashed at rest, rotatable, and revocable without a deploy.

Do not mix both blindly on every route. User browsers rarely need long-lived API keys. Batch importers rarely need a user JWT.

## Practical example

A filter does one job: turn a header into an `Authentication` or reject the request.

```java
String header = request.getHeader("X-API-Key");
if (header == null || header.isBlank()) {
    response.sendError(401);
    return;
}
ApiClient client = apiKeyService.authenticate(header);
SecurityContextHolder.getContext().setAuthentication(client.toAuthentication());
filterChain.doFilter(request, response);
```

`apiKeyService.authenticate` compares a hash, not the raw key. Rotation means issuing a new key, accepting both during a window, then revoking the old one.

For JWT, the equivalent step is signature + expiry validation, then a `JwtAuthenticationToken`. Prefer Spring Security OAuth2 resource-server support over a hand-rolled parser.

## Go further on the blog

A concrete API-key filter implementation is in [How to implement key authentication in a Spring Boot API](/blog/how-to-implement-key-authentication-in-a-spring-boot-api).

## Common mistakes

- Storing API keys in plaintext in the database
- Using a JWT that never expires
- Putting the same static key in the frontend bundle

## Next lesson

Next: [Unit Testing](/spring-boot/unit-testing).

## Official docs

- [OAuth2 resource server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html)
- [Authentication architecture](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html)

## Takeaway

- JWT is for users and short-lived access
- API keys are for machines, hashed and rotatable
- Validation happens in the filter chain, before controllers
