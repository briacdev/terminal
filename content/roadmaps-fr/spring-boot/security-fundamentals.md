---
title: Fondamentaux sécurité
description: "Protéger une API Spring Boot avec Spring Security: authentification vs autorisation, filter chain, et règles d'endpoints."
date: 2026-03-22
tags: [spring-boot, security, spring-security]
draft: false
readingTime: 11 min
---

## Où se situe cette leçon

L'API a des données. L'accès anonyme est le risque suivant. Cette leçon, c'est le modèle Spring Security. JWT et clés API sont la leçon suivante.

## Ce que vous allez apprendre

- Authentification vs autorisation
- Comment la filter chain intercepte HTTP
- Comment déclarer les endpoints publics

## Modèle mental

**Authentification**: qui appelle. **Autorisation**: a-t-il le droit de faire cette action.

Spring Security est une chaîne de filtres servlet devant vos controllers. Un bean `SecurityFilterChain` décrit:

- CSRF: souvent off pour une API JSON à tokens, on pour des sessions cookie
- Les chemins publics (`/ping`)
- Tout le reste authentifié

CORS est une règle navigateur, pas un substitut d'authentification.

## Exemple pratique

```java
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
```

HTTP Basic n'est qu'un stand-in pédagogique. La leçon 12 le remplace.

## Aller plus loin sur le blog

CORS: [Understanding CORS](/fr/blog/understanding-cors-and-how-to-handle-it-in-spring-boot). Durcissement plus large: [Securing RESTful APIs](/fr/blog/securing-restful-apis-comprehensive-guide).

## Erreurs fréquentes

- `permitAll()` sur `/**` pour "faire marcher le front"
- Confondre une erreur CORS avec un 401/403
- Laisser CSRF actif sur une API à token

## Leçon suivante

Suite: [Approches JWT et API Key](/fr/spring-boot/jwt-and-api-key).

## Documentation officielle

- [Spring Security](https://docs.spring.io/spring-security/reference/)
- [Spring Boot Security](https://docs.spring.io/spring-boot/reference/web/spring-security.html)

## À retenir

- AuthN = identité; AuthZ = permission
- Un `SecurityFilterChain` est le document de politique
- Les chemins publics sont explicites
