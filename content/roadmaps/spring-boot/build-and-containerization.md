---
title: Build and Containerization
description: "Package a Spring Boot API as an executable jar, build a Docker image, and inject runtime configuration outside the image."
date: 2026-03-30
tags: [spring-boot, docker, build]
draft: false
readingTime: 10 min
---

## Where this lesson sits

The app can be observed. Now package it the same way production will run it: an executable jar, then a container, with config injected at runtime.

## What you will learn

- How Boot builds a fat jar
- A simple Docker image strategy
- Why config and secrets stay out of the image

## Mental model

`./mvnw -DskipTests package` produces a jar with an embedded server. `java -jar` is enough to run it. Docker wraps that jar plus a JDK/JRE.

Prefer a small runtime image and a non-root user. Layering (Boot 3 layered jars or a multi-stage build) speeds rebuilds. Do not bake `application-prod.yml` passwords into the image. Pass `SPRING_DATASOURCE_PASSWORD` at runtime.

The image should be immutable. Changing a feature flag should not require a new Dockerfile if an env var can do it.

## Practical example

```dockerfile
FROM eclipse-temurin:21-jre
RUN useradd -r spring
WORKDIR /app
COPY target/catalog-api.jar app.jar
USER spring
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

```bash
./mvnw -DskipTests package
docker build -t catalog-api:local .
docker run --rm -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=local \
  catalog-api:local
```

Health from lesson 18 becomes `HEALTHCHECK` or a Kubernetes probe on `/actuator/health`.

## Common mistakes

- Running the container as root
- Copying the Maven cache and source tree into the final image
- Hardcoding the production JDBC URL in the Dockerfile

## Next lesson

Next: [CI/CD Pipeline](/spring-boot/ci-cd-pipeline).

## Official docs

- [Packaging](https://docs.spring.io/spring-boot/reference/packaging/index.html)
- [Container images](https://docs.spring.io/spring-boot/reference/packaging/container-images/index.html)

## Takeaway

- The jar is the unit of deployment; Docker is a wrapper
- Runtime config enters through the environment
- Images stay small, non-root, and free of secrets
