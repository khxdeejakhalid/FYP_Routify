import db from "../util/database.js";

export default class User {
  constructor(
    username,
    fullName,
    email,
    password,
    dateOfPermit,
    dateOfBirth,
    role
  ) {
    this.username = username;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.dateOfPermit = dateOfPermit;
    this.dateOfBirth = dateOfBirth;
    this.role = role;
  }

  async save() {
    try {
      await db.execute(
        `INSERT INTO USERS (USERNAME, NAME, EMAIL, PASSWORD, DATE_OF_PERMIT, DATE_OF_BIRTH, ROLE) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          this.username,
          this.fullName,
          this.email,
          this.password,
          this.dateOfPermit,
          this.dateOfBirth,
          this.role,
        ]
      );

      const [rows] = await db.execute(
        `SELECT USERS.username, USERS.email, USERS.role FROM USERS WHERE EMAIL = ?`,
        [this.email]
      );
      return rows[0];
    } catch (error) {
      throw new Error(error.message || "Failed to save the user.");
    }
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM USERS`);
  }

  static checkEmail(email) {
    return db.execute(`SELECT * FROM USERS WHERE USERS.email = ?`, [email]);
  }

  static login(email) {
    return db.execute(
      `SELECT USERS.username, USERS.email, USERS.password, USERS.role FROM USERS WHERE USERS.email = ?`,
      [email]
    );
  }

  static fetchUser(email) {
    return db.execute(
      `SELECT USERS.username, USERS.role, USERS.name, USERS.email, USERS.password, USERS.date_of_permit, USERS.date_of_birth FROM USERS where USERS.email = ?`,
      [email]
    );
  }

  static findUserByRole(role) {
    return db.execute(
      `SELECT USERS.name, USERS.email, USERS.username FROM USERS WHERE USERS.role = ?`,
      [role]
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
