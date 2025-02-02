import db from "../util/database.js";

export default class Turn {
  constructor(
    routeId,
    latitude,
    longitude,
  ) {
    this.routeId = routeId;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  save() {
    return db.execute(
      `INSERT INTO TURNS (routeId, latitude, longitude) VALUES (?, ?, ?)`,
      [
        this.routeId,
        this.latitude,
        this.longitude
      ]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM TURNS`);
  }

  static fetchByRouteId(routeId) {
    return db.execute(
      `SELECT * FROM TURNS WHERE TURNS.route_id = ?`,
      [routeId]
    );
  }
}
