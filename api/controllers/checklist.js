import Checklist from "../models/checklist.js";

export const getChecklist = (req, res) => {
  const userEmail = req.query.userEmail;
  console.log("🚀 ~ getChecklist ~ userEmail:", userEmail);
  Checklist.fetchAll(userEmail)
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", checklists: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const updateChecklistStatus = (req, res) => {
  const { checklistItems, userEmail } = req.body;
  if (
    !Array.isArray(checklistItems) ||
    checklistItems.length === 0 ||
    !userEmail
  ) {
    return res
      .status(400)
      .json({ status: "failure", description: "Invalid request data" });
  }

  const updatePromises = checklistItems.map((checklist) =>
    Checklist.updateStatus(checklist.id, checklist.status, userEmail)
      .then(() => ({ id: checklist.id, status: true }))
      .catch((error) => ({
        id: checklist.id,
        status: false,
        description: error.message,
      }))
  );

  // Wait for all updates to complete
  Promise.all(updatePromises)
    .then((results) => {
      res.status(200).json({
        status: "success",
        description: "All checklist items updated successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: "failure",
        description: "An error occurred while updating checklist items",
        error: error.message,
      });
    });
};
