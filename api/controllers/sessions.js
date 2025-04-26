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
  const {
    bookedBy,
    status,
    sessionDate,
    sessionEndTime,
    instructorEmail,
    sessionStartTime,
    learnerEmail,
  } = req.body;

  const session = new Session(
    instructorEmail,
    learnerEmail,
    sessionStartTime,
    sessionEndTime,
    sessionDate,
    status,
    bookedBy
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

export const getBookedSessions = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const [sessionRows] = await Session.fetchByEmail(userEmail);

    const formattedRows = sessionRows.map((row) => ({
      ...row,
      startTime: new Date(row.startTime).toLocaleString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
      endTime: new Date(row.endTime).toLocaleString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
    }));

    res.status(200).json({ status: "success", sessions: formattedRows });
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

export const editSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { sessionDate, sessionStartTime, sessionEndTime, status, bookedBy } =
      req.body;

    const updatedSession = await Session.updateSession(sessionId, {
      status,
      sessionStartTime,
      sessionEndTime,
      sessionDate,
      bookedBy,
    });

    res.status(200).json({
      status: "success",
      description: "Session has been updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    res.status(500).json({ status: "failure", description: error });
  }
};

export const approveSession = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const approvedSession = await Session.updateSessionStatus(
      sessionId,
      "SCHEDULED"
    );

    res.status(200).json({
      status: "success",
      description: "Session has been approved successfully",
      session: approvedSession,
    });
  } catch (error) {
    res.status(500).json({ status: "failure", description: error });
  }
};

export const rejectSession = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const rejectedSession = await Session.updateSessionStatus(
      sessionId,
      "CANCELLED"
    );

    res.status(200).json({
      status: "success",
      description: "Session has been rejected successfully",
      session: rejectedSession,
    });
  } catch (error) {
    res.status(500).json({ status: "failure", description: error });
  }
};
