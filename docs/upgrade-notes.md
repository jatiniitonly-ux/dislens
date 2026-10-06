# DisasterLens AI upgrade notes

## Implemented in this iteration

- Added a prominent **Create New Analysis** flow with event, disaster type, location, date, region-size, and detection-threshold fields.
- Added explicit **Synthetic Demo / Uploaded Data** mode labeling and retained the field-verification disclaimer.
- Added one-click **PDF, JSON, and GeoJSON** report downloads; GeoJSON contains detected-region properties and polygon coordinates.
- Added report generation states in the application model and a retry-safe export wrapper.
- Added expandable priority-score breakdowns with factor, weight, score, and contribution values.
- Added heuristic confidence-type labeling and clear separation between AI prediction and human verification.
- Added a dedicated model-evaluation panel that honestly reports unavailable ground-truth metrics instead of inventing IoU, precision, recall, F1, or false-positive values.
- Added review-note affordance and richer review-state copy.
- Added responsive styling for the new modal, evaluation panel, score table, and review controls.

## Validation

- `pnpm typecheck` passed.
- `pnpm build` passed; Vite emitted only the existing bundle-size advisory.
- `pnpm test` passed: 10 tests across 3 test files.
- Runtime smoke check passed for `/` and `/manus-routes.json` on the Vite server.

## Remaining prototype limitations

- Raster pixel processing remains deterministic browser-side demo processing; uploaded files are validated and represented in metadata, while production GeoTIFF decoding/alignment belongs in the documented Rasterio/PostGIS worker boundary.
- Supporting-layer upload controls and true spatial intersection are still production extension points.
- Ground-truth evaluation metrics remain unavailable unless a labeled benchmark is supplied.
- Review notes are local UI state and are not persisted to a backend audit store.
