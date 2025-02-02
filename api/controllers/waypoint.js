import Waypoint from "../models/waypoint.js";

export const getWaypoints = async (req, res) => {
  Waypoint.fetchAll()
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", waypoints: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const getWaypointsByRoute = async (req, res) => {
  const routeId = req.params.routeId;
  Waypoint.fetchByRouteId(routeId)
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", waypoints: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const addWaypoint = async (req, res) => {
  const routeId = req.body.routeId;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const next_latitude = req.body.next_latitude;
  const next_longitude = req.body.next_longitude;
  const instruction = req.body.instruction;
  const distance = req.body.distance;
  const duration = req.body.duration;

  if (
    !routeId ||
    !latitude ||
    !longitude ||
    !next_latitude ||
    !next_longitude
  ) {
    return res.status(400).json({
      status: "failure",
      description: "Missing required fields: routeId, latitude, longitude, next_latitude or next_longitude",
    });
  }

  const waypoint = new Waypoint(
    routeId,
    latitude,
    longitude,
    next_latitude,
    next_longitude,
    instruction,
    distance,
    duration
  );

  waypoint
    .save()
    .then(() => {
      res.status(201).json({
        status: "success",
        description: "waypoint has been added successfully",
      });
    })
    .catch((error) =>
      res.status(400).json({ status: "failure", description: error })
    );
};

export const deleteWaypoint = async (req, res) => {};
export const updateWaypoint = async (req, res) => {};
