# WorldPop India Population Source Metadata

- Official catalogue: https://hub.worldpop.org/geodata/listing?id=135
- Official STAC item: https://stac.worldpop.org/collections/IND/items/ind_pop_2025_CN_100m_R2025A_v1
- Product: WorldPop Global 2 R2025A v1 — India constrained population counts
- Year: 2025
- Release/version: R2025A / v1
- Official GeoTIFF: https://data.worldpop.org/GIS/Population/Global_2015_2030/R2025A/2025/IND/v1/100m/constrained/ind_pop_2025_CN_100m_R2025A_v1.tif
- Licence: Creative Commons Attribution 4.0 International (CC BY 4.0)
- CRS: EPSG:4326 / WGS84
- Pixel size: 0.0008333333° × 0.0008333333° (approximately 100 m)
- Data type: float32
- NoData: -99999
- Dimensions: 35040 × 34507, one band
- Extent: 68.195832–97.395832°E, 6.755834–35.511667°N
- STAC file size: 742.06 MB
- Download date: 2026-10-06 (sandbox acquisition)
- SHA-256: not recorded; the official 742.06 MB transfer was throttled and cancelled before completion. The UI therefore does not claim a WorldPop raster calculation.
- Citation/DOI: Bondarenko et al. (2025), DOI 10.5258/SOTON/WP00839

## Processing constraint

The active DisasterLens benchmark flood mask is a small illustrative 4×4 fixture without verified georeferencing to the Kosi AOI. Therefore WorldPop exposure is explicitly blocked until a georeferenced fused mask is supplied. No local fixture values are used as WorldPop values.

## Related flood-mask reference

Sen1Floods11 repository: https://github.com/cloudtostreet/Sen1Floods11

Sen1Floods11 documents georeferenced Sentinel-1/Sentinel-2/hand-label GeoTIFFs in EPSG:4326 at 10 m and is used as a methodological reference only; it is not substituted for the WorldPop population source.
