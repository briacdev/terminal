---
title: Install PostgreSQL Locally and Connect with psql
description: Install PostgreSQL on your machine, create a role and a database, then connect with psql or a GUI client.
date: 2026-04-02
tags: [postgresql, install, psql, setup]
draft: false
readingTime: 9 min
---

## The goal of this step

You need a local PostgreSQL server you can break without fear. Cloud instances are useful later. For learning, a laptop install is faster: you can create databases, drop them, and inspect catalogs immediately.

By the end of this page you should be able to start PostgreSQL, open `psql`, and run `SELECT version();`.

## Install a current PostgreSQL

Pick one official path for your OS. Avoid random third-party installers.

- **Linux (Debian/Ubuntu)**: follow [Linux downloads](https://www.postgresql.org/download/linux/)
- **macOS**: Postgres.app or Homebrew, from [macOS downloads](https://www.postgresql.org/download/macosx/)
- **Windows**: the EDB installer from [Windows downloads](https://www.postgresql.org/download/windows/)
- **Docker**: useful if you want an isolated server without installing packages

After install, check that the server is running and that `psql` is on your `PATH`:

```bash
psql --version
```

You should see a version number. PostgreSQL 16 or 17 is a solid learning baseline.

## Create a role and a database

PostgreSQL connections always use a **role**. On many local installs, your OS user is already a superuser role. Create an app-style role anyway so your habits match production:

```sql
CREATE ROLE shop_app LOGIN PASSWORD 'local-only-secret';
CREATE DATABASE shop OWNER shop_app;
GRANT ALL PRIVILEGES ON DATABASE shop TO shop_app;
```

Use a password manager even locally. Do not reuse production secrets.

Connect to the new database:

```bash
psql -h localhost -U shop_app -d shop
```

If peer authentication blocks password login on Linux, use `localhost` (`-h localhost`) so PostgreSQL uses TCP plus `pg_hba.conf` password rules.

## First commands in psql

Useful meta-commands:

```text
\l          list databases
\c shop     connect to database shop
\dt         list tables
\d customers
\q          quit
```

Then run a real SQL statement:

```sql
SELECT version();
SELECT current_user, current_database();
```

If those two queries work, your environment is ready.

## GUI tools are optional

`psql` should stay your default because error messages and scripts transfer to servers. A GUI is fine for browsing tables:

- [pgAdmin](https://www.pgadmin.org/)
- DBeaver, TablePlus, or the database tool in your IDE

Do not skip `psql`. Production incidents are solved in a terminal more often than in a GUI.

## Connection string shape

Applications usually receive a URL:

```text
postgresql://shop_app:local-only-secret@localhost:5432/shop
```

Remember the parts: role, password, host, port (`5432` by default), database name. The next page explains why the database name is not the same thing as a schema.

## Common setup mistakes

- Installing a client (`psql`) without installing the server
- Connecting to `postgres` forever instead of creating an app database
- Using the `postgres` superuser from application code
- Forgetting `-h localhost` on Linux and hitting peer auth errors

## Checklist

- `psql --version` works.
- You can connect to a database you created, not only `postgres`.
- `SELECT current_user, current_database();` returns the expected values.
- You have a connection URL written down for later application work.

## Next step

Learn how databases, roles, and schemas differ, then set `search_path` on purpose instead of dumping every table into `public`.
