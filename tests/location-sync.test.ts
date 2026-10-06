import { describe, expect, it } from 'vitest';
import { indianLocations } from '../src/data/indian-locations';
import { isValidCoordinates } from '../src/services/locationService';
import { coordinatesEqual, createWorkspaceLocation } from '../src/services/location-sync';

describe('location workspace synchronization', () => {
  const mumbai = indianLocations.find((location) => location.id === 'mumbai')!;

  it('accepts valid browser coordinates and rejects invalid values', () => {
    expect(isValidCoordinates({ latitude: 19.076, longitude: 72.8777 })).toBe(true);
    expect(isValidCoordinates({ latitude: 91, longitude: 72 })).toBe(false);
    expect(() => createWorkspaceLocation(mumbai, { latitude: 91, longitude: 72 }, 'browser', 1)).toThrow('valid geographic range');
  });

  it('treats unchanged coordinates as the same workspace location', () => {
    expect(coordinatesEqual({ latitude: 19.076, longitude: 72.8777 }, { latitude: 19.0760000001, longitude: 72.8777000001 })).toBe(true);
    expect(coordinatesEqual({ latitude: 19.076, longitude: 72.8777 }, { latitude: 19.1, longitude: 72.9 })).toBe(false);
  });

  it('preserves the source and revision for preset and browser updates', () => {
    const workspace = createWorkspaceLocation(mumbai, { latitude: 19.076, longitude: 72.8777 }, 'browser', 4);
    expect(workspace).toMatchObject({ source: 'browser', revision: 4, location: mumbai });
  });
});
