---
title: OOP - Classes and Objects
description: Learn what OOP is in Java and understand classes, objects, fields, constructors, instance vs static members, and encapsulation.
date: 2024-12-26
tags: [java, oop, classes, objects, encapsulation]
draft: false
readingTime: 12 min
---

## What is OOP in Java

OOP (Object-Oriented Programming) is a way of modeling software around **objects** that combine:

- state (data)
- behavior (methods)

In Java, OOP helps structure code into understandable components with clear responsibilities.

Instead of writing everything in one procedural flow, you define domain entities (User, Order, Product) and the operations they support.

## Classes and objects

A **class** is a blueprint.
An **object** is an instance created from that blueprint.

```java
class User {
    String name;
    int age;

    void greet() {
        System.out.println("Hi, I am " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        User u = new User(); // object creation
        u.name = "Briac";
        u.age = 28;
        u.greet();
    }
}
```

`User` is the class, `u` is an object instance.

## Fields and constructors

### Fields

Fields store object state.

```java
class Product {
    String id;
    String name;
    double price;
}
```

### Constructors

A constructor initializes an object at creation time.
It has the same name as the class and no return type.

```java
class Product {
    String id;
    String name;
    double price;

    Product(String id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}
```

Using `this` explicitly maps constructor parameters to fields.

### Constructor overloading

You can provide multiple constructors with different signatures.

```java
class Product {
    String id;
    String name;
    double price;

    Product(String id, String name) {
        this(id, name, 0.0);
    }

    Product(String id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}
```

## Instance vs static members

### Instance members

Belong to each object independently.

```java
class Counter {
    int value = 0; // instance field

    void increment() { // instance method
        value++;
    }
}
```

Each instance has its own `value`.

### Static members

Belong to the class itself, shared across all instances.

```java
class Counter {
    static int created = 0;
    int value = 0;

    Counter() {
        created++;
    }

    static int getCreatedCount() {
        return created;
    }
}
```

Use static members for class-level utilities or shared counters, not for object-specific state.

## Encapsulation

Encapsulation means protecting internal state and exposing controlled access.
In practice:

- keep fields private
- expose behavior through methods (getters/setters or domain methods)

```java
class BankAccount {
    private double balance;

    BankAccount(double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Initial balance must be >= 0");
        }
        this.balance = initialBalance;
    }

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be > 0");
        }
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalArgumentException("Invalid withdraw amount");
        }
        balance -= amount;
    }
}
```

This prevents invalid states and keeps invariants inside the class.

## Good OOP habits early

1. Give each class one clear responsibility
2. Keep fields private by default
3. Prefer behavior methods (`deposit`) over raw setters when business rules exist
4. Use constructors to ensure valid initial state
5. Avoid static state unless truly shared at class level

## Common beginner mistakes

- Public mutable fields everywhere
- Treating classes as simple data bags with no behavior
- Overusing static fields for instance logic
- Creating constructors that allow invalid objects

## Small end-to-end example

```java
class Task {
    private final String title;
    private boolean done;

    Task(String title) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        this.title = title;
        this.done = false;
    }

    public String getTitle() { return title; }
    public boolean isDone() { return done; }

    public void markDone() {
        this.done = true;
    }
}
```

This class demonstrates constructor validation, private fields, and behavior-driven updates.

## What to practice next

Before moving on, make sure you can:

- create a class with private fields and a validating constructor
- distinguish instance members from `static` members
- expose behavior through methods instead of public fields

Next in this roadmap: inheritance and polymorphism, then interfaces and abstract classes.

