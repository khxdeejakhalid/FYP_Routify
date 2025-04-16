import express from "express";
import isAuth from "../middleware/is-auth.js";
import {
  getQuizes,
  getQuizById,
  addQuiz,
  deleteQuiz,
  updateQuiz,
} from "../controllers/quiz.js";

const router = express.Router();

router.get("/", isAuth, getQuizes);
router.get("/:id", isAuth, getQuizById);
router.post("/", isAuth, addQuiz);
router.delete("/:id", isAuth, deleteQuiz);
router.put("/:id", isAuth, updateQuiz);

export default router;