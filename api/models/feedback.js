import db from "../util/database.js";

export default class Feedback {
  constructor(score, routeId, maneuverType, userEmail) {
    this.score = score;
    this.routeId = routeId;
    this.maneuverType = maneuverType;
    this.userEmail = userEmail;
  }
  save() {
    return db.execute(
      `INSERT INTO FEEDBACK (ROUTE_ID, MANUEVER_TYPE, SCORE, USER_EMAIL) VALUES (?, ?, ?, ?)`,
      [this.routeId, this.maneuverType, this.score, this.userEmail]
    );
  }

  static fetchManueverFeedback(userEmail) {
    return db.execute(
      `SELECT MANUEVER_TYPE, AVG(SCORE) AS AVG_SCORE
       FROM FEEDBACK
       WHERE USER_EMAIL = ?
       GROUP BY MANUEVER_TYPE`,
      [userEmail]
    );
  }
 
  static getCompletedRoutes(userEmail) {
    return db.execute(
      `SELECT ROUTE_ID
       FROM FEEDBACK
       WHERE USER_EMAIL = ?`,
      [userEmail]
    );
  }
}
