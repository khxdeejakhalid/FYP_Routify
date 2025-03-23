import db from "../util/database.js";

export default class Maneuver {
  constructor(
    routeId,
    latitude,
    longitude,
    type,
    cordType
  ) {
    this.routeId = routeId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.type = type;
    this.cordType = cordType;
  }

  save() {
    return db.execute(
      `INSERT INTO MANEUVER (routeId, latitude, longitude, type, cordType) VALUES (?, ?, ?)`,
      [
        this.routeId,
        this.latitude,
        this.longitude,
        this.type,
        this.cordType
      ]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM MANEUVER`);
  }

  static fetchByRouteId(routeId) {
    return db.execute(
      `SELECT * FROM MANEUVER WHERE MANEUVER.route_id = ?`,
      [routeId]
    );
  }
}
