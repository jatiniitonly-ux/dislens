<<<<<<< HEAD
import { useMemo, useState } from 'react';
import { Download, LocateFixed, Maximize2, Minus, Plus, Search, SlidersHorizontal } from 'lucide-react';
import type { DetectedRegion } from '../domain/types';

type MapLayerKey = 'change' | 'roads' | 'buildings' | 'hospitals' | 'shelters' | 'population' | 'uncertain';
interface MapViewProps { regions: DetectedRegion[]; selectedId: string; onSelect: (id: string) => void; layers: Record<MapLayerKey, boolean>; setLayer: (layer: MapLayerKey) => void; beforeAfter: boolean; setBeforeAfter: (value: boolean) => void; opacity: number; setOpacity: (value: number) => void; }
=======
import { useEffect, useMemo, useState } from 'react';
import { Download, LocateFixed, Maximize2, Minus, Plus, Search, SlidersHorizontal } from 'lucide-react';
import type { DetectedRegion, IndianLocation, PopulationSource, RegionalDataset } from '../domain/types';
import type { Coordinates } from '../services/locationService';

type MapLayerKey = 'change' | 'roads' | 'buildings' | 'hospitals' | 'shelters' | 'population' | 'uncertain';
interface MapViewProps { regions: DetectedRegion[]; selectedId: string; onSelect: (id: string) => void; layers: Record<MapLayerKey, boolean>; setLayer: (layer: MapLayerKey) => void; beforeAfter: boolean; setBeforeAfter: (value: boolean) => void; opacity: number; setOpacity: (value: number) => void; selectedLocation: IndianLocation; workspaceCoordinates: Coordinates; userCoordinates: Coordinates | null; regionalDataset: RegionalDataset | null; populationSource?: PopulationSource; }
>>>>>>> a8a4f96 (final update)

const roads = ['M 65 395 C 160 340 208 343 282 372 S 420 445 515 389 S 641 327 716 362', 'M 97 135 C 181 185 226 214 305 221 S 473 182 532 130 S 643 77 728 112', 'M 150 478 C 206 402 228 306 264 230 S 319 120 362 59'];
const rivers = ['M 20 305 C 115 276 173 295 244 321 S 356 378 427 342 S 526 252 588 269 S 684 348 780 307', 'M 34 352 C 128 325 198 353 277 386 S 404 430 477 386'];
const buildings = Array.from({ length: 34 }, (_, i) => ({ x: 100 + ((i * 53) % 580), y: 90 + ((i * 31) % 360), rotate: (i * 17) % 24 }));
const populationCells = Array.from({ length: 18 }, (_, i) => ({ x: 70 + ((i * 91) % 620), y: 110 + ((i * 47) % 330), opacity: 0.07 + ((i % 4) * 0.025) }));
const facilities = [{ type: 'hospital', x: 238, y: 188, label: 'H-01' }, { type: 'hospital', x: 575, y: 246, label: 'H-02' }, { type: 'shelter', x: 338, y: 294, label: 'S-07' }, { type: 'shelter', x: 630, y: 388, label: 'S-03' }];

<<<<<<< HEAD
export function MapView({ regions, selectedId, onSelect, layers, setLayer, beforeAfter, setBeforeAfter, opacity, setOpacity }: MapViewProps) {
=======
export function MapView({ regions, selectedId, onSelect, layers, setLayer, beforeAfter, setBeforeAfter, opacity, setOpacity, selectedLocation, workspaceCoordinates, userCoordinates, regionalDataset, populationSource = 'local-fixture' }: MapViewProps) {
>>>>>>> a8a4f96 (final update)
  const [zoom, setZoom] = useState(1);
  const [fullScreen, setFullScreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const activeRegion = useMemo(() => regions.find((region) => region.id === selectedId), [regions, selectedId]);
<<<<<<< HEAD
=======
  const hasRegionalFeatures = Boolean(regionalDataset?.features.length);
  const project = (point: { latitude: number; longitude: number }) => {
    const bbox = regionalDataset?.bbox ?? { minLatitude: workspaceCoordinates.latitude - .05, minLongitude: workspaceCoordinates.longitude - .05, maxLatitude: workspaceCoordinates.latitude + .05, maxLongitude: workspaceCoordinates.longitude + .05 };
    const x = ((point.longitude - bbox.minLongitude) / Math.max(.0001, bbox.maxLongitude - bbox.minLongitude)) * 720 + 30;
    const y = (1 - (point.latitude - bbox.minLatitude) / Math.max(.0001, bbox.maxLatitude - bbox.minLatitude)) * 460 + 45;
    return { x: Math.max(12, Math.min(768, x)), y: Math.max(42, Math.min(525, y)) };
  };
  useEffect(() => { setZoom(selectedLocation.defaultZoom >= 12 ? 1.1 : 1); }, [selectedLocation.id, workspaceCoordinates.latitude, workspaceCoordinates.longitude, selectedLocation.defaultZoom]);
>>>>>>> a8a4f96 (final update)
  const locateRegion = () => { const match = regions.find((region) => `${region.id} ${region.shortLabel} ${region.location}`.toLowerCase().includes(searchTerm.toLowerCase())) ?? regions[0]; if (match) onSelect(match.id); };
  const exportMap = () => { const svg = document.querySelector('.map-canvas svg'); if (!svg) return; const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'disasterlens-map-snapshot.svg'; link.click(); URL.revokeObjectURL(url); };
  return <section className={`map-card ${fullScreen ? 'map-fullscreen' : ''}`} aria-label="Flood change evidence map">
    <div className="map-toolbar">
<<<<<<< HEAD
      <div className="map-title"><span className="eyebrow">SPATIAL INTELLIGENCE</span><strong>Kosi floodplain · 26.49°N, 87.29°E</strong></div>
=======
      <div className="map-title"><span className="eyebrow">SPATIAL INTELLIGENCE</span><strong>{selectedLocation.name} · {workspaceCoordinates.latitude.toFixed(4)}°N, {workspaceCoordinates.longitude.toFixed(4)}°E</strong></div>
>>>>>>> a8a4f96 (final update)
      <div className="map-search"><Search size={14} /><input aria-label="Search location" placeholder="Search location" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') locateRegion(); }} /><kbd>↵</kbd></div>
      <div className="map-toolbar-actions"><button className="icon-button" title="Export map image" onClick={exportMap}><Download size={15} /></button><button className="icon-button" title="Toggle full screen" onClick={() => setFullScreen((value) => !value)}><Maximize2 size={16} /></button></div>
    </div>
    <div className="map-canvas">
      <svg viewBox="0 0 780 540" role="img" aria-label="Synthetic floodplain map with potentially affected zones" preserveAspectRatio="none" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform .2s ease' }}>
        <defs><pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M 36 0 L 0 0 0 36" fill="none" stroke="#b6c7d133" strokeWidth="1" /></pattern><filter id="glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <rect width="780" height="540" fill={beforeAfter ? '#d7e4e4' : '#cfe1dc'} />
        <rect width="780" height="540" fill="url(#grid)" opacity=".5" />
        <path d="M 0 310 C 114 266 191 285 254 320 S 362 391 446 349 S 549 246 625 279 S 706 355 780 313 L780 540 L0 540 Z" fill={beforeAfter ? '#88b9b5' : '#5abbb1'} opacity={beforeAfter ? .42 : .5} />
        <path d="M 0 265 C 105 238 176 273 256 301 S 370 365 437 327 S 560 217 628 250 S 714 324 780 289" fill="none" stroke="#3c8488" strokeWidth="8" opacity={beforeAfter ? .54 : .72} />
        <path d="M 0 265 C 105 238 176 273 256 301 S 370 365 437 327 S 560 217 628 250 S 714 324 780 289" fill="none" stroke="#d9fbf5" strokeWidth="2" strokeDasharray="2 12" opacity=".8" />
<<<<<<< HEAD
        {layers.population && populationCells.map((cell, i) => <circle key={`pop-${i}`} cx={cell.x} cy={cell.y} r="38" fill="#d96555" opacity={cell.opacity} />)}
        {layers.roads && roads.map((road, i) => <path key={`road-${i}`} d={road} fill="none" stroke="#f7f4ed" strokeWidth={i === 0 ? 6 : 3} opacity=".9" />)}
        {layers.roads && roads.map((road, i) => <path key={`road-inner-${i}`} d={road} fill="none" stroke="#e89f5d" strokeWidth="1" strokeDasharray="5 7" opacity=".9" />)}
        {layers.buildings && buildings.map((building, i) => <rect key={`building-${i}`} x={building.x} y={building.y} width="8" height="6" rx="1" fill="#66747d" opacity=".7" transform={`rotate(${building.rotate} ${building.x} ${building.y})`} />)}
        {layers.change && regions.map((region) => <g key={region.id} style={{ opacity: opacity / 100 }} className={`zone-group ${selectedId === region.id ? 'is-selected' : ''}`} onClick={() => onSelect(region.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(region.id); }} role="button" tabIndex={0} aria-label={`${region.id}, ${region.changeType}, priority ${region.priority}`}><polygon points={region.polygon.points} fill={region.color} fillOpacity={selectedId === region.id ? .55 : .3} stroke={region.color} strokeWidth={selectedId === region.id ? 4 : 2} filter={selectedId === region.id ? 'url(#glow)' : undefined} /><text x={region.polygon.centroid.x} y={region.polygon.centroid.y} textAnchor="middle" fill="#17252d" fontSize="11" fontWeight="800">{region.id.replace('ZONE-', 'Z-')}</text></g>)}
        {layers.uncertain && <path d="M 467 121 C 520 97 603 110 642 152 S 668 230 633 248 C 596 266 543 222 501 213 S 449 153 467 121 Z" fill="none" stroke="#f4b35f" strokeWidth="2" strokeDasharray="6 8" opacity=".8" />}
        {layers.hospitals && facilities.filter((f) => f.type === 'hospital').map((facility) => <g key={facility.label}><circle cx={facility.x} cy={facility.y} r="10" fill="#fff7ef" stroke="#cf5f50" strokeWidth="2" /><path d={`M ${facility.x - 4} ${facility.y} h8 M ${facility.x} ${facility.y - 4} v8`} stroke="#cf5f50" strokeWidth="2" /><text x={facility.x + 14} y={facility.y + 4} fontSize="10" fill="#30414b" fontWeight="700">{facility.label}</text></g>)}
        {layers.shelters && facilities.filter((f) => f.type === 'shelter').map((facility) => <g key={facility.label}><circle cx={facility.x} cy={facility.y} r="8" fill="#fff9df" stroke="#c58a2e" strokeWidth="2" /><path d={`M ${facility.x - 4} ${facility.y + 2} l4 -5 4 5 v4 h-8z`} fill="#c58a2e" /><text x={facility.x + 12} y={facility.y + 4} fontSize="10" fill="#30414b" fontWeight="700">{facility.label}</text></g>)}
        <text x="30" y="35" fill="#4b666b" fontSize="10" fontWeight="700" letterSpacing="2">NORTH KOSI FLOODPLAIN / SYNTHETIC TILES</text>
=======
        {!hasRegionalFeatures && layers.population && populationCells.map((cell, i) => <circle key={`pop-${i}`} cx={cell.x} cy={cell.y} r="38" fill="#d96555" opacity={cell.opacity} />)}
        {!hasRegionalFeatures && layers.roads && roads.map((road, i) => <path key={`road-${i}`} d={road} fill="none" stroke="#f7f4ed" strokeWidth={i === 0 ? 6 : 3} opacity=".9" />)}
        {!hasRegionalFeatures && layers.roads && roads.map((road, i) => <path key={`road-inner-${i}`} d={road} fill="none" stroke="#e89f5d" strokeWidth="1" strokeDasharray="5 7" opacity=".9" />)}
        {!hasRegionalFeatures && layers.buildings && buildings.map((building, i) => <rect key={`building-${i}`} x={building.x} y={building.y} width="8" height="6" rx="1" fill="#66747d" opacity=".7" transform={`rotate(${building.rotate} ${building.x} ${building.y})`} />)}
        {hasRegionalFeatures && regionalDataset?.features.map((feature) => { const points = feature.coordinates.map(project).map((point) => `${point.x},${point.y}`).join(' '); const first = project(feature.coordinates[0]); if (feature.kind === 'road') return layers.roads ? <polyline key={feature.id} points={points} fill="none" stroke="#e89f5d" strokeWidth="2.5" opacity=".85" /> : null; if (feature.kind === 'building') return layers.buildings ? <polygon key={feature.id} points={points} fill="#66747d" opacity=".42" stroke="#53666d" strokeWidth=".5" /> : null; if (feature.kind === 'water') return <polygon key={feature.id} points={points} fill="#4e9da6" opacity=".28" stroke="#3c8488" strokeWidth="1" />; if (feature.kind === 'hospital') return layers.hospitals ? <circle key={feature.id} cx={first.x} cy={first.y} r="6" fill="#fff7ef" stroke="#cf5f50" strokeWidth="2" /> : null; return layers.shelters ? <circle key={feature.id} cx={first.x} cy={first.y} r="5" fill="#fff9df" stroke="#c58a2e" strokeWidth="2" /> : null; })}
        {layers.change && regions.map((region) => <g key={region.id} style={{ opacity: opacity / 100 }} className={`zone-group ${selectedId === region.id ? 'is-selected' : ''}`} onClick={() => onSelect(region.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(region.id); }} role="button" tabIndex={0} aria-label={`${region.id}, ${region.changeType}, priority ${region.priority}`}><polygon points={region.polygon.points} fill={region.color} fillOpacity={selectedId === region.id ? .55 : .3} stroke={region.color} strokeWidth={selectedId === region.id ? 4 : 2} filter={selectedId === region.id ? 'url(#glow)' : undefined} /><text x={region.polygon.centroid.x} y={region.polygon.centroid.y} textAnchor="middle" fill="#17252d" fontSize="11" fontWeight="800">{region.id.replace('ZONE-', 'Z-')}</text></g>)}
        <g className="location-marker" aria-label={`Selected location ${selectedLocation.name}`}><circle cx="390" cy="270" r="13" fill="#54d6d2" opacity=".22" /><circle cx="390" cy="270" r="5" fill="#54d6d2" stroke="#10202a" strokeWidth="2" /><text x="404" y="266" fill="#17343a" fontSize="10" fontWeight="800">{selectedLocation.name}</text></g>
        {userCoordinates && <g className="user-location-marker" aria-label="Browser geolocation"><circle cx="390" cy="270" r="18" fill="none" stroke="#ff806b" strokeWidth="2" strokeDasharray="3 3" /><circle cx="390" cy="270" r="4" fill="#ff806b" stroke="#fff7ef" strokeWidth="2" /><text x="404" y="282" fill="#8f3e34" fontSize="9" fontWeight="800">YOU · {userCoordinates.latitude.toFixed(3)}, {userCoordinates.longitude.toFixed(3)}</text></g>}
        {!hasRegionalFeatures && layers.uncertain && <path d="M 467 121 C 520 97 603 110 642 152 S 668 230 633 248 C 596 266 543 222 501 213 S 449 153 467 121 Z" fill="none" stroke="#f4b35f" strokeWidth="2" strokeDasharray="6 8" opacity=".8" />}
        {!hasRegionalFeatures && layers.hospitals && facilities.filter((f) => f.type === 'hospital').map((facility) => <g key={facility.label}><circle cx={facility.x} cy={facility.y} r="10" fill="#fff7ef" stroke="#cf5f50" strokeWidth="2" /><path d={`M ${facility.x - 4} ${facility.y} h8 M ${facility.x} ${facility.y - 4} v8`} stroke="#cf5f50" strokeWidth="2" /><text x={facility.x + 14} y={facility.y + 4} fontSize="10" fill="#30414b" fontWeight="700">{facility.label}</text></g>)}
        {!hasRegionalFeatures && layers.shelters && facilities.filter((f) => f.type === 'shelter').map((facility) => <g key={facility.label}><circle cx={facility.x} cy={facility.y} r="8" fill="#fff9df" stroke="#c58a2e" strokeWidth="2" /><path d={`M ${facility.x - 4} ${facility.y + 2} l4 -5 4 5 v4 h-8z`} fill="#c58a2e" /><text x={facility.x + 12} y={facility.y + 4} fontSize="10" fill="#30414b" fontWeight="700">{facility.label}</text></g>)}
        <text x="30" y="35" fill="#4b666b" fontSize="10" fontWeight="700" letterSpacing="2">{selectedLocation.name.toUpperCase()} / {regionalDataset?.source ?? 'LOCAL MAP TILES'}</text>
>>>>>>> a8a4f96 (final update)
        <text x="735" y="43" fill="#31454a" fontSize="18" fontWeight="700">N</text><path d="M 741 49 l-6 15 h12z" fill="#31454a" />
        <g transform="translate(28 493)"><rect width="84" height="4" fill="#334c53"/><text x="0" y="18" fill="#425a5e" fontSize="10">0</text><text x="72" y="18" fill="#425a5e" fontSize="10">4 km</text></g>
      </svg>
      <div className="map-floating-control map-zoom"><button aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.35, value + .1))}><Plus size={15} /></button><button aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(.85, value - .1))}><Minus size={15} /></button><button aria-label="Locate event" onClick={() => { setZoom(1); onSelect(regions[0]?.id ?? selectedId); }}><LocateFixed size={15} /></button></div>
      <button className="map-floating-control map-layers" onClick={() => setLayer('change')} aria-pressed={layers.change}><SlidersHorizontal size={14} /><span>{layers.change ? 'Change layer on' : 'Change layer off'}</span></button>
<<<<<<< HEAD
      <div className="map-legend"><div><i className="legend-dot critical" /> Critical</div><div><i className="legend-dot high" /> High</div><div><i className="legend-dot medium" /> Medium</div><div><i className="legend-line uncertain" /> Uncertain</div></div>
=======
      <div className="map-legend"><div><i className="legend-dot critical" /> Critical</div><div><i className="legend-dot high" /> High</div><div><i className="legend-dot medium" /> Medium</div><div><i className="legend-line uncertain" /> Uncertain</div><div className="legend-source">Population: {populationSource === 'worldpop-india' ? 'WorldPop India · blocked' : 'Local fixture'}</div></div>
>>>>>>> a8a4f96 (final update)
    </div>
    <div className="map-footer"><div className="layer-toggles">{(['change', 'roads', 'buildings', 'hospitals', 'shelters', 'population', 'uncertain'] as MapLayerKey[]).map((layer) => <button key={layer} className={`layer-chip ${layers[layer] ? 'active' : ''}`} onClick={() => setLayer(layer)} aria-pressed={layers[layer]}><span className="layer-dot" />{layer === 'change' ? 'Change evidence' : layer[0].toUpperCase() + layer.slice(1)}</button>)}</div><label className="opacity-control"><span>Opacity</span><input type="range" min="25" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /><span>{opacity}%</span></label><button className={`compare-toggle ${beforeAfter ? 'active' : ''}`} onClick={() => setBeforeAfter(!beforeAfter)}><span className="compare-pip" />{beforeAfter ? 'Before / after' : 'Post-event view'}</button>{activeRegion && <span className="map-selected">Selected <strong>{activeRegion.id}</strong></span>}</div>
  </section>;
}
