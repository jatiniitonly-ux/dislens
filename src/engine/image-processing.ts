import { fromBlob } from 'geotiff';

export interface PixelAnalysisStats {
  width: number;
  height: number;
  comparedPixels: number;
  changedPixels: number;
  changeRatio: number;
  meanAbsoluteDifference: number;
  processingMs: number;
  source: 'uploaded-pixels' | 'uploaded-geotiff' | 'demo-fallback';
  warnings: string[];
  crs?: string;
  bands?: number;
}

interface RasterData { width: number; height: number; bands: number; values: ArrayLike<number>[]; }

export interface GeoTiffMetadata {
  width: number;
  height: number;
  bands: number;
  crs: string | null;
  bounds: [number, number, number, number] | null;
  resolution: [number, number] | null;
  nodata: number | null;
}

export async function inspectGeoTiff(file: File): Promise<GeoTiffMetadata> {
  const tiff = await fromBlob(file); const image = await tiff.getImage();
  const keys = image.getGeoKeys?.() as Record<string, unknown> | undefined;
  const projected = keys?.ProjectedCSTypeGeoKey; const geographic = keys?.GeographicTypeGeoKey;
  const crs = projected ? `EPSG:${String(projected)}` : geographic ? `EPSG:${String(geographic)}` : null;
  const bbox = image.getBoundingBox?.(); const resolution = image.getResolution?.();
  return { width: image.getWidth(), height: image.getHeight(), bands: image.getSamplesPerPixel(), crs, bounds: bbox && bbox.length === 4 ? [bbox[0], bbox[1], bbox[2], bbox[3]] : null, resolution: resolution && resolution.length >= 2 ? [resolution[0], resolution[1]] : null, nodata: (image as unknown as { getGDALNoData?: () => number | null }).getGDALNoData?.() ?? null };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file); const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Unable to decode ${file.name}. Use a valid PNG or JPEG image.`)); };
    image.src = url;
  });
}

function pixelsFrom(image: HTMLImageElement, width: number, height: number): Uint8ClampedArray {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Browser pixel-processing context is unavailable.');
  context.drawImage(image, 0, 0, width, height); return context.getImageData(0, 0, width, height).data;
}

function rasterFromImage(image: HTMLImageElement): RasterData {
  const width = Math.min(image.naturalWidth || image.width, 1024); const height = Math.min(image.naturalHeight || image.height, 1024);
  const rgba = pixelsFrom(image, width, height); const grayscale = new Uint8Array(width * height);
  for (let pixel = 0; pixel < grayscale.length; pixel += 1) grayscale[pixel] = Math.round((rgba[pixel * 4] * 0.299) + (rgba[pixel * 4 + 1] * 0.587) + (rgba[pixel * 4 + 2] * 0.114));
  return { width, height, bands: 1, values: [grayscale] };
}

async function rasterFromGeoTiff(file: File): Promise<RasterData> {
  const tiff = await fromBlob(file); const image = await tiff.getImage();
  const rasters = await image.readRasters({ interleave: false });
  return { width: image.getWidth(), height: image.getHeight(), bands: rasters.length, values: rasters as ArrayLike<number>[] };
}

function compareRasters(before: RasterData, after: RasterData, started: number, source: PixelAnalysisStats['source']): PixelAnalysisStats {
  const width = Math.min(before.width, after.width, 2048); const height = Math.min(before.height, after.height, 2048);
  const comparedPixels = width * height; let changedPixels = 0; let differenceTotal = 0;
  const samples = Math.min(before.bands, after.bands); const threshold = source === 'uploaded-geotiff' ? 0.12 : 42;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    let difference = 0;
    for (let band = 0; band < samples; band += 1) {
      const beforeValue = Number(before.values[band][y * before.width + x]); const afterValue = Number(after.values[band][y * after.width + x]);
      const scale = source === 'uploaded-geotiff' ? Math.max(Math.abs(beforeValue), Math.abs(afterValue), 1) : 255;
      difference += Math.abs(beforeValue - afterValue) / scale;
    }
    difference /= Math.max(samples, 1); differenceTotal += difference; if (difference >= threshold / (source === 'uploaded-geotiff' ? 1 : 255)) changedPixels += 1;
  }
  return { width, height, comparedPixels, changedPixels, changeRatio: changedPixels / Math.max(comparedPixels, 1), meanAbsoluteDifference: differenceTotal / Math.max(comparedPixels, 1) * (source === 'uploaded-geotiff' ? 100 : 255), processingMs: Math.round(performance.now() - started), source, bands: samples, warnings: source === 'uploaded-geotiff' ? ['GeoTIFF pixels decoded in-browser. CRS reprojection and geographic area calculation require matching grids; comparison is cropped to the common raster dimensions.'] : ['PNG/JPEG processing uses normalized RGB difference; true spectral interpretation requires band metadata.'] };
}

export async function analyzeUploadedImagePair(preFile: File, postFile: File): Promise<PixelAnalysisStats> {
  const started = performance.now(); const isGeoTiff = /\.tif?f$/i.test(preFile.name) || /\.tif?f$/i.test(postFile.name);
  if (isGeoTiff) {
    if (!/\.tif?f$/i.test(preFile.name) || !/\.tif?f$/i.test(postFile.name)) throw new Error('GeoTIFF processing requires GeoTIFF files for both pre-event and post-event imagery.');
    return compareRasters(await rasterFromGeoTiff(preFile), await rasterFromGeoTiff(postFile), started, 'uploaded-geotiff');
  }
  const [pre, post] = await Promise.all([loadImage(preFile), loadImage(postFile)]);
  return compareRasters(rasterFromImage(pre), rasterFromImage(post), started, 'uploaded-pixels');
}
