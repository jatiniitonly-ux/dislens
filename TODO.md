# DisasterLens AI delivery checklist

## Event, imagery and analysis workflow

- A user can create or select a disaster event.
- A user can inspect pre-event and post-event imagery metadata and select local image files through the browser.
- The system validates image extension, MIME type and file size, preserves metadata fields when supplied, and surfaces actionable warnings for missing CRS, coverage mismatch, cloud quality and unavailable spectral bands.
- The system runs a visible analysis workflow through `queued`, `preprocessing`, `detecting`, `postprocessing`, `scoring`, and `completed` states, with failure and retry states.
- The system generates a baseline pixel-difference method and an NDWI flood method when Green/NIR bands are available; when NDWI is unavailable, it explains why, renormalizes the available method weights, and continues with baseline detection.
- The system creates simplified geographic polygons with stable region IDs, affected area, centroid, change type, severity, confidence, priority, evidence, uncertainty, affected infrastructure, estimated exposed population, timestamp and review status.

## Response dashboard

- The dashboard displays total potentially affected area, critical zones, potentially affected infrastructure, estimated exposed population, average confidence and processing time.
- The dashboard displays an interactive map with pre/post imagery, change probability, flood mask, severity, priority zones, roads, buildings, hospitals, shelters, population density and uncertain-region layer controls, plus legend, north arrow, scale bar, opacity, before/after comparison and fullscreen affordance.
- A user can inspect each detected region and see its change type, area, severity, priority level/score, confidence, nearby hospitals, affected roads, population exposure, evidence, uncertainty and recommended action.
- The dashboard provides a ranked priority table and baseline-versus-improved comparison plus priority, change-type and confidence distributions.
- Every prediction surface clearly states that results are AI-generated decision support requiring independent field verification; the interface never presents predictions as confirmed damage.

## Explainability, roles and reports

- Priority uses normalized severity, critical infrastructure, population exposure, accessibility difficulty and confidence factors with default weights `0.35`, `0.25`, `0.20`, `0.10`, `0.10`; every score has a plain-language explanation.
- Confidence uses method agreement, image quality, temporal closeness and spatial consistency with weights `0.40`, `0.25`, `0.20`, `0.15`; every region includes confidence percentage, evidence, uncertainty factors, missing-data warnings and a recommended verification action.
- Emergency Analyst, Response Coordinator and Administrator roles are represented with UI-level capability guards; Administrator mode exposes editable scoring weights with reset-to-default behavior and a production-persistence note.
- The system generates downloadable JSON and PDF incident reports containing event and imagery metadata, processing steps, warnings, affected area, ranked zones, infrastructure, population, confidence, evidence, uncertainty, recommendations, limitations, comparison output, timestamp and field-verification disclaimer.

## Architecture, security and delivery

- The project documents the FastAPI endpoint list, async job states, PostgreSQL/PostGIS schema, object-storage contracts, worker boundary and future disaster-type adapters.
- The project documents validation and security controls for file type, MIME, size, raster dimensions, CRS, bands, path traversal, malicious filenames, zip bombs, unauthorized file access, secrets, rate limiting, input sanitization, secure headers, audit logging, retention and privacy.
- The project includes strict TypeScript, deterministic scoring and analysis tests, report-shape tests, upload-validation tests, route-manifest validation, accessible labels/focus states, and local setup/build/test instructions.
- The project includes synthetic demo data, clearly labeled, and documented demo steps, known limitations and future improvements.
- The application listens on the managed runtime port, serves `/manus-routes.json`, builds successfully, and is committed to the managed project canonical `main` branch with a verified checkpoint.
