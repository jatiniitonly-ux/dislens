<<<<<<< HEAD
import { useState } from 'react';
=======
import { useEffect, useRef, useState } from 'react';
>>>>>>> a8a4f96 (final update)
import { MapPin, Navigation, RefreshCw } from 'lucide-react';
import { findNearestTarget, getCurrentLocation, loadRoutingTargets, reverseGeocode, type AddressResult, type Coordinates, type ProximityMatch } from '../services/locationService';

interface LocationDetectorProps {
  onTargetChange?: (target: ProximityMatch | null, coordinates: Coordinates | null) => void;
}

export function LocationDetector({ onTargetChange }: LocationDetectorProps) {
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<AddressResult | null>(null);
  const [nearest, setNearest] = useState<ProximityMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD

  const detectLocation = async () => {
    setLoading(true); setError(null); setAddress(null); setNearest(null);
    try {
      const current = await getCurrentLocation();
      const [resolvedAddress, targets] = await Promise.all([reverseGeocode(current), loadRoutingTargets()]);
      const match = findNearestTarget(current, targets);
      setCoordinates(current); setAddress(resolvedAddress); setNearest(match); onTargetChange?.(match, current);
      if (!match) setError('Location detected, but no geospatial targets are available in the routing dataset.');
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Location detection failed. Please try again.';
      setError(message); onTargetChange?.(null, null);
    } finally { setLoading(false); }
=======
  const requestRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const lastResultRef = useRef<{ coordinates: Coordinates; address: AddressResult; nearest: ProximityMatch | null } | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const detectLocation = async () => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true); setError(null); setAddress(null); setNearest(null);
    try {
      const current = await getCurrentLocation();
      if (requestId !== requestRef.current) return;
      const last = lastResultRef.current;
      if (last && Math.abs(last.coordinates.latitude - current.latitude) <= 0.000001 && Math.abs(last.coordinates.longitude - current.longitude) <= 0.000001) {
        setCoordinates(current); setAddress(last.address); setNearest(last.nearest); onTargetChange?.(last.nearest, current); return;
      }
      const [resolvedAddress, targets] = await Promise.all([reverseGeocode(current, controller.signal), loadRoutingTargets(controller.signal)]);
      if (requestId !== requestRef.current) return;
      const match = findNearestTarget(current, targets);
      setCoordinates(current); setAddress(resolvedAddress); setNearest(match); onTargetChange?.(match, current);
      lastResultRef.current = { coordinates: current, address: resolvedAddress, nearest: match };
      if (!match) setError('Location detected, but no geospatial targets are available in the routing dataset.');
    } catch (reason) {
      if (requestId !== requestRef.current || (reason instanceof DOMException && reason.name === 'AbortError')) return;
      const message = reason instanceof Error ? reason.message : 'Location detection failed. Please try again.';
      setError(message); onTargetChange?.(null, null);
    } finally { if (requestId === requestRef.current) setLoading(false); }
>>>>>>> a8a4f96 (final update)
  };

  return <section className="location-detector" aria-label="Current location and proximity route"><div className="location-detector-header"><div><span className="eyebrow">PROXIMITY ROUTE ENGINE</span><strong>Current location detection</strong></div><Navigation size={16} /></div><button className="location-detect-button" onClick={detectLocation} disabled={loading}>{loading ? <><RefreshCw size={15} className="spin" /> Detecting location…</> : <><MapPin size={15} /> Detect My Current Location</>}</button>{address && coordinates && <div className="location-result"><strong>{address.displayName}</strong><span>{coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)} · ±{Math.round(coordinates.accuracy ?? 0)} m</span>{nearest ? <div className={`nearest-target ${nearest.type === 'safe-route' ? 'safe' : 'zone'}`}><span className="eyebrow">NEAREST {nearest.type === 'safe-route' ? 'SAFE ROUTE' : 'DISASTER ZONE'}</span><strong>{nearest.name}</strong><span>{nearest.distanceKm.toFixed(2)} km away · {nearest.status ?? 'Dataset target'}</span>{nearest.detail && <small>{nearest.detail}</small>}</div> : <span className="location-muted">No proximity target available in manus-routes.json.</span>}</div>}{error && <p className="location-error" role="alert">{error}</p>}<small className="location-disclaimer">Uses browser GPS and OpenStreetMap Nominatim. Routing targets are limited to the configured local dataset.</small></section>;
}
