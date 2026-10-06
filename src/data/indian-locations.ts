import type { IndianLocation } from '../domain/types';

export const indianLocations: IndianLocation[] = [
  { id: 'delhi', name: 'Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.209, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', latitude: 19.076, longitude: 72.8777, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', latitude: 17.385, longitude: 78.4867, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'patna', name: 'Patna', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', latitude: 26.1445, longitude: 91.7362, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu and Kashmir', latitude: 34.0837, longitude: 74.7973, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, regionType: 'city', defaultZoom: 12, datasetStatus: 'not-configured' },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', latitude: 9.9312, longitude: 76.2673, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, regionType: 'city', defaultZoom: 11, datasetStatus: 'not-configured' },
  { id: 'kosi-bihar', name: 'Kosi / Bihar region', state: 'Bihar', latitude: 26.49, longitude: 87.29, regionType: 'region', defaultZoom: 9, datasetStatus: 'local', preImage: 'Local benchmark · pre-event optical', postImage: 'Local benchmark · post-event optical', source: 'Local demonstration dataset', sourceUrl: 'local://disasterlens/local-benchmark' },
];

export function findNearestIndianLocation(latitude: number, longitude: number): IndianLocation {
  return indianLocations.reduce((nearest, location) => {
    const nearestDistance = Math.hypot(nearest.latitude - latitude, nearest.longitude - longitude);
    const locationDistance = Math.hypot(location.latitude - latitude, location.longitude - longitude);
    return locationDistance < nearestDistance ? location : nearest;
  }, indianLocations[0]);
}
