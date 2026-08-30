# template-saas-ui

[![CI](https://github.com/snc-software/template-saas-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/snc-software/template-saas-ui/actions/workflows/ci.yml)

Template SaaS-style application. This is a **GitHub template repository** — use it as the starting point for new front-end applications rather than cloning it directly.

## Using this template

1. Click **Use this template** on the repository page (or `gh repo create <name> --template snc-software/template-saas-ui`).
2. Update the `name` field in `package.json` to match the new repository.
3. Replace this README's content with documentation for the new project.

## Tech stack

- [Vite](https://vite.dev) — build tooling
- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [TanStack Router](https://tanstack.com/router) — file-based routing (`src/routes`)
- [TanStack Query](https://tanstack.com/query) — data fetching
- [@snc-software/snc-ui](https://github.com/snc-software) — component library (use this before building custom components)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) — unit/component testing
- [ESLint](https://eslint.org) + [Prettier](https://prettier.io) — linting and formatting

## Prerequisites

- Node.js `>=24.14.1` (see `engines` in `package.json`)
- Access to the `@snc-software` GitHub Packages registry, since `@snc-software/snc-ui` is published there rather than to the public npm registry

### Registry authentication

`.npmrc` maps the `@snc-software` scope to `https://npm.pkg.github.com`. Authenticate npm against it with a GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) that has `read:packages` scope:

```sh
npm config set //npm.pkg.github.com/:_authToken=<your-token> --location=user
```

CI authenticates automatically using the workflow's built-in `GITHUB_TOKEN` — no setup required there.

## Getting started

```sh
npm install
npm run dev
```

## Available scripts

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `npm run dev`           | Start the Vite dev server                        |
| `npm run build`         | Type-check and build for production              |
| `npm run preview`       | Preview the production build locally             |
| `npm run typecheck`     | Type-check the project without emitting output   |
| `npm run test`          | Run the test suite once                          |
| `npm run test:coverage` | Run the test suite with coverage (80% threshold) |
| `npm run lint`          | Lint the codebase with ESLint                    |
| `npm run format`        | Format the codebase with Prettier                |
| `npm run format:check`  | Check formatting without writing changes         |

## Project structure

```
src
├── components   # Shared components
├── queries      # TanStack Query hooks and apiConfig.ts (route definitions)
├── routes       # TanStack Router file-based routes (__root.tsx, _layout.tsx, ...)
├── utils        # Shared utilities (e.g. cn.ts)
├── index.css
└── tailwind-theme.css   # Tailwind colours/fonts MUST be defined here only
tests
├── setup.ts     # Vitest setup (jest-dom, matchMedia polyfill)
└── utils        # Shared test utilities
```

Co-locate a component's styles, types, constants, and tests with the component itself (e.g. `AppShell.tsx`, `AppShell.styles.ts`, `AppShell.types.ts`, `AppShell.test.tsx`).

## Continuous integration

Every push and pull request against `main` runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml), which checks:

- **Lint** — `npm run lint`
- **Format** — `npm run format:check`
- **Typecheck** — `npm run typecheck`
- **Test** — `npm run test:coverage`
- **Build** — `npm run build` (runs after the checks above pass)
