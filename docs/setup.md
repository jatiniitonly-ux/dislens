# Local setup

Requirements: Node 22+, pnpm 11+, and a browser. Install dependencies with `pnpm install`, then start Vite with `pnpm dev` and open `http://localhost:3000`. Check with `pnpm typecheck`, build with `pnpm build`, and run unit tests with `pnpm test`.

The managed runtime listens on port 3000 and the Vite server binds to `0.0.0.0`. `public/manus-routes.json` must remain synchronized with page routes. No environment variable is required for the synthetic demo.

## Production direction

Provision Postgres/PostGIS, Redis or RQ, S3-compatible storage and a FastAPI service. Run migrations before API startup. Set `DATABASE_URL`, `REDIS_URL`, `OBJECT_STORAGE_ENDPOINT`, `OBJECT_STORAGE_BUCKET`, `OBJECT_STORAGE_ACCESS_KEY`, `OBJECT_STORAGE_SECRET_KEY`, `SESSION_SECRET`, and provider configuration through a secret manager only. Never bake secrets into the frontend build.
