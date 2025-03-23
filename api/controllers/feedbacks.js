import Feedback from "../models/feedback.js";

export const getFeedback = async (req, res) => {
  const userEmail = req.query.userEmail;
  Feedback.fetchManueverFeedback(userEmail)
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", feedback: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const saveManueverFeedbackScore = async (req, res) => {
  const { routeId, score, manueverType, userEmail } = req.body;
  if (!routeId || !score || !userEmail || !manueverType) {
    return res.status(400).json({
      status: "failure",
      description: "Missing required fields",
    });
  }
  const feedbackInstance = new Feedback(
    score,
    routeId,
    manueverType,
    userEmail
  );

  feedbackInstance
    .save()
    .then(() => {
      res.status(201).json({
        status: "success",
        description: "maneuver score saved successfully",
      });
    })
    .catch((error) =>
      res.status(400).json({ status: "failure", description: error })
    );
};
