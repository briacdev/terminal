---
title: Functional Java - Streams
description: "Process collections with Java Streams: map, filter, reduce, collectors, readability rules, and when a plain loop is better."
date: 2025-01-04
tags: [java, functional, streams, collections]
draft: false
readingTime: 16 min
---

## Why this step matters

Streams let you express data transformations clearly, especially for filtering, aggregation, and reporting logic.
Used well, they reduce boilerplate. Used badly, they hurt readability.

Streams shine for declarative pipelines over collections.

## Stream pipeline mental model

A stream pipeline has three parts:

1. Source (`List`, `Set`, array, etc.)
2. Intermediate operations (`filter`, `map`, `sorted`)
3. Terminal operation (`collect`, `forEach`, `count`, `reduce`)

```java
List<String> names = List.of("alice", "bob", "anna");

List<String> result = names.stream()
    .filter(n -> n.startsWith("a"))
    .map(String::toUpperCase)
    .toList();

System.out.println(result); // [ALICE, ANNA]
```

Intermediate operations are lazy; nothing runs until a terminal operation.

## `map`, `filter`, `reduce`

- `filter`: keep matching elements
- `map`: transform each element
- `reduce`: combine elements into one result

```java
int total = List.of(10, 20, 30).stream()
    .filter(n -> n >= 20)
    .reduce(0, Integer::sum);

System.out.println(total); // 50
```

Also useful:

- `flatMap` for one-to-many expansion
- `distinct`, `sorted`, `limit`, `skip`

## Collectors

Collectors shape the final result.

```java
Map<String, Long> countByRole = List.of("admin", "user", "admin").stream()
    .collect(Collectors.groupingBy(r -> r, Collectors.counting()));

System.out.println(countByRole); // {admin=2, user=1}
```

Useful collectors:

- `toList()` / `toSet()`
- `groupingBy(...)`
- `partitioningBy(...)`
- `joining(...)`
- `counting()`, `summingInt(...)`

## Avoid overusing streams

Streams are not always the best choice.
Prefer loops when:

- logic is highly stateful
- multiple side effects are needed
- debugging a long chain is harder than reading a simple loop

## Parallel streams caution

`parallelStream()` can help CPU-bound bulk work, but it can also hurt latency and make ordering/debugging harder.
Measure before enabling parallelism.

## Common mistakes

- side effects inside `map` / `filter`
- creating very long chains with unclear intent
- using streams in hot loops without measuring impact
- assuming parallel streams always improve performance
- mutating shared collections from inside a stream

## Practical rule

Use streams for declarative data transformations.
Use loops for complex control flow and mutable workflows.

## Practice checklist

- filter and map a list into a new immutable list
- group items with `Collectors.groupingBy`
- rewrite one stream as a loop and compare readability
- find and remove a side effect from a `map` call

## Takeaway

1. Think in pipeline steps: source → transform → terminal
2. Master `map`, `filter`, `reduce`, `collect`
3. Keep stream code short and readable
4. Do not force streams when a loop is clearer
