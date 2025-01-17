import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
  getTestCenters,
  getTestCenter,
  addTestCenter,
  deleteTestCenter,
  updateTestCenter,
} from "../controllers/test-center.js";

const router = express.Router();

router.get("/", isAuth, getTestCenters);
router.get("/:name", isAuth, getTestCenter);
router.post("/", isAuth, addTestCenter);
router.delete("/:name", isAuth, deleteTestCenter);
router.put("/:name", isAuth, updateTestCenter);

export default router;