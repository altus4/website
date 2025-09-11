# Repository Guidelines

## Project Structure & Module Organization

- App code lives in `src/`:
  - `components/` (PascalCase SFCs), `pages/` (route views), `composables/` (`useXxx.ts`), `stores/` (Pinia: `useXxxStore.ts`), `lib/` (helpers), `assets/` (static).
  - Example: `src/components/dashboard/RecentActivity.vue`.
- Public assets in `public/` (served as-is). Build output in `dist/`.
- Documentation in `docs/` (VitePress). Do not edit `dist/` directly.

## Build, Test, and Development Commands

- `npm run dev` — Start local dev server (Vite) at <http://localhost:5173>.
- `npm run build` — Type-check (`vue-tsc`) and build for production to `dist/`.
- `npm run preview` — Preview the production build locally.
- `npm run docs:dev|build|preview` — Work with VitePress docs.
- `npm run build:all` — Build app, docs, and copy docs into `dist/docs/`.
- `npm run lint` / `npm run lint:fix` — Lint (ESLint). `lint:fix` applies fixes.
- `npm run format` / `npm run format:check` — Prettier + markdownlint format/check.

## Coding Style & Naming Conventions

- TypeScript, Vue 3 SFCs, Tailwind CSS.
- Formatting via Prettier (2 spaces, semicolons, single quotes, 80 char width). See `.prettierrc` and `.editorconfig`.
- ESLint enforces: no unused vars, semi required, Vue rules (multi-word names off). See `eslint.config.js`.
- Naming: Components `PascalCase.vue`; composables `useXxx.ts`; stores `useXxxStore.ts`; utilities `camelCase.ts`.

## Testing Guidelines

- No application test suite is configured in this repo. Docs may reference Jest, but it does not apply here.
- If you introduce tests, prefer Vitest + Vue Test Utils; place in `src/**/__tests__/` and add scripts (`test`, `test:watch`).

## Commit & Pull Request Guidelines

- Keep commits focused; prefer Conventional Commit style (e.g., `feat:`, `fix:`, `chore:`).
- Before pushing: `npm run format:check` and `npm run build` must pass.
- PRs should include: clear description, linked issue, screenshots/GIFs for UI changes, and notes for docs updates if relevant.

## Security & Configuration Tips

- Do not commit secrets. Use `.env` (see `.env.example`). Only `VITE_`-prefixed vars are exposed to the client.
- Avoid editing `dist/` and generated files. Use `scripts/` utilities for docs sync when needed (`npm run docs:sync`).

## Agent-Specific Instructions

- Make minimal, targeted changes; match existing patterns and file layout.
- Run linters/formatters via provided npm scripts; don’t reformat unrelated files.
- Place new UI in `src/components/`, new logic in `composables/` or `lib/` as appropriate.
