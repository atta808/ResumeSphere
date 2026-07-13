export class PortfolioRepository {
  constructor(db) {
    this.db = db;
  }

  async create(portfolio, settings) {
    await this.db.runAsync(
      `INSERT INTO portfolios (id, profileId, resumeId, templateId, name, portfolioId, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        portfolio.id,
        portfolio.profileId,
        portfolio.resumeId,
        portfolio.templateId,
        portfolio.name,
        portfolio.portfolioId, // The unique public URL ID
        portfolio.status,
        portfolio.createdAt,
        portfolio.updatedAt
      ]
    );

    await this.db.runAsync(
      `INSERT INTO portfolio_settings (id, portfolioId, theme, primaryColor, accentColor, typography, sectionOrder, hiddenSections, socialLinks, language, visibility, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        settings.id,
        settings.portfolioId,
        settings.theme,
        settings.primaryColor,
        settings.accentColor,
        settings.typography,
        settings.sectionOrder ? JSON.stringify(settings.sectionOrder) : null,
        settings.hiddenSections ? JSON.stringify(settings.hiddenSections) : null,
        settings.socialLinks ? JSON.stringify(settings.socialLinks) : null,
        settings.language,
        settings.visibility,
        settings.createdAt,
        settings.updatedAt
      ]
    );

    return { portfolio, settings };
  }

  async getById(id) {
    const portfolioRow = await this.db.getFirstAsync(
      `SELECT * FROM portfolios WHERE id = ? AND deletedAt IS NULL`,
      [id]
    );
    if (!portfolioRow) return null;

    const settingsRow = await this.db.getFirstAsync(
      `SELECT * FROM portfolio_settings WHERE portfolioId = ?`,
      [id]
    );

    return {
      portfolio: portfolioRow,
      settings: this._mapSettingsRow(settingsRow)
    };
  }

  async getByProfileId(profileId) {
    const rows = await this.db.getAllAsync(
      `SELECT * FROM portfolios WHERE profileId = ? AND deletedAt IS NULL ORDER BY createdAt DESC`,
      [profileId]
    );
    return rows;
  }

  async updateSettings(portfolioId, settingsUpdates) {
    const currentSettingsRow = await this.db.getFirstAsync(
      `SELECT * FROM portfolio_settings WHERE portfolioId = ?`,
      [portfolioId]
    );
    if (!currentSettingsRow) throw new Error('Settings not found');
    const currentSettings = this._mapSettingsRow(currentSettingsRow);
    const updated = { ...currentSettings, ...settingsUpdates, updatedAt: new Date().toISOString() };

    await this.db.runAsync(
      `UPDATE portfolio_settings SET
       theme = ?, primaryColor = ?, accentColor = ?, typography = ?, sectionOrder = ?, hiddenSections = ?, socialLinks = ?, language = ?, visibility = ?, updatedAt = ?
       WHERE portfolioId = ?`,
      [
        updated.theme,
        updated.primaryColor,
        updated.accentColor,
        updated.typography,
        updated.sectionOrder ? JSON.stringify(updated.sectionOrder) : null,
        updated.hiddenSections ? JSON.stringify(updated.hiddenSections) : null,
        updated.socialLinks ? JSON.stringify(updated.socialLinks) : null,
        updated.language,
        updated.visibility,
        updated.updatedAt,
        portfolioId
      ]
    );
    return updated;
  }

  async updatePortfolio(id, updates) {
    const current = await this.db.getFirstAsync(`SELECT * FROM portfolios WHERE id = ?`, [id]);
    if (!current) throw new Error('Portfolio not found');
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };

    await this.db.runAsync(
      `UPDATE portfolios SET
       name = ?, templateId = ?, status = ?, updatedAt = ?
       WHERE id = ?`,
      [
        updated.name,
        updated.templateId,
        updated.status,
        updated.updatedAt,
        id
      ]
    );
    return updated;
  }

  async delete(id) {
    const deletedAt = new Date().toISOString();
    await this.db.runAsync(`UPDATE portfolios SET deletedAt = ? WHERE id = ?`, [deletedAt, id]);
  }

  _mapSettingsRow(row) {
    if (!row) return null;
    return {
      ...row,
      sectionOrder: row.sectionOrder ? JSON.parse(row.sectionOrder) : null,
      hiddenSections: row.hiddenSections ? JSON.parse(row.hiddenSections) : null,
      socialLinks: row.socialLinks ? JSON.parse(row.socialLinks) : null,
    };
  }
}
