import Feedback from "../models/feedback.js";

export const getFeedback = async (req, res) => {
  const userEmail = req.query.userEmail;

  try {
    const [maneuverFeedback, completedRoutes] = await Promise.all([
      Feedback.fetchManueverFeedback(userEmail), // First query: Maneuver feedback
      Feedback.getCompletedRoutes(userEmail),   // Second query: Completed routes
    ]);

    const feedbackRows = maneuverFeedback[0];
    const routesRows = completedRoutes[0];

    res.status(200).json({
      status: "success",
      feedback: feedbackRows || [],
      completedRoutes: routesRows.map(row => row.ROUTE_ID) || [],
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      description: error.message,
    });
  }
};

export const saveManueverFeedbackScore = async (req, res) => {
  const { selectedRoute, score, manueverType, userEmail } = req.body;
  // print the above variables pls
  console.log(selectedRoute)
  console.log(score)
  console.log(manueverType)
  console.log(userEmail)
  
  if (!selectedRoute || !score || !userEmail || !manueverType) {
    console.log('crashed')
    return res.status(400).json({ 
      status: "failure",
      description: "Missing required fields",
    });
  }
  const feedbackInstance = new Feedback(
    score,
    selectedRoute,
    manueverType,
    userEmail
  );

  feedbackInstance
    .save()
    .then(() => {
      console.log('worked')
      res.status(201).json({
        status: "success",
        description: "maneuver score saved successfully",
      });
    })
    .catch((error) =>
      res.status(400).json({ status: "failure", description: error })
    );
};
