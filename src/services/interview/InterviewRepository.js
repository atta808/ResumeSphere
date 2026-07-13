import dbManager from '../../database/sqlite';

class InterviewRepository {
  async insertSession(session) {
    const db = dbManager.getDb();
    await db.runAsync(
      `INSERT INTO interview_sessions (
        id, resumeId, profileId, jobDescriptionId, interviewType, difficulty, companyName, position, status, startedAt, duration, overallScore, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.id,
        session.resumeId,
        session.profileId,
        session.jobDescriptionId,
        session.interviewType,
        session.difficulty,
        session.companyName,
        session.position,
        session.status,
        session.startedAt,
        session.duration,
        session.overallScore,
        session.createdAt,
        session.updatedAt
      ]
    );
  }

  async getSessionById(id) {
    const db = dbManager.getDb();
    return db.getFirstAsync(`SELECT * FROM interview_sessions WHERE id = ?`, [id]);
  }

  async insertQuestion(question) {
    const db = dbManager.getDb();
    await db.runAsync(
      `INSERT INTO interview_questions (
        id, sessionId, questionNumber, question, questionType, difficulty, category, expectedSkills, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        question.id,
        question.sessionId,
        question.questionNumber,
        question.question,
        question.questionType,
        question.difficulty,
        question.category,
        JSON.stringify(question.expectedSkills),
        question.createdAt
      ]
    );
  }

  async getQuestionsBySessionId(sessionId) {
    const db = dbManager.getDb();
    const rows = await db.getAllAsync(`SELECT * FROM interview_questions WHERE sessionId = ? ORDER BY questionNumber ASC`, [sessionId]);
    return rows.map(r => ({ ...r, expectedSkills: r.expectedSkills ? JSON.parse(r.expectedSkills) : [] }));
  }

  async getQuestionById(id) {
    const db = dbManager.getDb();
    const row = await db.getFirstAsync(`SELECT * FROM interview_questions WHERE id = ?`, [id]);
    if (row) row.expectedSkills = row.expectedSkills ? JSON.parse(row.expectedSkills) : [];
    return row;
  }

  async insertAnswer(answer) {
    const db = dbManager.getDb();
    await db.runAsync(
      `INSERT INTO interview_answers (
        id, questionId, sessionId, answer, feedback, score, strengths, weaknesses, recommendations, estimatedImprovement, timeSpent, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        answer.id,
        answer.questionId,
        answer.sessionId,
        answer.answer,
        JSON.stringify(answer.feedback),
        answer.score,
        JSON.stringify(answer.strengths),
        JSON.stringify(answer.weaknesses),
        JSON.stringify(answer.recommendations),
        answer.estimatedImprovement,
        answer.timeSpent,
        answer.createdAt
      ]
    );
  }

  async getAnswersBySessionId(sessionId) {
    const db = dbManager.getDb();
    const rows = await db.getAllAsync(`SELECT * FROM interview_answers WHERE sessionId = ?`, [sessionId]);
    return rows.map(r => ({
      ...r,
      feedback: r.feedback ? JSON.parse(r.feedback) : {},
      strengths: r.strengths ? JSON.parse(r.strengths) : [],
      weaknesses: r.weaknesses ? JSON.parse(r.weaknesses) : [],
      recommendations: r.recommendations ? JSON.parse(r.recommendations) : [],
    }));
  }

  async getAllSessions() {
    const db = dbManager.getDb();
    return db.getAllAsync(`SELECT * FROM interview_sessions ORDER BY createdAt DESC`);
  }
}

export default new InterviewRepository();
