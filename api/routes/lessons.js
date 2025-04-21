import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
  getAllLessons,
  getLearnerSpecificLessons,
} from "../controllers/lessons.js";

const router = express.Router();

router.get("/", isAuth, getAllLessons);
router.get("/learner_lessons", isAuth, getLearnerSpecificLessons);

export default router;
