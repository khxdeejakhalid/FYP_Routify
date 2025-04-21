import db from "../util/database.js";

export default class LessonsFeedback {
  constructor(lessonId, feedback, instructorEmail, learnerEmail, status) {
    this.lessonId = lessonId;
    this.feedback = feedback;
    this.instructorEmail = instructorEmail;
    this.learnerEmail = learnerEmail;
    this.status = status;
  }

  static updateLessonFeedback(lessonId, feedback) {
    return db.execute(
      'UPDATE LESSON_FEEDBACK SET status = "completed", feedback = ? WHERE lesson_id = ?',
      [feedback, lessonId]
    );
  }

  static addLessonFeedback({
    lessonId,
    feedback,
    instructorEmail,
    learnerEmail,
    status,
  }) {
    return db.execute(
      `INSERT INTO LESSON_FEEDBACK (lesson_id, feedback, instructor_email, learner_email, status) VALUES (?, ?, ?, ?, ?)`,
      [lessonId, feedback, instructorEmail, learnerEmail, status]
    );
  }
}
