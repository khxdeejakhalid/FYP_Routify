import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
  getSessions,
  getSessionById,
  bookSession,
  cancelSession,
  getBookedSessions,
  editSession,
  approveSession,
  rejectSession,
} from "../controllers/sessions.js";

const router = express.Router();

router.get("/", isAuth, getSessions);
router.get("/booked", isAuth, getBookedSessions);
router.get("/:id", isAuth, getSessionById);
router.post("/", isAuth, bookSession);
router.patch("/:id", isAuth, cancelSession);
router.patch("/edit/:id", isAuth, editSession);
router.patch("/approve/:id", isAuth, approveSession);
router.patch("/reject/:id", isAuth, rejectSession);

export default router;
