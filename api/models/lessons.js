import db from "../util/database.js";

export default class Lessons {
  constructor(lessonName) {
    this.lessonName = lessonName;
  }

  static fetchLessons() {
    return db.execute("SELECT * FROM LESSONS");
  }

  static fetchLessonsByLearnerId({ learnerEmail, instructorEmail }) {
    return db.execute(
      `SELECT 
            LESSONS.ID AS lessonId,
            LESSONS.lesson_name,
            LESSON_FEEDBACK.feedback,
            LESSON_FEEDBACK.learner_email AS learnerEmail,
            LESSON_FEEDBACK.instructor_email AS instructorEmail,
            COALESCE(LESSON_FEEDBACK.status, 'not_booked') AS status
        FROM LESSONS
        LEFT JOIN LESSON_FEEDBACK ON LESSONS.ID = LESSON_FEEDBACK.LESSON_ID AND LESSON_FEEDBACK.learner_email = ? AND LESSON_FEEDBACK.instructor_email = ? ;`,
      [learnerEmail, instructorEmail]
    );
  }
}
