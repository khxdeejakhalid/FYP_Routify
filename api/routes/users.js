import express from "express";
import {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
  checkEmail
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/exists", checkEmail);
router.get("/:username", getUser);
router.post("/", addUser);
router.delete("/:username", deleteUser);
router.put("/:username", updateUser);

export default router;