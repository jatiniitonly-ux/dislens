# ML and geospatial methodology

The MVP uses synthetic fixtures and a deterministic rule-based ensemble so the demo is reproducible and does not require large model weights. Production imagery should be processed with Rasterio/NumPy/OpenCV and vector overlays with GeoPandas/Shapely/PyProj.

## Preprocessing

Validate extension/MIME/size, inspect raster metadata, reproject to a common CRS, resample to a common resolution, align coverage, clip to the ROI, normalize values, mask invalid/cloud pixels, and retain warnings. If geographic metadata is absent, require latitude/longitude bounds, EPSG code, pixel resolution and region name.

## Methods

Baseline change is `D(x,y) = abs(Post(x,y) - Pre(x,y))`, normalized and thresholded. Flood-specific change is `NDWI = (Green - NIR) / (Green + NIR)` followed by `Delta NDWI = NDWI_post - NDWI_pre`; increased water-related values are a possible flood expansion signal. If Green or NIR is unavailable, disable NDWI, explain the fallback and renormalize available method weights.

Post-processing applies quality masks, configurable thresholds, morphological opening/closing, connected-component cleanup, minimum-area filtering, polygonization, simplification and geometry repair. Outputs are possible change polygons, never verified damage.

## Future model adapter

A `DetectionMethod` interface can host U-Net, Siamese CNN, Random Forest, XGBoost or transformer segmentation later. Large weights must be opt-in and versioned; model version, preprocessing config and method contributions are retained for reproducibility.
