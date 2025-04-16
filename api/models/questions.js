import db from "../util/database.js";

export default class Questions {
  constructor(quiz_id, question_text, image_path) {
    this.quiz_id = quiz_id;
    this.question_text = question_text;
    this.image_path = image_path;
  }

  save() {
    return db.execute(
      `INSERT INTO QUESTIONS (quiz_id, question_text, image_path) VALUES (?, ?, ?)`,
      [this.quiz_id, this.question_text, this.image_path]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM QUESTIONS`);
  }

  static fetchByQuizId(quizId) {
    return db.execute(`SELECT * FROM QUESTIONS WHERE QUESTIONS.quiz_id = ?`, [
      quizId,
    ]);
  }
}
