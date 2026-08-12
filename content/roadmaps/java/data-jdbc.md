---
title: Data - JDBC
description: "Master JDBC for Java backends: DataSource connections, PreparedStatement, transactions, ResultSet mapping, and safe resource handling."
date: 2025-01-12
tags: [java, data, jdbc, sql]
draft: false
readingTime: 16 min
---

## Why this step matters

JDBC is the low-level foundation behind many higher-level data libraries.
Understanding it helps debug connection issues, SQL behavior, and transaction boundaries.

Even if you use JPA daily, JDBC knowledge makes production incidents easier to diagnose.

## Core components

- `DataSource`: connection factory / pool entry point
- `Connection`: database session
- `PreparedStatement`: parameterized SQL
- `ResultSet`: query result rows

Prefer a pooled `DataSource` in real applications.

## Basic query example

```java
String sql = "SELECT id, email FROM users WHERE id = ?";

try (Connection con = dataSource.getConnection();
     PreparedStatement ps = con.prepareStatement(sql)) {

    ps.setLong(1, 42L);

    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            long id = rs.getLong("id");
            String email = rs.getString("email");
            System.out.println(id + " " + email);
        }
    }
}
```

Try-with-resources closes `Connection`, `PreparedStatement`, and `ResultSet` reliably.

## Why prepared statements matter

Prepared statements:

- prevent SQL injection by separating query and values
- improve reuse of execution plans

Never build SQL with user values through string concatenation.

```java
// Unsafe - do not do this
String bad = "SELECT * FROM users WHERE email = '" + email + "'";
```

## Transactions with JDBC

```java
try (Connection con = dataSource.getConnection()) {
    con.setAutoCommit(false);
    try {
        // execute multiple statements
        con.commit();
    } catch (Exception e) {
        con.rollback();
        throw e;
    }
}
```

Keep transactions short.
Do not hold a connection open while calling remote HTTP APIs.

## Mapping results

Map each row to a domain object or DTO.
Keep mapping code explicit and testable.

```java
record UserRow(long id, String email) {}

UserRow map(ResultSet rs) throws SQLException {
    return new UserRow(rs.getLong("id"), rs.getString("email"));
}
```

## Updates and generated keys

```java
String insert = "INSERT INTO users(email) VALUES (?)";
try (Connection con = dataSource.getConnection();
     PreparedStatement ps = con.prepareStatement(insert, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, "dev@briacd.com");
    ps.executeUpdate();
    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (keys.next()) {
            long id = keys.getLong(1);
        }
    }
}
```

## Common mistakes

- not closing resources (`Connection`, `Statement`, `ResultSet`)
- dynamic SQL concatenation with unsafe values
- weak transaction handling and missing rollback
- silently swallowing `SQLException`
- leaking connections under exceptions

## Practice checklist

- run a parameterized select with `PreparedStatement`
- wrap two writes in one commit/rollback transaction
- map a `ResultSet` into a record
- confirm connections return to the pool after errors

## Takeaway

1. JDBC gives precise control and debugging clarity
2. Use `PreparedStatement` by default
3. Manage transactions and resource closing carefully
4. Keep result mapping explicit and maintainable
