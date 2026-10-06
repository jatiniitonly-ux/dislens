# Deployment guide

The managed project uses Vite preview on port 3000. The repository includes a production `Dockerfile` that installs the pinned pnpm lockfile, compiles the Vite bundle, exposes port 3000, honors `PORT`, and serves the final `dist` root with `vite preview`. Configure the Webdev container contract with `dockerfilePath: "Dockerfile"` and unauthenticated `healthPath: "/"`.

For a static-only publication, configure the Webdev build contract with a self-contained `pnpm install --frozen-lockfile && pnpm build` command and `dist` as the output directory. Keep `/manus-routes.json` in `public` so it is copied into the output.

For a production split deployment, serve the React static build from the web edge and route `/api/*` to the FastAPI service. The API container should expose an unauthenticated `/health` 2xx endpoint, listen on `PORT` with a 3000 default, install Python dependencies from a lockfile, and read database/storage secrets only at runtime.

Before a checkpoint, run typecheck, tests and build, inspect `git diff`, commit intended files to canonical `main`, fetch/integrate remote `main`, push without force, and verify the returned checkpoint SHA. Keep rollback as a native version-history operation. Publish only after a successful publication result; a preview URL is not a publication claim.
