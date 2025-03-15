export const calculateInitialRegion = coords => {
  if (coords.length === 0) return null; // Empty array, return null or handle error accordingly

  let minLat = coords[0].latitude;
  let maxLat = coords[0].latitude;
  let minLong = coords[0].longitude;
  let maxLong = coords[0].longitude;

  // Loop through the coordinates to find the min/max latitude and longitude
  coords.forEach(coord => {
    if (coord.latitude < minLat) minLat = coord.latitude;
    if (coord.latitude > maxLat) maxLat = coord.latitude;
    if (coord.longitude < minLong) minLong = coord.longitude;
    if (coord.longitude > maxLong) maxLong = coord.longitude;
  });

  // Calculate the center of the bounding box
  const centerLat = (minLat + maxLat) / 2;
  const centerLong = (minLong + maxLong) / 2;

  // Calculate the deltas (the zoom level in map terms)
  const latitudeDelta = maxLat - minLat;
  const longitudeDelta = (maxLong - minLong) * 2.5;

  // Return the initial region object
  return {
    latitude: centerLat,
    latitudeDelta: latitudeDelta,
    longitude: centerLong,
    longitudeDelta: longitudeDelta,
  };
};
