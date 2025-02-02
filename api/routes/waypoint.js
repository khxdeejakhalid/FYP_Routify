import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
  getWaypoints,
  getWaypointsByRoute,
  addWaypoint,
  deleteWaypoint,
  updateWaypoint,
} from "../controllers/waypoint.js";

const router = express.Router();

router.get("/", isAuth, getWaypoints);
router.get("/:routeId", isAuth, getWaypointsByRoute);
router.post("/", isAuth, addWaypoint);
router.delete("/:id", isAuth, deleteWaypoint);
router.put("/:id", isAuth, updateWaypoint);

export default router;