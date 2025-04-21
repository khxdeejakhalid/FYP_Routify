import InstructorLearner from "../models/instructor_learner.js";

export const getAssignedLearners = async (req, res) => {
  const instructorEmail = req.query.instructorEmail;
  InstructorLearner.fetchAssignedLearners(instructorEmail)
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", assignedLearners: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};
