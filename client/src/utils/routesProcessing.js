import { getDataFromRoadsAPI, getDataFromDirectionsAPI } from "../utils/api.js";
import routeDataProcessed from "../assets/json/Route1Accurate.json";
import routeDataWithDirectionsAPI from "../assets/json/Route1DetailedDirections.json";
import { mapUtils } from "../utils/mapUtils";

async function fetchRouteDirections(origin, destination, waypoints) {
  try {
    const directions = await getDataFromDirectionsAPI(
      origin,
      destination,
      waypoints,
    );
    return directions;
  } catch (error) {
    console.error("Error fetching directions:", error);
    return [];
  }
}

async function getAllDirections() {
  const chunks = mapUtils.createChunks(routeDataProcessed, 25);
  let allDirectionsData = [];

  for (const chunk of chunks) {
    const origin = `${chunk[0].latitude},${chunk[0].longitude}`;
    const destination = `${chunk[chunk.length - 1].latitude},${chunk[chunk.length - 1].longitude}`;
    const waypoints = chunk
      .slice(1, -1)
      .map((point) => `${point.latitude},${point.longitude}`)
      .join("|");

    const chunkDirections = await fetchRouteDirections(
      origin,
      destination,
      waypoints,
    );

    allDirectionsData = allDirectionsData.concat(chunkDirections); // Append chunk data to the main array
  }

  console.log(JSON.stringify(allDirectionsData));
}

async function getRoadsAPIData(routeData) {
  try {
    const route = await getDataFromRoadsAPI(routeData);
    console.log(route);
    return route;
  } catch (error) {
    console.error("Error fetching directions:", error);
    return [];
  }
}

const transformRoute = (routeData) => {
  return routeData.map((point) => ({
    latitude: parseFloat(point.currentLatitude),
    longitude: parseFloat(point.currentLongitude),
    nextLatitude: parseFloat(point.nextLatitude),
    nextLongitude: parseFloat(point.nextLongitude),
    instruction: point.instruction,
    distance: point.distance,
    duration: point.duration,
  }));
};

export function processRoute(routeData) {
  // First fetch from ROADS API
  //   const route = getRoadsAPIData(routeData);

  // Then feed to DIRECTIONS API
  // getAllDirections();

  // Then return a transformed json file
  return transformRoute(routeDataWithDirectionsAPI);
}