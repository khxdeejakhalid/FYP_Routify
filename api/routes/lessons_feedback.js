import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
  updateLessonFeedback,
  addLessonFeedback,
} from "../controllers/lessons_feedback.js";

const router = express.Router();

router.post("/", isAuth, addLessonFeedback);
router.post("/updateFeedback", isAuth, updateLessonFeedback);
export default router;
