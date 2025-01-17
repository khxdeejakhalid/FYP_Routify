import db from "../util/database.js";

export default class TestCenter {
  constructor(name, city, country) {
    this.name = name;
    this.city = city;
    this.country = country;
  }

  save() {
    return db.execute(
      `INSERT INTO TEST_CENTERS (NAME, CITY, COUNTRY) VALUES (?, ?, ?)`,
      [this.name, this.city, this.country]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM TEST_CENTERS`);
  }

  static fetchByName(name) {
    return db.execute(`SELECT * FROM TEST_CENTERS WHERE TEST_CENTERS.name = ?`, [
        name,
    ]);
  }
}
