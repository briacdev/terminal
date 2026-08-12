---
title: Backend - API Essentials
description: "Design maintainable Java APIs with layered architecture, DTOs, validation, consistent error contracts, and environment-aware configuration."
date: 2025-01-14
tags: [java, backend, api, architecture]
draft: false
readingTime: 16 min
---

## Why this step matters

A backend API should stay maintainable as features grow.
Good architecture and contracts matter more than framework choice.

This step is framework-agnostic so the same ideas apply to Spring, Jakarta EE, or lightweight servers.

## Layered architecture

A practical baseline:

- Transport layer: HTTP input/output
- Application/service layer: business rules
- Data access layer: persistence

Keep each layer focused on one responsibility.
Dependencies should point inward toward business rules, not outward toward frameworks.

## DTOs and contracts

Expose DTOs at API boundaries.
Do not expose persistence models directly.

```java
public record CreateUserRequest(String username, String email) {}
public record UserResponse(Long id, String username, String email) {}
```

This prevents tight coupling between API and storage models and makes versioning easier.

## Validation strategy

Validate early at the boundary:

- required fields
- format constraints
- business preconditions

```java
public record CreateUserRequest(String username, String email) {
    public void validate() {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("username required");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("invalid email");
        }
    }
}
```

Framework validators are fine; the important part is failing fast with clear messages.

## Error handling contract

Use a consistent error shape across endpoints.

```java
public record ErrorResponse(String code, String message, String requestId) {}
```

Benefits:

- easier client handling
- simpler monitoring and alerting
- predictable API behavior

Map domain failures to stable HTTP status codes (`400`, `401`, `403`, `404`, `409`, `500`) without leaking internals.

## Configuration and environments

Externalize config instead of hardcoding values:

- port
- database URL
- API keys / secrets
- feature flags

Typical environments:

- local
- staging
- production

Never commit secrets. Prefer environment variables or a secret manager.

## Logging and traceability

Include request IDs and stable context fields in logs.
This makes production debugging much faster and prepares you for the observability step later.

## Idempotency and safe methods

Understand HTTP method semantics:

- `GET` should be safe
- `PUT`/`DELETE` are often idempotent
- `POST` may create duplicates unless you design idempotency keys

## Common mistakes

- business logic in the transport layer
- duplicated validation in many places
- inconsistent error response formats
- mixing environment config in source code
- returning database entities from controllers

## Practice checklist

- sketch layers for a “create order” use case
- define request/response records for one endpoint
- implement boundary validation and a shared error response
- externalize one setting (for example DB URL) from code

## Takeaway

1. Build around clear layer boundaries
2. Keep API contracts explicit with DTOs
3. Validate at boundaries and standardize errors
4. Keep configuration external and environment-aware
