# API contract

All production routes are under `/api`, return JSON, and require role-scoped authorization. The browser MVP uses the same shapes in `src/domain/types.ts` and runs the seeded analysis locally.

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/events` | Create a disaster event |
| GET | `/api/events` | List events available to the current role |
| GET | `/api/events/{event_id}` | Read event metadata and imagery/layer status |
| POST | `/api/events/{event_id}/imagery/pre` | Upload and validate pre-event imagery |
| POST | `/api/events/{event_id}/imagery/post` | Upload and validate post-event imagery |
| POST | `/api/events/{event_id}/layers` | Upload GeoJSON layer and return validation report |
| POST | `/api/analyses` | Queue an analysis run |
| GET | `/api/analyses/{analysis_id}` | Read run configuration and result summary |
| GET | `/api/analyses/{analysis_id}/status` | Read async status and progress |
| POST | `/api/analyses/{analysis_id}/cancel` | Cancel a queued/in-flight run |
| GET | `/api/analyses/{analysis_id}/regions` | Paginated detected regions sorted by priority |
| GET | `/api/regions/{region_id}` | Read one region and geometry |
| GET | `/api/regions/{region_id}/evidence` | Read evidence, uncertainty and method contribution |
| GET | `/api/analyses/{analysis_id}/statistics` | Read aggregate KPIs and distributions |
| GET | `/api/analyses/{analysis_id}/map-layers` | Return signed or simplified map layer URLs |
| POST | `/api/analyses/{analysis_id}/review` | Record a human review action and audit entry |
| GET | `/api/analyses/{analysis_id}/report` | Download PDF incident report |
| GET | `/api/analyses/{analysis_id}/report.json` | Download machine-readable report |

## Upload contract

Accept PNG/JPEG and GeoTIFF where practical. Reject unsupported extensions/MIME, oversized files, invalid raster dimensions, corrupt GeoTIFFs, missing CRS without user-supplied bounds/EPSG, and zip bombs. Return `what_happened`, `why`, and `how_to_fix` fields for every validation error.

## Status contract

Status is monotonic unless a run is cancelled or failed. `progress` is 0–100, `message` is user-facing and qualified, and `warnings` is an array retained in the final report. No status may imply verified damage.
