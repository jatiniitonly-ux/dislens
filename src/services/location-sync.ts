import type { IndianLocation } from '../domain/types';
import type { Coordinates } from './locationService';

export type LocationSyncSource = 'preset' | 'browser';

export interface WorkspaceLocation {
  location: IndianLocation;
  coordinates: Coordinates;
  source: LocationSyncSource;
  revision: number;
}

export function coordinatesEqual(a: Coordinates | null, b: Coordinates | null, epsilon = 0.000001): boolean {
  if (!a || !b) return a === b;
  return Math.abs(a.latitude - b.latitude) <= epsilon && Math.abs(a.longitude - b.longitude) <= epsilon;
}

export function createWorkspaceLocation(location: IndianLocation, coordinates: Coordinates, source: LocationSyncSource, revision: number): WorkspaceLocation {
  if (!Number.isFinite(coordinates.latitude) || !Number.isFinite(coordinates.longitude) || coordinates.latitude < -90 || coordinates.latitude > 90 || coordinates.longitude < -180 || coordinates.longitude > 180) {
    throw new Error('Detected coordinates are outside the valid geographic range.');
  }
  return { location, coordinates, source, revision };
}
