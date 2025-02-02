import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
  getTurns,
  getTurnsByRoute,
  addTurn,
  deleteTurn,
  updateTurn,
} from "../controllers/turns.js";

const router = express.Router();

router.get("/", isAuth, getTurns);
router.get("/:routeId", isAuth, getTurnsByRoute);
router.post("/", isAuth, addTurn);
router.delete("/:id", isAuth, deleteTurn);
router.put("/:id", isAuth, updateTurn);

export default router;