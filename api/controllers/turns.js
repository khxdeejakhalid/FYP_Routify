import Turn from "../models/turn.js";

export const getTurns = async (req, res) => {
    Turn.fetchAll()
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", waypoints: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const getTurnsByRoute = async (req, res) => {
  const routeId = req.params.routeId;
  Turn.fetchByRouteId(routeId)
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", turns: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const addTurn = async (req, res) => {
  const routeId = req.body.routeId;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  if (
    !routeId ||
    !latitude ||
    !longitude
  ) {
    return res.status(400).json({
      status: "failure",
      description: "Missing required fields: routeId, latitude, or longitude",
    });
  }

  const turn = new Turn(
    routeId,
    latitude,
    longitude
  );

  turn
    .save()
    .then(() => {
      res.status(201).json({
        status: "success",
        description: "turn has been added successfully",
      });
    })
    .catch((error) =>
      res.status(400).json({ status: "failure", description: error })
    );
};

export const deleteTurn = async (req, res) => {};
export const updateTurn = async (req, res) => {};
