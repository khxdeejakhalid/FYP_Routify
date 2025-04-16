import db from "../util/database.js";

export default class Options {
  constructor(quiz_id, question_id, option_text, is_correct) {
    this.quiz_id = quiz_id;
    this.question_id = question_id;
    this.option_text = option_text;
    this.is_correct = is_correct;
  }

  save() {
    return db.execute(
      `INSERT INTO OPTIONS (quiz_id, question_id, option_text, is_correct) VALUES (?, ?, ?, ?)`,
      [this.quiz_id, this.question_id, this.option_text, this.is_correct]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM OPTIONS`);
  }

  static fetchByQuizIdAndQuestionId(quizId, questionId) {
    return db.execute(
      `SELECT * FROM OPTIONS WHERE OPTIONS.quiz_id = ? AND OPTIONS.question_id = ?`,
      [quizId, questionId]
    );
  }
}
