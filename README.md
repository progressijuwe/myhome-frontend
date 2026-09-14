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

| Script                 | Does                           |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Dev server (Turbopack)         |
| `npm run build`        | Production build               |
| `npm start`            | Serve the production build     |
| `npm run lint`         | ESLint                         |
| `npm run lint:fix`     | ESLint with `--fix`            |
| `npm run typecheck`    | `next typegen && tsc --noEmit` |
| `npm run format`       | Prettier write                 |
| `npm run format:check` | Prettier check (for CI)        |

> `typecheck` runs `next typegen` first. That step writes `next-env.d.ts`,
> which is what declares the `*.png` / `*.jpg` modules image imports rely on.
> The file is gitignored on Next's own recommendation, so without typegen a
> fresh checkout fails every image import with TS2307 — which is exactly what
> CI does, since it type-checks without building first.

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

### Why `@emnapi/core` and `@emnapi/runtime` are devDependencies

They are not imported anywhere. They are transitive dependencies of
`@tailwindcss/oxide-wasm32-wasi` and `@img/sharp-wasm32` — optional WASM
fallbacks that npm on Windows never walks into, so their subtree was missing
from the lockfile. `npm ci` on Linux resolves those packages, finds no entry and
fails with `Missing: @emnapi/runtime@1.11.3 from lock file`.

Declaring them directly forces top-level lockfile entries that satisfy both
platforms. Remove them only if you regenerate the lockfile on Linux, which fixes
the same gap at the source.

### Secrets the deploy jobs need

Add these under **Settings → Secrets and variables → Actions**:

| Secret              | Where to find it                   |
| ------------------- | ---------------------------------- |
| `VERCEL_TOKEN`      | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID`     | The link file (see below)          |
| `VERCEL_PROJECT_ID` | Same file                          |

To produce the link file, link the repo to a Vercel project. There is no need to
install the CLI — `npx` fetches it, and the workflow installs its own copy:

```bash
npx vercel login
npx vercel link
```

Both commands are interactive and open a browser. `.vercel/` is gitignored.

Which file you get depends on how you linked, and the two have different shapes:

| File                   | Created by           | `VERCEL_ORG_ID`     | `VERCEL_PROJECT_ID` |
| ---------------------- | -------------------- | ------------------- | ------------------- |
| `.vercel/project.json` | `vercel link`        | `orgId`             | `projectId`         |
| `.vercel/repo.json`    | `vercel link --repo` | `projects[0].orgId` | `projects[0].id`    |

This prints the right pair either way:

```bash
node -e "const f=require('fs');const r='.vercel/repo.json',p='.vercel/project.json';const d=JSON.parse(f.readFileSync(f.existsSync(r)?r:p,'utf8'));const x=d.projects?d.projects[0]:d;console.log('VERCEL_ORG_ID    ',x.orgId);console.log('VERCEL_PROJECT_ID',x.projectId||x.id)"
```

CI never reads these files — it is a fresh checkout and `.vercel/` is
gitignored. The CLI takes the ids from the environment variables instead, which
is why the workflow sets all three.

If you would rather not use the CLI at all, both ids are in the dashboard:
**Project Settings → General** for the project id, and your account or team
settings for the org id.

`NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_API_URL` are **not** set in the workflow
for deploys — `vercel pull` takes them from the Vercel project, so production
and preview can point at different APIs. The placeholders in the `build` job are
scoped to that job for exactly this reason.

Until all three exist the deploy jobs **skip** rather than fail — a
`deploy-config` job checks for them first and writes what is missing to the run
summary. An unconfigured repo therefore gets a green pipeline, not a permanent
red X that people learn to ignore. The three check jobs run either way.

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
