import express from "express";
import isAuth from "../middleware/is-auth.js";
import { login, logout, signup } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", isAuth, logout);
router.post("/signup", signup);

export default router;
