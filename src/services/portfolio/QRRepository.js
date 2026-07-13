export class QRRepository {
  constructor(db) {
    this.db = db;
  }

  async create(qrCode) {
    await this.db.runAsync(
      `INSERT INTO qr_codes (id, targetUrl, targetType, portfolioId, styleConfig, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        qrCode.id,
        qrCode.targetUrl,
        qrCode.targetType,
        qrCode.portfolioId,
        qrCode.styleConfig ? JSON.stringify(qrCode.styleConfig) : null,
        qrCode.createdAt,
        qrCode.updatedAt
      ]
    );
    return qrCode;
  }

  async getById(id) {
    const row = await this.db.getFirstAsync(
      `SELECT * FROM qr_codes WHERE id = ? AND deletedAt IS NULL`,
      [id]
    );
    if (!row) return null;
    return this._mapRowToModel(row);
  }

  async getByPortfolioId(portfolioId) {
    const rows = await this.db.getAllAsync(
      `SELECT * FROM qr_codes WHERE portfolioId = ? AND deletedAt IS NULL ORDER BY createdAt DESC`,
      [portfolioId]
    );
    return rows.map(row => this._mapRowToModel(row));
  }

  async update(id, updates) {
    const qrCode = await this.getById(id);
    if (!qrCode) throw new Error('QR Code not found');

    const updated = { ...qrCode, ...updates, updatedAt: new Date().toISOString() };
    await this.db.runAsync(
      `UPDATE qr_codes SET
       targetUrl = ?, targetType = ?, styleConfig = ?, updatedAt = ?
       WHERE id = ?`,
      [
        updated.targetUrl,
        updated.targetType,
        updated.styleConfig ? JSON.stringify(updated.styleConfig) : null,
        updated.updatedAt,
        id
      ]
    );
    return updated;
  }

  async delete(id) {
    const deletedAt = new Date().toISOString();
    await this.db.runAsync(
      `UPDATE qr_codes SET deletedAt = ? WHERE id = ?`,
      [deletedAt, id]
    );
  }

  _mapRowToModel(row) {
    return {
      ...row,
      styleConfig: row.styleConfig ? JSON.parse(row.styleConfig) : null
    };
  }
}
