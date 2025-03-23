import Maneuver from "../models/maneuver.js";

export const getManeuvers = async (req, res) => {
  Maneuver.fetchAll()
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", maneuvers: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const getManeuversByRoute = async (req, res) => {
  const routeId = req.params.routeId;
  Maneuver.fetchByRouteId(routeId)
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", maneuvers: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const addManeuver = async (req, res) => {
  const routeId = req.body.routeId;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const type = req.body.type;
  const cordType = req.body.cordType;

  if (!routeId || !latitude || !longitude || !type || !cordType) {
    return res.status(400).json({
      status: "failure",
      description:
        "Missing required fields: routeId, latitude, longitude, type or cordType",
    });
  }

  const maneuver = new Maneuver(routeId, latitude, longitude, type, cordType);

  maneuver
    .save()
    .then(() => {
      res.status(201).json({
        status: "success",
        description: "maneuver has been added successfully",
      });
    })
    .catch((error) =>
      res.status(400).json({ status: "failure", description: error })
    );
};

export const deleteManeuver = async (req, res) => {};
export const updateManeuver = async (req, res) => {};
