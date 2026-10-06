# Five-minute demo script

**0:00 — Context.** Select Kosi Delta Flood and call out the `SYNTHETIC DEMO` badge. Explain that DisasterLens is AI-generated decision support and every prediction needs independent field verification.

**0:30 — Inputs.** Show pre-event and post-event imagery metadata, Green/NIR availability, cloud quality and validated supporting layers. Toggle roads, hospitals, shelters and population on the map.

**1:15 — Run.** Click Run analysis and narrate queued → preprocessing → detecting → post-processing → scoring → complete. Explain that baseline pixel difference and NDWI are combined with renormalized weights; no external ML weights are loaded.

**2:00 — Spatial signal.** Point to the three synthetic polygons and the KPI strip. Select ZONE-001 and show its Critical priority, affected area, hospital access-route overlap, population exposure and confidence ring.

**3:00 — Uncertainty.** Read the cloud and low-quality-boundary caveats. Explain why the recommended action is verification, not dispatch based on a confirmed-damage claim. Mark the region reviewed.

**3:45 — Comparison.** Show baseline vs improved detection and the ranked priority table. Switch to Administrator to show configurable scoring weights, then reset defaults.

**4:20 — Report.** Download JSON and generate the PDF incident report. Point out the processing warnings, evidence, uncertainty, limitations and disclaimer.

**4:50 — Close.** Explain that the production boundary is FastAPI/PostGIS plus async Rasterio/GeoPandas workers, while this demo is deterministic, reproducible and intentionally honest about its synthetic inputs.
