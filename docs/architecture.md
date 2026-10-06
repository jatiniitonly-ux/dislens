# Technical architecture

## MVP boundary

The managed preview serves a React/TypeScript/Vite dashboard. A deterministic browser analysis engine provides reproducible synthetic results and preserves the API-shaped domain contracts. The custom SVG map avoids external tile keys. JSON and PDF reports are generated client-side for the demo.

## Production boundary

```text
React dashboard -> FastAPI REST -> job queue -> analysis worker
                      |              |              |
                 Postgres/PostGIS   Redis/RQ     Rasterio/NumPy/OpenCV
                      |              |            GeoPandas/Shapely/PyProj
                 object storage <----+---- derived rasters / GeoJSON / reports
```

FastAPI owns event, upload, analysis, region, review and report resources. The worker transitions jobs through `queued`, `preprocessing`, `detecting`, `postprocessing`, `scoring`, `completed`, `failed`, or `cancelled`. PostGIS owns geometries and spatial indexes; object storage owns private imagery and derived assets. No provider credential is exposed to the browser.

## Frontend modules

`src/domain` defines stable contracts. `src/data` contains synthetic fixtures. `src/engine` holds pure scoring, confidence, method availability and validation functions. `src/components` contains the map, charts and dashboard visual components. `src/export` owns incident report output. These boundaries let a future API adapter replace the deterministic engine without changing the UI.

## Design system

The interface uses an emergency-operations cartography movement: dark ink shell, icy map surface, Signal Cyan for active evidence, amber for uncertainty and coral for urgency. Typography combines Manrope with DM Mono. The map is the dominant spatial surface, with left context and right intelligence rails.

## Security boundary

Uploads are validated server-side in production before storage. Use signed object URLs, role-scoped API authorization, MIME sniffing, GeoTIFF dimension/CRS/band checks, safe filenames, rate limiting, audit logs and private-by-default report access. The MVP never stores credentials in client code and uses synthetic data only.
