import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
  getFeedback,
  saveManueverFeedbackScore,
} from "../controllers/feedbacks.js";

const router = express.Router();

router.get("/", isAuth, getFeedback);
router.post("/", isAuth, saveManueverFeedbackScore);

export default router;
