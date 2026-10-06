# Testing strategy

Run `pnpm typecheck`, `pnpm build` and `pnpm test` before delivery. Unit tests cover formula weights, normalization, confidence reduction under cloud/temporal uncertainty, NDWI fallback, deterministic region ranking, upload validation and report shape. Component/contract tests should cover accessible map buttons, layer toggles, table selection, role switcher, loading/failure/empty states, JSON download and PDF generation. Production adds GeoPandas/Shapely geometry fixtures, Rasterio alignment tests, FastAPI contract tests, upload-security tests, worker timeout/retry tests, database migration tests and browser E2E tests.

Quality review also searches all UI/report copy for unsafe claims such as “confirmed destroyed”, “guaranteed flooded” and “certain damage”. Visual review checks contrast, focus rings, reduced motion, responsive rails, legend readability and chart text equivalents.
