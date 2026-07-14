import * as Crypto from 'expo-crypto';
import SQLiteService from '../../database/sqlite';

class CareerRepository {
  async getDb() {
    return SQLiteService.db;
  }

  // --- Goals ---
  async createGoal(profileId, goalData) {
    const db = await this.getDb();
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO career_goals (
        id, profileId, title, goalType, targetRole, targetIndustry, targetCompany, priority, status, targetDate, notes, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      profileId,
      goalData.title,
      goalData.goalType,
      goalData.targetRole || null,
      goalData.targetIndustry || null,
      goalData.targetCompany || null,
      goalData.priority || 'Medium',
      goalData.status || 'ACTIVE',
      goalData.targetDate || null,
      goalData.notes || null,
      now,
      now
    ];

    await db.runAsync(query, params);
    return this.getGoalById(id);
  }

  async getGoalById(id) {
    const db = await this.getDb();
    return db.getFirstAsync('SELECT * FROM career_goals WHERE id = ?', [id]);
  }

  async getGoalsByProfileId(profileId) {
    const db = await this.getDb();
    return db.getAllAsync('SELECT * FROM career_goals WHERE profileId = ? ORDER BY createdAt DESC', [profileId]);
  }

  async updateGoal(id, updates) {
    const db = await this.getDb();
    const now = new Date().toISOString();
    const fields = Object.keys(updates);
    if (fields.length === 0) return;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = [...Object.values(updates), now, id];

    await db.runAsync(`UPDATE career_goals SET ${setClause}, updatedAt = ? WHERE id = ?`, params);
    return this.getGoalById(id);
  }

  async deleteGoal(id) {
    const db = await this.getDb();
    await db.runAsync('DELETE FROM career_goals WHERE id = ?', [id]);
  }

  // --- Recommendations ---
  async createRecommendations(goalId, recommendations) {
    const db = await this.getDb();
    const now = new Date().toISOString();

    // Clear old recommendations for this goal and category
    if (recommendations.length > 0) {
      await db.runAsync('DELETE FROM career_recommendations WHERE goalId = ? AND category = ?', [goalId, recommendations[0].category]);
    }

    for (const rec of recommendations) {
      const id = Crypto.randomUUID();
      await db.runAsync(
        `INSERT INTO career_recommendations (id, goalId, category, title, description, priority, estimatedImpact, status, provider, model, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, goalId, rec.category, rec.title, rec.description || null, rec.priority || 'Medium', rec.estimatedImpact || null, rec.status || 'PENDING', rec.provider || null, rec.model || null, now, now]
      );
    }
  }

  async getRecommendations(goalId, category) {
    const db = await this.getDb();
    if (category) {
        return db.getAllAsync('SELECT * FROM career_recommendations WHERE goalId = ? AND category = ? ORDER BY createdAt DESC', [goalId, category]);
    }
    return db.getAllAsync('SELECT * FROM career_recommendations WHERE goalId = ? ORDER BY createdAt DESC', [goalId]);
  }

  // --- Learning Progress ---
  async createLearningPlan(goalId, plan) {
    const db = await this.getDb();
    const now = new Date().toISOString();

    for (const item of plan) {
      const id = Crypto.randomUUID();
      await db.runAsync(
        `INSERT INTO learning_progress (id, goalId, skillName, resourceName, resourceType, estimatedHours, completedHours, completionPercentage, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, goalId, item.skillName, item.resourceName || null, item.resourceType || null, item.estimatedHours || 0, 0, 0, 'NOT_STARTED', now, now]
      );
    }
  }

  async getLearningPlan(goalId) {
    const db = await this.getDb();
    return db.getAllAsync('SELECT * FROM learning_progress WHERE goalId = ? ORDER BY createdAt DESC', [goalId]);
  }

  async updateLearningProgress(id, updates) {
    const db = await this.getDb();
    const now = new Date().toISOString();
    const fields = Object.keys(updates);
    if (fields.length === 0) return;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = [...Object.values(updates), now, id];

    await db.runAsync(`UPDATE learning_progress SET ${setClause}, updatedAt = ? WHERE id = ?`, params);
  }
}

export default new CareerRepository();
