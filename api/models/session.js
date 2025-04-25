import db from "../util/database.js";

export default class Session {
  constructor(
    instructorEmail,
    learnerEmail,
    sessionStartTime,
    sessionEndTime,
    sessionDate,
    status
  ) {
    this.instructorEmail = instructorEmail;
    this.learnerEmail = learnerEmail;
    this.sessionStartTime = sessionStartTime;
    this.sessionEndTime = sessionEndTime;
    this.sessionDate = sessionDate;
    this.status = status;
  }

  save() {
    return db.execute(
      `INSERT INTO SESSIONS (instructor_email, learner_email, session_start_time, session_end_time, session_date, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        this.instructorEmail,
        this.learnerEmail,
        this.sessionStartTime,
        this.sessionEndTime,
        this.sessionDate,
        this.status,
      ]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM SESSIONS`);
  }

  static fetchById(id) {
    return db.execute(`SELECT * FROM SESSIONS WHERE SESSIONS.id = ?`, [id]);
  }

  static fetchByEmail(userEmail) {
    return db.execute(
      `
      SELECT 
        SESSIONS.SESSION_DATE AS date,
        SESSIONS.SESSION_START_TIME AS startTime,
        SESSIONS.SESSION_END_TIME AS endTime,
        SESSIONS.status AS status,
        SESSIONS.id AS id,
        instructor.name AS instructorName,
        learner.name AS learnerName
      FROM 
        SESSIONS
      LEFT JOIN 
        USERS AS instructor ON SESSIONS.instructor_email = instructor.email
      LEFT JOIN 
        USERS AS learner ON SESSIONS.learner_email = learner.email
      WHERE 
        SESSIONS.learner_email = ? 
        OR SESSIONS.instructor_email = ?
      `,
      [userEmail, userEmail]
    );
  }

  static cancelSession(id) {
    return db.execute(`UPDATE SESSIONS SET status = ? WHERE SESSIONS.id = ?`, [
      "CANCELLED",
      id,
    ]);
  }

  static updateSession(id, { sessionStartTime, sessionEndTime, sessionDate }) {
    return db.execute(
      `UPDATE SESSIONS SET session_start_time = ?, session_end_time = ?, session_date = ? WHERE SESSIONS.id = ?`,
      [sessionStartTime, sessionEndTime, sessionDate, id]
    );
  }
}
