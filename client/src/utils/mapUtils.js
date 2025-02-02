import * as Location from "expo-location";
import { PermissionsAndroid, Platform } from "react-native";

export const getCurrentLocation = async () => {
  const locationCoordinates = await Location.getCurrentPositionAsync({});
  return {
    latitude: locationCoordinates.coords.latitude,
    longitude: locationCoordinates.coords.longitude,
    heading: locationCoordinates.coords.heading,
  };
};

export const cleanCoordinates = (coords) => {
  return coords.filter((point, index, arr) => {
    if (index === 0) return true;
    const prevPoint = arr[index - 1];
    return !(
      point.latitude === prevPoint.latitude &&
      point.longitude === prevPoint.longitude
    );
  });
};

export const createChunks = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size - 1) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
export const animateToRegion = (mapRef, userLocation, location) => {
  userLocation
    .timing({
      latitude: location.latitude,
      longitude: location.longitude,
      duration: 1000,
      useNativeDriver: false,
    })
    .start();

  if (mapRef.current) {
    mapRef.current.animateCamera(
      {
        center: location,
        zoom: 16,
      },
      { duration: 1000 },
    );
  }
};


export const calculateBearing = (startLat, startLng, endLat, endLng) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const toDegrees = (rad) => (rad * 180) / Math.PI;

  const dLng = toRadians(endLng - startLng);
  const lat1 = toRadians(startLat);
  const lat2 = toRadians(endLat);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360; // Normalise to 0-360
};

export const findNearestPoint = (currentLat, currentLng, route) => {
  let minDistance = Infinity;
  let nearestPoint = null;
  let nearestIndex = 0;

  route.forEach((point, index) => {
    const distance = getDistance(
      currentLat,
      currentLng,
      point.currentLatitude,
      point.currentLongitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestPoint = point;
      nearestIndex = index;
    }
  });

  return { nearestPoint, nearestIndex };
};