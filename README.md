# Next Starter Kit

A production-ready Next.js 16 starter for business sites, SaaS apps, dashboards
and marketing sites. Clone it and start building — the tooling, architecture and
design system are already decided.

## Getting started

Requires **Node 22.22.1 or newer** (`lint-staged` sets that floor, and the
lockfile is written by the npm that ships with Node 22+).

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `/style-guide` is a living
page showing every token and component.

## Scripts

| Script                 | Does                       |
| ---------------------- | -------------------------- |
| `npm run dev`          | Dev server (Turbopack)     |
| `npm run build`        | Production build           |
| `npm start`            | Serve the production build |
| `npm run lint`         | ESLint                     |
| `npm run lint:fix`     | ESLint with `--fix`        |
| `npm run typecheck`    | `tsc --noEmit`             |
| `npm run format`       | Prettier write             |
| `npm run format:check` | Prettier check (for CI)    |

## Continuous integration and deployment

`.github/workflows/ci.yml` runs on every push and pull request to `main` and
`develop`:

| Job                 | Does                                                        |
| ------------------- | ----------------------------------------------------------- |
| `quality`           | `format:check`, `lint`, `typecheck` — all three always run  |
| `build`             | `next build` on Node 22 and 24, with `.next/cache` restored |
| `security`          | `npm audit`, failing only on high and critical              |
| `deploy-preview`    | Vercel preview for a pull request, once the checks pass     |
| `deploy-production` | Vercel production on `main`, once the checks pass           |

The deploy jobs `needs` the three check jobs, which is what makes "tests first"
a guarantee rather than a race — and the reason deployment lives in this
workflow instead of one of its own.

### Secrets the deploy jobs need

Add these under **Settings → Secrets and variables → Actions**:

| Secret              | Where to find it                   |
| ------------------- | ---------------------------------- |
| `VERCEL_TOKEN`      | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID`     | `.vercel/project.json` (see below) |
| `VERCEL_PROJECT_ID` | Same file                          |

To produce that file, link the repo to a Vercel project. There is no need to
install the CLI — `npx` fetches it, and the workflow installs its own copy:

```bash
npx vercel login
npx vercel link
cat .vercel/project.json
```

Both commands are interactive and open a browser. `.vercel/` is gitignored.

If you would rather not use the CLI at all, both ids are in the dashboard:
**Project Settings → General** for the project id, and your account or team
settings for the org id.

`NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_API_URL` are **not** set in the workflow
for deploys — `vercel pull` takes them from the Vercel project, so production
and preview can point at different APIs. The placeholders in the `build` job are
scoped to that job for exactly this reason.

Until the secrets exist the two deploy jobs will fail; the three check jobs run
regardless.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Radix UI · CVA ·
Lucide · React Hook Form · Zod · TanStack Query · Axios · next-themes ·
ESLint · Prettier · Husky · lint-staged

## What's in the box

- **Design system** — semantic type scale, named spacing, one-knob radius, and
  light/dark palettes in `oklch`. No component hardcodes a colour.
- **11 UI primitives** — Button, Card, Badge, Input, Textarea, Spinner, Avatar,
  Alert, Modal, Tabs, Accordion. Radix underneath wherever focus or keyboard
  navigation is involved.
- **Typed API layer** — axios instance with interceptors that normalise every
  failure into a single `ApiError`, so nothing downstream touches an axios type.
- **Forms** — React Hook Form + Zod, including replaying server-side field
  errors onto the matching inputs.
- **Server-first rendering** — Server Components by default; only interactive
  leaves ship JavaScript.
- **Validated environment** — a missing variable fails the build, not production.

## Documentation

| Doc                                             | Covers                                |
| ----------------------------------------------- | ------------------------------------- |
| [architecture.md](docs/architecture.md)         | Rendering model, API layer, data flow |
| [folder-structure.md](docs/folder-structure.md) | Where things go, and why              |
| [components.md](docs/components.md)             | Every component's API                 |
| [design-system.md](docs/design-system.md)       | Tokens, theming, adding a colour      |
| [conventions.md](docs/conventions.md)           | Naming, imports, client/server rules  |
| [git-workflow.md](docs/git-workflow.md)         | Branching, commits, hooks             |
| [roadmap.md](docs/roadmap.md)                   | What's missing and what's next        |

## Using it for a real project

1. Update `src/config/site.ts` — name, description, URL, links
2. Replace the mark in `src/components/shared/Logo/Logo.tsx`
3. Set brand colours in `src/styles/tokens.css` (both the `:root` and `.dark` blocks)
4. Delete `src/components/sections/Showcase/` and reset `src/app/page.tsx`
5. Point `NEXT_PUBLIC_API_URL` at your backend
6. Add a real `/og.png` at 1200×630

Before shipping anything with real credentials, read the security note in
`src/lib/token-store.ts`.
