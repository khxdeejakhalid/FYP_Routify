import * as Location from "expo-location";

export const mapUtils = (function () {
  const getCurrentLocation = async () => {
    const locationCoordinates = await Location.getCurrentPositionAsync({});

    return {
      latitude: locationCoordinates.coords.latitude,
      longitude: locationCoordinates.coords.longitude,
      heading: locationCoordinates.coords.heading,
      speed: locationCoordinates.coords.speed, // speed in m/s
      timestamp: locationCoordinates.timestamp,
    };
  };

  const cleanCoordinates = (coords) => {
    return coords.filter((point, index, arr) => {
      if (index === 0) return true;
      const prevPoint = arr[index - 1];
      return !(
        point.latitude === prevPoint.latitude &&
        point.longitude === prevPoint.longitude
      );
    });
  };

  const createChunks = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size - 1) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;

    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const animateToRegion = (mapRef, userLocation, location) => {
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

  const findNearestPoint = (currentLat, currentLng, route) => {
    let minDistance = Infinity;
    let nearestPoint = null;
    let nearestIndex = 0;

    route.forEach((point, index) => {
      const distance = getDistance(
        currentLat,
        currentLng,
        point.latitude,
        point.longitude,
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
        nearestIndex = index;
      }
    });

    return { nearestPoint, nearestIndex };
  };

  const transformRoute = (routeData) => {
    return routeData.map((point) => ({
      id: point.ID,
      routeId: point.ROUTE_ID,
      latitude: parseFloat(point.LATITUDE),
      longitude: parseFloat(point.LONGITUDE),
      nextLatitude: parseFloat(point.NEXT_LATITUDE),
      nextLongitude: parseFloat(point.NEXT_LONGITUDE),
      instruction: point.INSTRUCTION,
      distance: point.DISTANCE,
      duration: point.DURATION,
    }));
  };

  const transformTurns = (turns) => {
    return turns.map((point) => ({
      id: point.ID,
      routeId: point.ROUTE_ID,
      latitude: parseFloat(point.LATITUDE),
      longitude: parseFloat(point.LONGITUDE),
    }));
  };

  return {
    getCurrentLocation,
    cleanCoordinates,
    createChunks,
    getDistance,
    animateToRegion,
    findNearestPoint,
    transformRoute,
    transformTurns
  };
})();
