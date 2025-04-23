import Session from "../models/session.js";

export const getSessions = async (req, res) => {
  try {
    const [sessions] = await Session.fetchAll();
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch sessions", error: error.message });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const [sessionRows] = await Session.fetchById(sessionId);

    if (sessionRows.length === 0) {
      return res
        .status(404)
        .json({ status: "failure", description: "Session Not Found" });
    }

    res.status(200).json({ status: "success", session: sessionRows[0] });
  } catch (error) {
    res.status(500).json({ status: "failure", description: error });
  }
};

export const bookSession = async (req, res) => {
  const learnerEmail = req.body.learnerEmail;
  const instructorEmail = req.body.instructorEmail;
  const sessionDate = req.body.sessionDate;
  const sessionStartTime = req.body.sessionStartTime;
  const sessionEndTIme = req.body.sessionEndTime;
  const status = req.body.status;

  const session = new Session(
    instructorEmail,
    learnerEmail,
    sessionStartTime,
    sessionEndTIme,
    sessionDate,
    status
  );

  try {
    const bookedSession = await session.save();

    res.status(201).json({
      status: "success",
      description: "Session has been booked successfully",
      session: bookedSession,
    });
  } catch (error) {
    res.status(400).json({ status: "failure", description: error.message });
  }
};

export const getSessionByUser = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const [sessionRows] = await Session.fetchByEmail(userEmail);

    res.status(200).json({ status: "success", sessions: sessionRows });
  } catch (error) {
    res.status(500).json({ status: "failure", description: error });
  }
};

export const cancelSession = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const cancelledSession = await Session.cancelSession(sessionId);

    res.status(201).json({
      status: "success",
      description: "Session has been cancelled successfully",
      session: cancelledSession,
    });
  } catch (error) {
    res.status(500).json({ status: "failure", description: error });
  }
};
