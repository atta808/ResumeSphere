import dbManager from '../../database/sqlite';

class ImportHistoryRepository {
  static async saveSession(session) {
    const db = dbManager.getDb();
    const query = `
      INSERT INTO import_sessions (id, fileName, fileType, provider, ocrText, parsedProfile, confidenceScore, processingTime, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.runAsync(query, [
      session.id,
      session.fileName,
      session.fileType,
      session.provider,
      session.ocrText,
      JSON.stringify(session.parsedProfile),
      session.confidenceScore,
      session.processingTime,
      session.createdAt
    ]);
  }

  static async queueOcr(task) {
    const db = dbManager.getDb();
    const query = `
      INSERT INTO ocr_queue (id, filePath, fileType, status, provider, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.runAsync(query, [
      task.id,
      task.filePath,
      task.fileType,
      task.status,
      task.provider,
      task.createdAt,
      task.updatedAt
    ]);
  }
}

export default ImportHistoryRepository;
