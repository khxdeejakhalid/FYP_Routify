import db from "../util/database.js";

export default class User {
  constructor(username, firstName, lastName, email, password, dateOfBirth) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.dateOfBirth = dateOfBirth;
  }

  save() {
    return db.execute(
      `INSERT INTO users (USERNAME, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, DATE_OF_BIRTH) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        this.username,
        this.firstName,
        this.lastName,
        this.email,
        this.password,
        this.dateOfBirth,
      ]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM users`);
  }

  static checkEmail(username) {
    return db.execute(`SELECT * FROM users WHERE users.email = ?`, [
      username,
    ]);
  }

  static login(email) {
    return db.execute(`SELECT users.username, users.email, users.password FROM users WHERE users.email = ?`, [email]);
  }

}
