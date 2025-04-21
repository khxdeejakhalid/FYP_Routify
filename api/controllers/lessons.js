import Lessons from "../models/lessons.js";

export const getAllLessons = async (req, res) => {
  Lessons.fetchLessons()
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", lessons: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const getLearnerSpecificLessons = async (req, res) => {
  const { learnerEmail, instructorEmail } = req.query;

  Lessons.fetchLessonsByLearnerId({ learnerEmail, instructorEmail })
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", lessons: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};
