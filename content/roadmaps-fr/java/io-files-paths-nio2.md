---
title: I/O - Fichiers, Paths, NIO.2
description: "Utiliser NIO.2 en Java pour des I/O fichiers sûres : APIs Path et Files, lecture/écriture bufferisée, parcours de répertoires et validation de chemins."
date: 2025-01-06
tags: [java, io, nio2, files]
draft: false
readingTime: 15 min
---

## Pourquoi cette étape est importante

Les backends lisent et écrivent constamment des fichiers : imports, logs, exports, config.
NIO.2 (`java.nio.file`) est l’API moderne et sûre pour ce travail.

La maîtriser évite fuites de ressources, bugs d’encodage et path traversal.

## `Path` et `Files`

Utilisez `Path` pour les emplacements et `Files` pour les opérations.

```java
Path report = Path.of("data", "report.txt");
Files.createDirectories(report.getParent());
Files.writeString(report, "hello\n");
String content = Files.readString(report);
```

Préférez `Path.of(...)` à la concaténation de chaînes.

## Patterns de lecture / écriture

Pour les petits fichiers :

- `Files.readString(...)`
- `Files.writeString(...)`

Pour un contenu plus large, utilisez des flux/readers bufferisés :

```java
try (BufferedReader reader = Files.newBufferedReader(report, StandardCharsets.UTF_8)) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

Fermez toujours les ressources avec try-with-resources.

## Parcours de répertoires

```java
Path root = Path.of("logs");
try (Stream<Path> stream = Files.walk(root)) {
    stream
        .filter(Files::isRegularFile)
        .forEach(System.out::println);
}
```

- `Files.list(...)` : un niveau
- `Files.walk(...)` : parcours récursif

Fermez le stream pour libérer les ressources filesystem.

## Options d’ouverture utiles

```java
Files.writeString(
    report,
    "new line\n",
    StandardOpenOption.CREATE,
    StandardOpenOption.APPEND
);
```

Options courantes :

- `CREATE`
- `TRUNCATE_EXISTING`
- `APPEND`
- `CREATE_NEW` (échoue si le fichier existe déjà)

## Encodage et texte

Soyez explicite sur le charset (`UTF_8`) dès que le texte traverse des systèmes.
Les hypothèses de charset par défaut cassent d’une machine à l’autre.

## Gestion d’erreurs et sécurité

Les I/O lèvent des exceptions checked (`IOException`). Gérez-les explicitement.

Aussi :

- valider les chemins issus d’entrées utilisateur
- rejeter les segments `..` qui sortent d’une racine autorisée
- créer les répertoires parents avant d’écrire
- éviter de charger d’énormes fichiers entièrement en mémoire

```java
Path root = Path.of("/var/app/uploads").toAbsolutePath().normalize();
Path target = root.resolve(userProvided).normalize();
if (!target.startsWith(root)) {
    throw new SecurityException("Invalid path");
}
```

## Erreurs fréquentes

- oublier try-with-resources
- charger de très gros fichiers entièrement en mémoire
- construire des chemins par concaténation
- écrire sans créer les parents
- faire confiance à un chemin relatif fourni par l’utilisateur

## Checklist pratique

- écrire et lire un fichier UTF-8 avec `Files`
- ajouter une ligne avec des open options
- lister récursivement les fichiers d’un dossier
- valider un chemin utilisateur contre une racine autorisée

## À retenir

1. Utiliser `Path` + `Files` comme API fichiers par défaut
2. Choisir des APIs bufferisées pour les gros fichiers
3. Parcourir avec `Files.list` / `Files.walk`
4. Gérer `IOException` et valider les chemins
