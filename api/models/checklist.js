import db from "../util/database.js";

export default class Checklist {
  constructor(checklistName, checklistStatus, userEmail) {
    this.checklistName = checklistName;
    this.checklistStatus = checklistStatus;
    this.userEmail = userEmail;
  }

  // Save a new checklist item
  save() {
    return db.execute(
      `INSERT INTO CHECKLIST (CHECKLIST_NAME, CHECKLIST_STATUS, USER_EMAIL) VALUES (?, ?, ?)`,
      [this.checklistName, this.checklistStatus, this.userEmail]
    );
  }

  // Bulk-insert checklist items for a user
  static insertMany(checklistItems) {
    const placeholders = checklistItems.map(() => "(?, ?, ?)").join(", ");

    const values = checklistItems.flatMap((item) => [
      item.checklistName,
      item.checklistStatus,
      item.userEmail,
    ]);

    return db.execute(
      `INSERT INTO CHECKLIST (CHECKLIST_NAME, CHECKLIST_STATUS, USER_EMAIL) VALUES ${placeholders}`,
      values
    );
  }

  // Fetch all checklist items for a specific user
  static fetchAll(userEmail) {
    return db.execute(
      `SELECT id, checklist_name, checklist_status AS status
       FROM CHECKLIST
       WHERE USER_EMAIL = ?`,
      [userEmail]
    );
  }

  // Update the status of a checklist item
  static updateStatus(checklistId, newStatus, userEmail) {
    return db.execute(
      `UPDATE CHECKLIST
       SET CHECKLIST_STATUS = ?
       WHERE ID = ? AND USER_EMAIL = ?`,
      [newStatus, checklistId, userEmail]
    );
  }
}
