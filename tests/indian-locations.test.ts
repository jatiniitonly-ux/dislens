import { describe, expect, it } from 'vitest';
import { findNearestIndianLocation, indianLocations } from '../src/data/indian-locations';

describe('Indian location catalog', () => {
  it('contains the required cities and Kosi/Bihar region', () => {
    const names = new Set(indianLocations.map((location) => location.name));
    for (const name of ['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Patna', 'Guwahati', 'Bhubaneswar', 'Srinagar', 'Chandigarh', 'Kochi', 'Indore', 'Bhopal', 'Kosi / Bihar region']) expect(names.has(name)).toBe(true);
  });

  it('matches browser coordinates to the nearest catalog location', () => {
    expect(findNearestIndianLocation(26.49, 87.29).id).toBe('kosi-bihar');
    expect(findNearestIndianLocation(19.08, 72.88).id).toBe('mumbai');
  });
});
