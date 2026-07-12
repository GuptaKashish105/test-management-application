# Test Management Application

Frontend for the Preproute test management assessment. See `docs/` for the assignment requirements, API documentation, and Figma references.

## Stack

- Vite + React + TypeScript
- Tailwind CSS (v4, CSS-first theme — see `src/styles/tokens.css`)
- React Router
- TanStack Query
- Axios
- React Hook Form + Zod

## Getting started

```bash
npm install
cp .env.example .env   # fill in VITE_API_BASE_URL (see docs/api/backend-base-url.md)
npm run dev
```

## Demo Mode (local development only)

When the real backend is unreachable, set `VITE_DEMO_MODE=true` in `.env` (or `.env.local`) and restart `npm run dev`. Every API call is then served from an in-memory mock database (`src/services/demoMode/`) instead of the network — you can log in with any non-empty user ID/password, and the Dashboard, Create/Edit Test, Add Questions, and Preview & Publish flows all work end-to-end against realistic seeded data. A "Demo Mode" badge appears at the bottom of the screen whenever it's active, and a console message confirms it on startup.

To restore real backend calls, set `VITE_DEMO_MODE=false` (or delete the line) and restart the dev server — no other code changes are needed. The switch is read once from environment config (`src/config/env.ts`) and short-circuits a single function (`apiRequest` in `src/services/apiClient.ts`); no service file, page, or component has any awareness of Demo Mode. It has no effect on `npm run build` unless the flag is explicitly set for that build, and should never be set in a deployed environment.

## Scripts

| Command                                   | Purpose                             |
| ----------------------------------------- | ----------------------------------- |
| `npm run dev`                             | Start the dev server                |
| `npm run build`                           | Type-check and build for production |
| `npm run preview`                         | Preview the production build        |
| `npm run lint` / `npm run lint:fix`       | ESLint                              |
| `npm run format` / `npm run format:check` | Prettier                            |
| `npm run typecheck`                       | TypeScript, no emit                 |
