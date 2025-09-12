---
title: "Altus4 CLI"
description: "Commands and usage for the Altus4 migrations CLI"
sidebarPosition: 2
---

# CLI & Migrations Guide

Developer console for database migrations and seeding asl well as other tasks using a Laravel-like CLI.

## Overview

- Provides a Laravel-like CLI for migrations without requiring the `mysql` binary.
- Uses Node.js `mysql2` to connect directly to your database.

Install/Build

- Ensure deps installed: `npm ci`
- Build: `npm run build`

Run

- From the repo root:
  - `./bin/altus migrate`
  - or via npm: `npm run cli -- migrate`

Commands

- `migrate`            Run outstanding migrations
- `migrate:install`    Create the migrations table if missing
- `migrate:status`     Show applied and pending migrations
- `migrate:rollback`   Rollback the last batch (default), or by steps/batch
- `migrate:reset`      Rollback all migrations
- `migrate:refresh`    Reset and re-run all migrations
- `migrate:fresh`      Drop all tables and re-run migrations
- `migrate:up`         Run a specific migration file (requires `--file`)
- `migrate:down`       Rollback last migration or a specific file (requires `--file`)

Options

- `--path <dir>`       Directory containing migrations (default: `migrations`)
- `--database <name>`  Override `DB_DATABASE`
- `--step [n]`         For `migrate`: put each file in its own batch; for `rollback`: number of steps
- `--pretend`          Print SQL instead of executing
- `--seed`             Run SQL seeds from `<path>/seeds`
- `--force`            Allow running in production (`APP_ENV=production`)
- `--file <name>`      For `up/down`: base filename without extension
- `--batch <n>`        For `rollback`: rollback only the specified batch
- `--drop-views`       For `fresh`: also drop database views

Environment

- Reads `.env` automatically from the repo root.
- Uses the same env vars as the app: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_SOCKET` (optional), `APP_ENV`/`NODE_ENV`.

Examples

- Run migrations: `./bin/altus migrate`
- Show status: `./bin/altus migrate:status`
- Roll back last batch: `./bin/altus migrate:rollback`
- Roll back 2 steps: `./bin/altus migrate:rollback --step 2`
- Fresh DB (drop all tables) then migrate: `./bin/altus migrate:fresh --force`
- Run a single file: `./bin/altus migrate:up --file 003_create_analytics_table`

Behavior notes

- `--pretend` prints the SQL that would be executed. For file-based SQL the CLI prints the first 120 lines and then shows "... (truncated)" for long files to avoid overwhelming logs.
- Seed files are executed from `<path>/seeds/` after successful migrations when `--seed` is provided. Files are executed in natural sort order.

Developer & testing

- The CLI module (`src/cli/index.ts`) exports its command helpers so tests can call commands like `cmdUpOne` and `cmdDownOneOrRollback` directly. The module guards its `main()` call with `if (require.main === module)` to avoid starting when imported in tests.
- The repository's integration tests already mock `mysql2/promise` and include a test that exercises the CLI helpers; run them with `npm run test:integration`.

Seed files and directory layout

Place seed SQL files under the `migrations/seeds/` directory. Seed files are executed after migrations when `--seed` is provided and are run in natural sort order (so prefix filenames with numbers to control ordering).

Recommended layout:

```text
project-root/
├─ migrations/
│  ├─ 001_create_users_table.up.sql
│  ├─ 001_create_users_table.down.sql
│  ├─ 002_create_products_table.up.sql
│  ├─ 002_create_products_table.down.sql
│  └─ seeds/
│     ├─ 001_insert_default_roles.sql
│     ├─ 002_insert_sample_users.sql
│     └─ 003_insert_test_products.sql
```

Example seed file (`migrations/seeds/001_insert_default_roles.sql`):

```sql
-- Insert base roles used by the application
INSERT INTO roles (id, name, created_at, updated_at) VALUES (1, 'admin', NOW(), NOW());
INSERT INTO roles (id, name, created_at, updated_at) VALUES (2, 'user', NOW(), NOW());
```

Example seed file (`migrations/seeds/002_insert_sample_users.sql`):

```sql
-- Insert a sample user for local development only
INSERT INTO users (id, email, name, password_hash, role, is_active, created_at, updated_at)
VALUES (1, 'dev@example.com', 'Developer', '<bcrypt-hash-placeholder>', 'admin', 1, NOW(), NOW());
```

Notes:

- Seeds are meant for bootstrapping local/dev instances. Avoid running production-sensitive seeds in production environments.
- If `--pretend` is used, seeds will be printed but not executed.
