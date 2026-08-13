---
title: I/O - Files, Paths, NIO.2
description: "Use Java NIO.2 for safe file I/O: Path and Files APIs, buffered read/write, directory traversal, and path-validation basics."
date: 2025-01-06
tags: [java, io, nio2, files]
draft: false
readingTime: 15 min
---

## Why this step matters

Backend systems constantly read and write files: imports, logs, exports, and config.
NIO.2 (`java.nio.file`) is the modern, safe API for this work.

Mastering it helps you avoid resource leaks, encoding bugs, and path-traversal issues.

## `Path` and `Files`

Use `Path` for locations and `Files` for operations.

```java
Path report = Path.of("data", "report.txt");
Files.createDirectories(report.getParent());
Files.writeString(report, "hello\n");
String content = Files.readString(report);
```

Prefer `Path.of(...)` over string concatenation.

## Read and write patterns

For small files:

- `Files.readString(...)`
- `Files.writeString(...)`

For larger content, use buffered streams/readers:

```java
try (BufferedReader reader = Files.newBufferedReader(report, StandardCharsets.UTF_8)) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

Always close resources with try-with-resources.

## Directory traversal

```java
Path root = Path.of("logs");
try (Stream<Path> stream = Files.walk(root)) {
    stream
        .filter(Files::isRegularFile)
        .forEach(System.out::println);
}
```

- `Files.list(...)`: one directory level
- `Files.walk(...)`: recursive traversal

Close the stream to release filesystem resources.

## Useful open options

```java
Files.writeString(
    report,
    "new line\n",
    StandardOpenOption.CREATE,
    StandardOpenOption.APPEND
);
```

Common options:

- `CREATE`
- `TRUNCATE_EXISTING`
- `APPEND`
- `CREATE_NEW` (fail if already exists)

## Encoding and text

Be explicit with charset (`UTF_8`) whenever text crosses systems.
Default charset assumptions break when machines differ.

## Error handling and safety

I/O throws checked exceptions (`IOException`). Handle failures explicitly.

Also:

- validate paths from user input
- reject `..` segments that escape an allowed root
- create parent directories before writing
- avoid loading huge files fully into memory

```java
Path root = Path.of("/var/app/uploads").toAbsolutePath().normalize();
Path target = root.resolve(userProvided).normalize();
if (!target.startsWith(root)) {
    throw new SecurityException("Invalid path");
}
```

## Common mistakes

- forgetting try-with-resources
- loading very large files entirely in memory
- building paths with string concatenation
- writing files without creating parent directories
- trusting user-provided relative paths

## Practice checklist

- write and read a UTF-8 text file with `Files`
- append a line using open options
- list files recursively under a folder
- validate a user path against an allowed root

## Takeaway

1. Use `Path` + `Files` as the default file API
2. Choose buffered APIs for larger files
3. Traverse directories with `Files.list` / `Files.walk`
4. Handle `IOException` and validate file paths
