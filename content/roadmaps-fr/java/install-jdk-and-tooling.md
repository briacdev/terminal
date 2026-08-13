---
title: Installer le JDK et l'IDE
description: "Mettre en place un poste Java reproductible : installer JDK 21+, configurer JAVA_HOME/PATH, aligner le SDK de l’IDE et valider avec HelloWorld."
date: 2024-12-21
tags: [java, setup, jdk, tooling]
draft: false
readingTime: 10 min
---

## Pourquoi cette étape est importante

Avant d'écrire du Java, ton environnement doit être propre et reproductible. Une configuration saine évite les erreurs cachées entre les environnements local, test et production.

## Installer un JDK 21+

Utilise une distribution LTS (Temurin, Oracle JDK, Corretto ou Zulu). Vérifie l'installation :

```bash
java -version
javac -version
```

Le résultat attendu doit afficher la version `21` (ou plus).

### Liens pour télécharger un JDK

- [Eclipse Temurin JDK 21 (recommandé)](https://adoptium.net/temurin/releases/?version=21)
- [Oracle JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)
- [Amazon Corretto 21](https://aws.amazon.com/corretto/)
- [Azul Zulu JDK 21](https://www.azul.com/downloads/?version=java-21-lts&package=jdk)
- [Microsoft Build of OpenJDK](https://learn.microsoft.com/java/openjdk/download)

## Configurer `JAVA_HOME` et `PATH`

Ces variables doivent être configurées pour que le terminal, l'IDE, Maven et Gradle utilisent le même JDK.

### macOS (zsh)

```bash
# ~/.zshrc
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
```

Applique les changements :

```bash
source ~/.zshrc
```

### Linux

```bash
# ~/.bashrc ou ~/.zshrc
export JAVA_HOME=/chemin/vers/jdk-21
export PATH="$JAVA_HOME/bin:$PATH"
```

### Windows (PowerShell)

Configure les variables dans les paramètres système :

- `JAVA_HOME=C:\Program Files\Java\jdk-21`
- Ajoute `%JAVA_HOME%\bin` à `Path`

Puis rouvre le terminal et vérifie :

```bash
java -version
```

## Utiliser IntelliJ ou VS Code

Choisis un IDE et configure-le correctement.

### Recommandation

Pour les projets Java, je recommande **IntelliJ IDEA** plutôt que VS Code pour une expérience de développement plus complète et plus fiable.

### IntelliJ IDEA

- Télécharger : [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
- Définit le SDK projet sur JDK 21+
- Active l'auto-import Maven/Gradle
- Installe les plugins Java et Spring si nécessaire

### Vidéo de configuration IntelliJ

<iframe
  width="100%"
  height="420"
  src="https://www.youtube.com/embed/H_XxH66lm3U"
  title="Tutoriel de configuration IntelliJ IDEA"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>

### VS Code

- Télécharger : [Visual Studio Code](https://code.visualstudio.com/Download)
- Installe `Extension Pack for Java`
- Installe `Language Support for Java(TM) by Red Hat`
- Définit le runtime Java par défaut sur ton JDK 21+

## Checklist de validation rapide

- `java -version` et `javac -version` retournent 21+
- `JAVA_HOME` pointe vers le bon JDK
- Le SDK du projet dans l'IDE est le même JDK
- Un `HelloWorld` compile et s'exécute

## Erreurs de setup fréquentes

- le terminal utilise JDK 21 alors que l’IDE pointe encore vers un SDK plus ancien
- l’ordre du `PATH` choisit un autre `java` que `JAVA_HOME`
- plusieurs JDK installés sans défaut clair pour Maven/Gradle
- pas de vérification après modification de la config shell

## Checklist pratique

- installer une distribution LTS JDK 21+
- exporter `JAVA_HOME` et confirmer `which java` / `where java`
- créer et exécuter un `HelloWorld` local
- définir le même JDK comme SDK projet dans l’IDE

## À retenir

1. Utiliser une seule version JDK intentionnelle entre terminal et IDE
2. Préférer une distribution LTS pour l’apprentissage et l’alignement production
3. Vérifier avec `java`, `javac` et un petit cycle compile/run
4. Corriger tôt la dérive d’environnement ; cela évite des heures perdues

Avec cette base, tu peux enchaîner sur les prochaines étapes de la roadmap Java.
