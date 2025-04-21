import db from "../util/database.js";

export default class InstructorLearner {
  constructor({ instructorEmail, learnerEmail }) {
    this.instructorEmail = instructorEmail;
    this.learnerEmail = learnerEmail;
  }

  save() {
    return db.execute(
      `INSERT INTO INSTRUCTOR_LEARNER (INSTRUCTOR_EMAIL, LEARNER_EMAIL) VALUES (?, ?)`,
      [this.instructorEmail, this.learnerEmail]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM INSTRUCTOR_LEARNER`);
  }

  static fetchAssignedLearners(instructorEmail) {
    return db.execute(
      `
        SELECT 
          USERS.name,
          USERS.email ,
          USERS.date_of_birth, 
          INSTRUCTOR_LEARNER.LEARNER_EMAIL AS learnerEmail
        FROM 
          INSTRUCTOR_LEARNER
        JOIN 
          USERS 
        ON 
          INSTRUCTOR_LEARNER.LEARNER_EMAIL = USERS.EMAIL
        WHERE 
          INSTRUCTOR_LEARNER.INSTRUCTOR_EMAIL = ?;
        `,
      [instructorEmail]
    );
  }

  static fetchAssignedInstructor(learnerEmail) {
    return db.execute(
      `
        SELECT
          USERS.name ,
          USERS.email ,
          USERS.date_of_birth, 
          INSTRUCTOR_LEARNER.INSTRUCTOR_EMAIL AS instructorEmail
        FROM
          INSTRUCTOR_LEARNER
        JOIN 
          USERS 
        ON 
          INSTRUCTOR_LEARNER.LEARNER_EMAIL = USERS.EMAIL
        WHERE 
          INSTRUCTOR_LEARNER.LEARNER_EMAIL = ?;
        `,
      [learnerEmail]
    );
  }
}
