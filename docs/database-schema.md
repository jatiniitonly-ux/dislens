# Database schema

Production uses PostgreSQL with PostGIS and Alembic migrations. All tables include `created_at` and `updated_at` where applicable.

| Table | Key fields |
|---|---|
| `users` | id, email, display_name, role_id, is_active |
| `roles` | id, name (`analyst`, `coordinator`, `administrator`), permissions_json |
| `events` | id, name, disaster_type, region_name, event_date, roi geometry, synthetic |
| `imagery` | id, event_id, side, object_key, acquisition_date, sensor, source, resolution, crs, bounds geometry, bands_json |
| `imagery_quality` | imagery_id, cloud_cover, invalid_fraction, quality_score, warnings_json |
| `processing_jobs` | id, analysis_id, state, progress, worker_id, error_json |
| `analysis_runs` | id, event_id, pre_imagery_id, post_imagery_id, config_json, started_at, completed_at |
| `detected_regions` | id, analysis_id, stable_id, geometry geometry(Polygon,4326), centroid geography(Point,4326), area_m2, change_type, severity, confidence, priority, status |
| `infrastructure_features` | id, event_id, feature_type, source, geometry geometry(Geometry,4326), properties_json |
| `population_layers` | id, event_id, source, resolution, geometry geometry(MultiPolygon,4326), population_density |
| `region_infrastructure_links` | region_id, feature_id, relation_type, overlap_m2, distance_m |
| `region_evidence` | id, region_id, method, label, detail, contribution |
| `region_uncertainty` | id, region_id, factor, detail, severity |
| `priority_scores` | region_id, severity, critical_infrastructure, population_exposure, accessibility_difficulty, confidence, weights_json, explanation |
| `review_actions` | id, analysis_id, region_id, reviewer_id, action, note, created_at |
| `generated_reports` | id, analysis_id, report_type, object_key, generated_at |
| `audit_logs` | id, actor_id, action, entity_type, entity_id, metadata_json, created_at |

Create GiST indexes on event ROI, imagery bounds, region geometry/centroid, infrastructure geometry and population geometry. Add B-tree indexes for event_id, analysis_id, priority, status, processing state and acquisition date. Enforce foreign keys, valid role enums, non-negative scores and region geometry validity at the service boundary.
