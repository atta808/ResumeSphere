import * as Crypto from 'expo-crypto';
import SQLiteService from '../../database/sqlite';

class CareerHistoryRepository {
  async getDb() {
    return SQLiteService.db;
  }

  async logAction(goalId, action, description, provider = null, model = null) {
    const db = await this.getDb();
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO career_history (id, goalId, action, description, provider, model, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, goalId, action, description, provider, model, now]
    );
  }

  async getHistory(goalId) {
    const db = await this.getDb();
    return db.getAllAsync('SELECT * FROM career_history WHERE goalId = ? ORDER BY createdAt DESC', [goalId]);
  }
}

export default new CareerHistoryRepository();
