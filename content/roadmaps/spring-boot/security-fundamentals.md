---
title: Security Fundamentals
description: "Protect a Spring Boot API with Spring Security: authentication vs authorization, the filter chain, and endpoint rules."
date: 2026-03-22
tags: [spring-boot, security, spring-security]
draft: false
readingTime: 11 min
---

## Where this lesson sits

The API has data. Unauthenticated access is now the next risk. This lesson is Spring Security's model. JWT and API keys are the next lesson, not this one.

## What you will learn

- Authentication vs authorization
- How the filter chain intercepts HTTP
- How to declare which endpoints are public

## Mental model

**Authentication** answers who is calling. **Authorization** answers whether that caller may do this action.

Spring Security is a chain of servlet filters in front of your controllers. A `SecurityFilterChain` bean replaces the old `WebSecurityConfigurerAdapter`. You describe:

- CSRF: usually off for a pure JSON API called by tokens, on for browser cookie sessions
- Which paths are public (`/ping`, `/actuator/health` if you expose it)
- Everything else authenticated

CORS is a browser rule, not a substitute for authentication. The CORS blog post covers that separately.

Default Boot security may lock the whole app with a generated password. That is a starting point, not a production policy.

## Practical example

```java
package com.briac.catalog.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/ping").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults())
            .build();
    }
}
```

HTTP Basic here is only a teaching stand-in. Lesson 12 replaces it with JWT or API keys.

## Go further on the blog

CORS handling is in [Understanding CORS in Spring Boot](/blog/understanding-cors-and-how-to-handle-it-in-spring-boot). Broader API hardening notes are in [Securing RESTful APIs](/blog/securing-restful-apis-comprehensive-guide).

## Common mistakes

- `permitAll()` on `/**` to "make the frontend work"
- Confusing CORS errors with 401/403
- Leaving CSRF enabled on a token API and wondering why POST fails

## Next lesson

Next: [JWT and API Key Approaches](/spring-boot/jwt-and-api-key).

## Official docs

- [Spring Security](https://docs.spring.io/spring-security/reference/)
- [Spring Boot Security](https://docs.spring.io/spring-boot/reference/web/spring-security.html)

## Takeaway

- AuthN is identity; AuthZ is permission
- One `SecurityFilterChain` is the policy document
- Public paths are explicit; the rest stays authenticated
