import db from "../util/database.js";

export default class Quiz {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  save() {
    return db.execute(`INSERT INTO QUIZZES (title, description) VALUES (?, ?)`, [
      this.title,
      this.description,
    ]);
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM QUIZZES`);
  }

  static fetchById(id) {
    return db.execute(`SELECT * FROM QUIZZES WHERE QUIZZES.id = ?`, [id]);
  }
}
