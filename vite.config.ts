import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function healthPlugin(): Plugin {
  const handler = (req: { url?: string }, res: { setHeader: (name: string, value: string) => void; end: (body: string) => void }, next: () => void) => {
    if (req.url !== '/health' && req.url !== '/api/health') return next();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ status: 'ok', service: 'disasterlens-api', version: '1.0.0', environment: 'demo', timestamp: new Date().toISOString() }));
  };
  return { name: 'disasterlens-health', configureServer: (server) => { server.middlewares.use(handler); }, configurePreviewServer: (server) => { server.middlewares.use(handler); } };
}

function satellitePlugin(): Plugin {
  const stacUrl = process.env.COPERNICUS_STAC_URL || 'https://stac.dataspace.copernicus.eu/v1/search';
  const configured = Boolean(process.env.COPERNICUS_CLIENT_ID && process.env.COPERNICUS_CLIENT_SECRET);
  const handler = async (req: { url?: string }, res: { setHeader: (name: string, value: string) => void; end: (body: string) => void }, next: () => void) => {
    if (!req.url?.startsWith('/api/satellite/')) return next();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (req.url === '/api/satellite/config') { res.end(JSON.stringify({ source: 'Copernicus Data Space STAC', configured, catalog: stacUrl, authRequiredForSearch: false, authRequiredForDownload: true })); return; }
    if (!req.url.startsWith('/api/satellite/search')) {
      const protectedRoute = /\/api\/satellite\/(download|analyse)|\/api\/satellite\/download\/|\/api\/satellite\/scenes\//.test(req.url);
      res.end(JSON.stringify({ error: protectedRoute ? 'Satellite asset retrieval and analysis require configured Copernicus credentials and a server-side raster worker.' : 'Unknown satellite endpoint', status: protectedRoute ? 'not-configured' : 'not-found', configured })); return;
    }
    try {
      const query = new URL(req.url, 'http://localhost').searchParams; const collection = query.get('collection') || 'sentinel-2-l2a'; const bbox = (query.get('bbox') || '').split(',').map(Number); const start = query.get('start'); const end = query.get('end');
      if (bbox.length !== 4 || bbox.some((value) => !Number.isFinite(value)) || !start || !end) { res.end(JSON.stringify({ error: 'collection, bbox, start, and end are required' })); return; }
      const body = { collections: [collection], bbox, datetime: `${start}T00:00:00Z/${end}T23:59:59Z`, limit: Math.min(50, Math.max(1, Number(query.get('limit') || 10))) };
      const upstream = await fetch(stacUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/geo+json' }, body: JSON.stringify(body) });
      if (!upstream.ok) { res.end(JSON.stringify({ error: `Copernicus STAC returned HTTP ${upstream.status}`, configured, scenes: [] })); return; }
      const payload = await upstream.json() as { features?: Array<Record<string, unknown>> };
      const maxCloud = Number(query.get('maxCloud')); const scenes = (payload.features ?? []).map((feature) => { const properties = (feature.properties ?? {}) as Record<string, unknown>; const assets = Object.entries((feature.assets ?? {}) as Record<string, { href?: string; type?: string; title?: string }>).filter(([, asset]) => asset.href).map(([key, asset]) => ({ key, href: asset.href as string, type: asset.type, title: asset.title })); return { id: String(feature.id ?? 'unknown'), collection, datetime: String(properties.datetime ?? properties.start_datetime ?? 'Not available'), title: String(properties['title'] ?? feature.id ?? 'Copernicus scene'), cloudCover: typeof properties['eo:cloud_cover'] === 'number' ? properties['eo:cloud_cover'] as number : null, geometry: feature.geometry, bbox: feature.bbox as number[] | undefined, assets, source: 'Copernicus Data Space STAC' as const }; }).filter((scene) => !Number.isFinite(maxCloud) || scene.cloudCover === null || scene.cloudCover <= maxCloud);
      res.end(JSON.stringify({ configured, source: 'Copernicus Data Space STAC', scenes, searchedAt: new Date().toISOString(), message: configured ? undefined : 'Catalogue search is public; configure Copernicus credentials to retrieve protected assets.' }));
    } catch (error) { res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Copernicus STAC request failed', configured, scenes: [] })); }
  };
  return { name: 'disasterlens-satellite', configureServer: (server) => { server.middlewares.use(handler); }, configurePreviewServer: (server) => { server.middlewares.use(handler); } };
}

export default defineConfig({
  plugins: [react(), healthPlugin(), satellitePlugin()],
  define: { __APP_VERSION__: JSON.stringify('1.0.0'), __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()) },
  server: { host: '0.0.0.0', port: 3000, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 3000, allowedHosts: true },
});
