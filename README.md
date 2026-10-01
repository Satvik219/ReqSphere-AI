# ReqSphere AI

An enterprise requirements-intelligence frontend for turning business evidence into traceable requirements and BRDs.

## Run locally

Install dependencies in each app folder:

```bash
npm --prefix frontend install
npm --prefix backend install
```

Start the backend and frontend in separate terminals:

```bash
npm --prefix backend run dev
npm --prefix frontend run dev
```

Use `npm --prefix frontend run build` for a production build, `npm --prefix frontend run preview` to review it, and `npm --prefix frontend run lint` for linting. Run backend tests with `npm --prefix backend test`.

## Mock mode and integration

The frontend environment template is `frontend/.env.example`; copy it to `frontend/.env` and retain `VITE_USE_MOCK_DATA=true` to use realistic mock services. Backend settings belong in `backend/.env` and are documented in `backend/.env.example`. When connecting the frontend to the backend, configure `VITE_API_BASE_URL` and set `VITE_USE_MOCK_DATA=false`.

## Architecture

`frontend/src/mocks` contains domain data and `frontend/src/services` is the data boundary used by TanStack Query. The Express API and its configuration live in `backend/`. Routes cover project workspaces, requirements, evidence, conflicts, gaps, risks, dependencies, BRD generation and changes. The visual system uses Emerald Ink, restrained Champagne highlights and light data surfaces.
