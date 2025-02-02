import db from "../util/database.js";

export default class User {
  constructor(username, fullName, email, password, dateOfPermit, dateOfBirth) {
    this.username = username;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.dateOfPermit = dateOfPermit;
    this.dateOfBirth = dateOfBirth;
  }

  save() {
    return db.execute(
      `INSERT INTO USERS (USERNAME, NAME, EMAIL, PASSWORD, DATE_OF_PERMIT, DATE_OF_BIRTH) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        this.username,
        this.fullName,
        this.email,
        this.password,
        this.dateOfPermit,
        this.dateOfBirth,
      ]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM USERS`);
  }

  static checkEmail(email) {
    return db.execute(`SELECT * FROM USERS WHERE USERS.email = ?`, [email]);
  }

  static login(email) {
    return db.execute(
      `SELECT USERS.username, USERS.email, USERS.password FROM USERS WHERE USERS.email = ?`,
      [email]
    );
  }

  static fetchUser(email) {
    return db.execute(
      `SELECT USERS.username, USERS.name, USERS.email, USERS.password, USERS.date_of_permit, USERS.date_of_birth FROM USERS where USERS.email = ?`,
      [email]
    );
  }

  static async updateUser(email, updatedData) {
    const { name, password } = updatedData;
    return db.execute(
      `UPDATE USERS SET name = ?, password = ? WHERE USERS.email = ?`,
      [name, password, email]
    );
  }
}
