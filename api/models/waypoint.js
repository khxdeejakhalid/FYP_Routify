import db from "../util/database.js";

export default class Waypoint {
  constructor(
    routeId,
    latitude,
    longitude,
    next_latitude,
    next_longitude,
    instruction,
    distance,
    duration
  ) {
    this.routeId = routeId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.next_latitude = next_latitude;
    this.next_longitude = next_longitude;
    this.instruction = instruction;
    this.distance = distance;
    this.duration = duration;
  }

  save() {
    return db.execute(
      `INSERT INTO WAYPOINTS (routeId, latitude, longitude, next_latitude, next_longitude, instruction, distance, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.routeId,
        this.latitude,
        this.longitude,
        this.next_latitude,
        this.next_longitude,
        this.instruction,
        this.distance,
        this.duration,
      ]
    );
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM WAYPOINTS`);
  }

  static fetchByRouteId(routeId) {
    return db.execute(
      `SELECT * FROM WAYPOINTS WHERE WAYPOINTS.route_id = ?`,
      [routeId]
    );
  }
}
