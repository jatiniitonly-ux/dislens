import { useEffect, useState } from 'react';
import type { IndianLocation } from '../domain/types';

interface IndianLocationSelectorProps {
  locations: IndianLocation[];
  value: IndianLocation;
  onChange: (location: IndianLocation) => void;
  regionalStatus?: 'loading' | 'ready' | 'empty' | 'error' | 'unavailable';
}

export function IndianLocationSelector({ locations, value, onChange, regionalStatus }: IndianLocationSelectorProps) {
  const [query, setQuery] = useState(`${value.name} · ${value.state}`);
  useEffect(() => setQuery(`${value.name} · ${value.state}`), [value]);
  const chooseMatch = (raw: string) => {
    setQuery(raw);
    const normalized = raw.trim().toLowerCase();
    const match = locations.find((location) => `${location.name} · ${location.state}`.toLowerCase() === normalized || location.name.toLowerCase() === normalized);
    if (match) onChange(match);
  };
  return <label className="indian-location-selector">
    <span className="eyebrow">INDIA AOI / LOCATION</span>
    <input list="indian-location-options" value={query} aria-label="Search Indian city or region" onChange={(event) => chooseMatch(event.target.value)} onBlur={(event) => chooseMatch(event.target.value)} />
    <datalist id="indian-location-options">{locations.map((location) => <option key={location.id} value={`${location.name} · ${location.state}`}>{location.regionType} · {location.datasetStatus}</option>)}</datalist>
    <small>{value.regionType === 'region' ? 'Regional AOI' : 'City AOI'} · {regionalStatus === 'loading' ? 'Loading regional evidence…' : regionalStatus === 'ready' ? 'Regional dataset loaded' : regionalStatus === 'empty' ? 'No regional data available' : regionalStatus === 'error' ? 'Regional dataset loading failed' : regionalStatus === 'unavailable' ? 'Regional evidence unavailable' : value.datasetStatus === 'local' ? 'Local dataset available' : value.datasetStatus === 'available' ? 'Dataset available' : 'Dataset not configured'}</small>
  </label>;
}
