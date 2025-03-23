import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
  getManeuvers,
  getManeuversByRoute,
  addManeuver,
  deleteManeuver,
  updateManeuver,
} from "../controllers/maneuvers.js";

const router = express.Router();

router.get("/", isAuth, getManeuvers);
router.get("/:routeId", isAuth, getManeuversByRoute);
router.post("/", isAuth, addManeuver);
router.delete("/:id", isAuth, deleteManeuver);
router.put("/:id", isAuth, updateManeuver);

export default router;