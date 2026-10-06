# DisasterLens AI

DisasterLens AI is a flood-focused disaster-response intelligence dashboard for TECHFEST 2026 Problem Statement 4. The managed web MVP compares a seeded synthetic pre/post imagery pair, exposes baseline pixel difference and NDWI method agreement, ranks potentially affected zones, shows infrastructure/population exposure, explains confidence and uncertainty, and exports JSON/PDF incident reports.

> **AI-generated decision support. Results require independent field verification.**

## Run locally

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

Production build and tests:

```bash
pnpm typecheck
pnpm build
pnpm test
```

The default event is explicitly synthetic. Upload controls validate PNG/JPEG/GeoTIFF-like file inputs and preserve the filename in the imagery metadata. No live satellite provider or field-verified evidence is connected in this MVP.

## Product workflow

Select **Kosi Delta Flood**, inspect imagery and layer metadata, toggle map layers, run analysis to observe the queued → preprocessing → detecting → postprocessing → scoring → completed workflow, open a priority zone, inspect evidence/uncertainty, mark it reviewed, compare baseline vs improved detection, then download the JSON or PDF report. Switch to Administrator from the profile menu to inspect configurable priority weights.

## Production extension

`docs/architecture.md`, `docs/api.md` and `docs/database-schema.md` describe the FastAPI/PostGIS service, async worker boundary, object storage contracts and migrations to replace the deterministic browser engine with Rasterio/GeoPandas processing.
