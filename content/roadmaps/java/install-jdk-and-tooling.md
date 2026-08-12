---
title: Install JDK and Tooling
description: "Set up a reproducible Java workstation: install JDK 21+, configure JAVA_HOME/PATH, align your IDE SDK, and validate with HelloWorld."
date: 2024-12-21
tags: [java, setup, jdk, tooling]
draft: false
readingTime: 10 min
---

## Why this step matters

Before writing Java code, your environment must be correct and reproducible. A clean setup avoids hidden issues between local, staging, and production environments.

## Install JDK 21+

Use an LTS distribution (Temurin, Oracle JDK, Corretto, or Zulu). Verify installation:

```bash
java -version
javac -version
```

Expected output should show version `21` (or newer).

### JDK download links

- [Eclipse Temurin JDK 21 (recommended)](https://adoptium.net/temurin/releases/?version=21)
- [Oracle JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)
- [Amazon Corretto 21](https://aws.amazon.com/corretto/)
- [Azul Zulu JDK 21](https://www.azul.com/downloads/?version=java-21-lts&package=jdk)
- [Microsoft Build of OpenJDK](https://learn.microsoft.com/java/openjdk/download)

## Set `JAVA_HOME` and `PATH`

Make sure both are configured system-wide so terminal, IDE, Maven, and Gradle all use the same JDK.

### macOS (zsh)

```bash
# ~/.zshrc
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
```

Apply changes:

```bash
source ~/.zshrc
```

### Linux

```bash
# ~/.bashrc or ~/.zshrc
export JAVA_HOME=/path/to/jdk-21
export PATH="$JAVA_HOME/bin:$PATH"
```

### Windows (PowerShell)

Set environment variables in System Settings:

- `JAVA_HOME=C:\Program Files\Java\jdk-21`
- Add `%JAVA_HOME%\bin` to `Path`

Then reopen your terminal and check:

```bash
java -version
```

## Use IntelliJ or VS Code

Choose one IDE and configure it properly.

### Recommendation

For Java projects, I recommend using **IntelliJ IDEA** over VS Code for a more complete and reliable developer experience.

### IntelliJ IDEA

- Download: [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
- Set project SDK to JDK 21+
- Enable auto-import for Maven/Gradle
- Install Java and Spring plugins if needed

### IntelliJ Setup Video

<iframe
  width="100%"
  height="420"
  src="https://www.youtube.com/embed/H_XxH66lm3U"
  title="IntelliJ IDEA setup tutorial"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>

### VS Code

- Download: [Visual Studio Code](https://code.visualstudio.com/Download)
- Install `Extension Pack for Java`
- Install `Language Support for Java(TM) by Red Hat`
- Set default Java runtime to your JDK 21+

## Quick validation checklist

- `java -version` and `javac -version` return 21+
- `JAVA_HOME` points to your intended JDK
- IDE project SDK uses the same JDK
- A simple `HelloWorld` compiles and runs

## Common setup mistakes

- terminal uses JDK 21 while the IDE still points to an older SDK
- `PATH` order picks a different `java` than `JAVA_HOME`
- multiple JDKs installed with no clear default for Maven/Gradle
- skipping verification after changing shell config

## Practice checklist

- install one LTS JDK 21+ distribution
- export `JAVA_HOME` and confirm `which java` / `where java`
- create and run a local `HelloWorld`
- set the same JDK as the project SDK in your IDE

## Takeaway

1. Use one intentional JDK version across terminal and IDE
2. Prefer an LTS distribution for learning and production alignment
3. Verify with `java`, `javac`, and a tiny compile/run cycle
4. Fix environment drift early; it saves hours later

With this baseline, you are ready for the next Java roadmap steps.
