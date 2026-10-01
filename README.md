# ReqSphere AI

An enterprise requirements-intelligence frontend for turning business evidence into traceable requirements and BRDs.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build` for a production build, `npm run preview` to review it, and `npm run lint` for linting.

## Mock mode and integration

The app runs without a backend using realistic mock services. Copy `.env.example` to `.env` and retain `VITE_USE_MOCK_DATA=true`. When the backend is available, set it to `false` and configure `VITE_API_BASE_URL`; replace service implementations without changing UI consumers.

## Architecture

`src/mocks` contains domain data and `src/services` is the data boundary used by TanStack Query. Routes cover project workspaces, requirements, evidence, conflicts, gaps, risks, dependencies, BRD generation and changes. The visual system uses Emerald Ink, restrained Champagne highlights and light data surfaces.
