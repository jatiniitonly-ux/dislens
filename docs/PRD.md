# Product requirements document

## Vision

DisasterLens AI gives emergency analysts a clear, qualified signal about where satellite-image change may warrant attention first. It supports response decisions without presenting unverified predictions as confirmed damage.

## Users

Emergency Analysts upload imagery, run analyses and export reports. Response Coordinators review ranked zones, infrastructure exposure and recommendations. Administrators inspect processing state and tune priority weights; production persistence belongs in the database.

## Goals

The MVP must let a user select a flood event, inspect a validated synthetic imagery pair, run baseline and NDWI-aware analysis, explore potentially affected zones on a map, understand confidence and uncertainty, rank response priorities, mark a zone as reviewed, and export JSON/PDF reports.

## Non-goals

The MVP does not claim live satellite access, replace field verification, provide dispatch instructions, guarantee damage classification, or load large external ML weights. PostGIS/Rasterio/FastAPI contracts are documented for the production service boundary.

## Acceptance criteria

The dashboard demonstrates event selection, file validation, preprocessing warnings, method availability/fallback, polygonized zones, area/severity/confidence/priority, infrastructure and population estimates, interactive layer controls, zone inspection, baseline-versus-improved comparison, role selection, review status, PDF/JSON exports, responsive accessibility states and the field-verification disclaimer.

## Success metrics

Measure time-to-first-priority-zone, report export completion, percentage of regions with visible evidence and uncertainty, analysis completion rate, confidence distribution and the number of unsafe unqualified claims in UI copy.
