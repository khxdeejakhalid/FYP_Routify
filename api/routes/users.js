import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
  checkEmail
} from "../controllers/users.js";

const router = express.Router();

router.get("/", isAuth, getUsers);
router.get("/exists", isAuth, checkEmail);
router.get("/:email", isAuth, getUser);
router.post("/", isAuth, addUser);
router.delete("/:email", isAuth, deleteUser);
router.put("/:email", isAuth, updateUser);

export default router;