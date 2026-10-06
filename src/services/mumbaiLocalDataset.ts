export type Bbox = [number, number, number, number];

export interface MumbaiImageryScene {
  productId: string;
  date: string;
  bbox: Bbox;
  polarization: string[];
  orbitDirection: string;
  processingLevel: string;
  localVv: string | null;
  localVh: string | null;
  thumbnail: string;
}

export interface MumbaiLocalManifest {
  id: 'LOCAL-MUMBAI-SATELLITE-001';
  locationKey: 'mumbai';
  mode: 'local';
  operational: false;
  aoi: { bbox: Bbox; crs: 'EPSG:4326' };
  rainfall: { source: string; url: string; localFile: string };
  imagery: { status: 'verified-metadata-only'; pre: MumbaiImageryScene; post: MumbaiImageryScene };
  processing: { verifiedPair: boolean; localRasterPairAvailable: boolean; unavailableReason: string };
}

export const MUMBAI_AOI: Bbox = [72.75, 18.85, 73.05, 19.35];

export const mumbaiLocalManifest: MumbaiLocalManifest = {
  id: 'LOCAL-MUMBAI-SATELLITE-001',
  locationKey: 'mumbai',
  mode: 'local',
  operational: false,
  aoi: { bbox: MUMBAI_AOI, crs: 'EPSG:4326' },
  rainfall: { source: 'OpenCity / India Meteorological Department', url: 'https://data.opencity.in/dataset/mumbai-rainfall-data', localFile: 'rainfall/mumbai-rainfall.csv' },
  imagery: {
    status: 'verified-metadata-only',
    pre: { productId: 'S1D_IW_GRDH_1SDV_20260918T010238_20260918T010309_004625_008A01_036E_COG', date: '2026-09-18T01:02:38.321035Z', bbox: [70.998596, 17.158554, 73.745903, 19.474184], polarization: ['VV', 'VH'], orbitDirection: 'descending', processingLevel: 'L1', localVv: null, localVh: null, thumbnail: '/data/mumbai/thumbnails/pre.png' },
    post: { productId: 'S1D_IW_GRDH_1SDV_20260930T010238_20260930T010309_004800_00901B_8A28_COG', date: '2026-09-30T01:02:38.345626Z', bbox: [70.999405, 17.159275, 73.746559, 19.474155], polarization: ['VV', 'VH'], orbitDirection: 'descending', processingLevel: 'L1', localVv: null, localVh: null, thumbnail: '/data/mumbai/thumbnails/post.png' },
  },
  processing: { verifiedPair: true, localRasterPairAvailable: false, unavailableReason: 'Verified catalog metadata and thumbnails are bundled, but VV/VH GeoTIFF rasters are not locally downloaded or processed in this browser build.' },
};

export function bboxIntersects(a: Bbox, b: Bbox): boolean {
  return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
}

export function validateMumbaiLocalManifest(manifest: MumbaiLocalManifest, selectedLocationKey = 'mumbai', selectedMode = 'local'): string[] {
  const errors: string[] = [];
  if (manifest.locationKey !== selectedLocationKey) errors.push('Dataset location does not match the selected location.');
  if (manifest.mode !== selectedMode) errors.push('Dataset mode does not match the selected mode.');
  if (!manifest.imagery.pre || !manifest.imagery.post) errors.push('Both pre-event and post-event imagery metadata are required.');
  if (!bboxIntersects(manifest.imagery.pre.bbox, manifest.aoi.bbox)) errors.push('Pre-event imagery does not intersect the Mumbai AOI.');
  if (!bboxIntersects(manifest.imagery.post.bbox, manifest.aoi.bbox)) errors.push('Post-event imagery does not intersect the Mumbai AOI.');
  if (Date.parse(manifest.imagery.pre.date) >= Date.parse(manifest.imagery.post.date)) errors.push('Pre-event imagery date must precede post-event imagery date.');
  if (!manifest.imagery.pre.polarization.includes('VV') || !manifest.imagery.pre.polarization.includes('VH')) errors.push('Pre-event imagery must include VV and VH polarization.');
  if (!manifest.imagery.post.polarization.includes('VV') || !manifest.imagery.post.polarization.includes('VH')) errors.push('Post-event imagery must include VV and VH polarization.');
  return errors;
}

export function mumbaiLocalImageryUnavailable(manifest: MumbaiLocalManifest): boolean {
  return !manifest.processing.localRasterPairAvailable || !manifest.imagery.pre.localVv || !manifest.imagery.pre.localVh || !manifest.imagery.post.localVv || !manifest.imagery.post.localVh;
}
