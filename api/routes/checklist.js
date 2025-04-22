import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
    getChecklist,
    updateChecklistStatus,
} from "../controllers/checklist.js";

const router = express.Router();

router.get("/", isAuth, getChecklist);
router.post("/", isAuth, updateChecklistStatus);

export default router;
