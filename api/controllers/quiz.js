import Quiz from "../models/quiz.js";
import Questions from "../models/questions.js";
import Options from "../models/options.js";

export const getQuizes = async (req, res) => {
  try {
    const [quizzes] = await Quiz.fetchAll();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch quizzes", error: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;

    const [quizRows] = await Quiz.fetchById(quizId);
    console.log("rows:", quizRows); //db rows for quiz

    if (quizRows.length === 0) {
      return res
        .status(404)
        .json({ status: "failure", description: "Quiz Not Found" });
    }

    const quiz = quizRows[0];

    const [questionsRows] = await Questions.fetchByQuizId(quizId);
    console.log("Q rows:", questionsRows); //db rows for q

    const questions = [];

    for (const question of questionsRows) {
      const [optionsRows] = await Options.fetchByQuizIdAndQuestionId(
        quizId,
        question.ID
      );

      questions.push({
        ...question,
        options: optionsRows,
      });
    }

    // Combine all data
    const quizWithQuestionsAndOptions = {
      ...quiz,
      questions,
    };

    res
      .status(200)
      .json({ status: "success", quiz: quizWithQuestionsAndOptions });
  } catch (error) {
    res.status(500).json({ status: "failure", description: error });
  }
};

export const addQuiz = async (req, res) => {};
export const deleteQuiz = async (req, res) => {};
export const updateQuiz = async (req, res) => {};
