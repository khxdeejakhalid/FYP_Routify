import LessonsFeedback from "../models/lessons_feedback.js";

export const updateLessonFeedback = async (req, res) => {
  const { lessonId, feedback } = req.body;

  LessonsFeedback.updateLessonFeedback(lessonId, feedback)
    .then(() => {
      res.status(200).json({
        message: "Feedback updated successfully",
        status: "success",
      });
    })
    .catch((err) => {
      console.error("Error updating feedback:", err);
      res.status(500).json({
        message: "Error updating feedback",
        error: err,
      });
    });
};

export const addLessonFeedback = async (req, res) => {
  LessonsFeedback.addLessonFeedback(req.body)
    .then(([rows]) => {
      res.status(200).json({
        message: "Feedback added successfully",
        status: "success",
      });
    })
    .catch((err) => {
      console.error("Error updating feedback:", err);
      res.status(500).json({
        message: "Error updating feedback",
        error: err,
      });
    });
};
