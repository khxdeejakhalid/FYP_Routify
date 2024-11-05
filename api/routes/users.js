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
router.get("/:email", getUser);
router.post("/", addUser);
router.delete("/:email", deleteUser);
router.put("/:email", updateUser);

export default router;