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

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run format` / `npm run format:check` | Prettier |
| `npm run typecheck` | TypeScript, no emit |
