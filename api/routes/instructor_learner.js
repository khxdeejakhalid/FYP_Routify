import express from "express";
import isAuth from "../middleware/is-auth.js";

import { getAssignedLearners } from "../controllers/instructor_learner.js";

const router = express.Router();

router.get("/assignedLearners", isAuth, getAssignedLearners);

export default router;
