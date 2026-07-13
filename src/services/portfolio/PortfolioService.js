import { PortfolioRepository } from './PortfolioRepository';
import { PortfolioHistoryRepository } from './PortfolioHistoryRepository';
import { PortfolioHistoryService } from './PortfolioHistoryService';
import { PortfolioThemeEngine } from './PortfolioThemeEngine';
import { PortfolioRenderer } from './PortfolioRenderer';
import { PortfolioEngine } from './PortfolioEngine';
import { PortfolioShareService } from './PortfolioShareService';
import { DigitalResumeService } from './DigitalResumeService';
import { QRRepository } from './QRRepository';
import { QRCodeService } from './QRCodeService';
import { analyticsService } from '../analytics/AnalyticsService';
import { AnalyticsRepository } from '../analytics/AnalyticsRepository';
import { db } from '../../database/sqlite'; // Note: db will be injected or imported properly

export class PortfolioService {
  constructor(database) {
    this.db = database;

    // Repositories
    this.portfolioRepo = new PortfolioRepository(this.db);
    this.historyRepo = new PortfolioHistoryRepository(this.db);
    this.qrRepo = new QRRepository(this.db);

    // Services & Engines
    this.historyService = new PortfolioHistoryService(this.historyRepo);
    this.themeEngine = new PortfolioThemeEngine();
    this.renderer = new PortfolioRenderer(this.themeEngine);
    this.engine = new PortfolioEngine(this.portfolioRepo, this.historyService, this.renderer);
    this.shareService = new PortfolioShareService(this.engine, analyticsService);
    this.digitalResumeService = new DigitalResumeService(this.engine, analyticsService);
    this.qrCodeService = new QRCodeService(this.qrRepo, analyticsService);
    this.analyticsRepo = new AnalyticsRepository(this.db);
  }

  async getPortfolios(profileId) {
    return await this.portfolioRepo.getByProfileId(profileId);
  }

  async getPortfolioById(id) {
    return await this.portfolioRepo.getById(id);
  }

  async createPortfolio(profileId, resumeId, initialSettings) {
    return await this.engine.createNewPortfolio(profileId, resumeId, initialSettings);
  }

  async updatePortfolioSettings(portfolioId, updates) {
    return await this.portfolioRepo.updateSettings(portfolioId, updates);
  }

  async updatePortfolio(portfolioId, updates) {
    return await this.portfolioRepo.updatePortfolio(portfolioId, updates);
  }

  async previewPortfolio(portfolioId, resumeData) {
    if (analyticsService) {
      await analyticsService.track('PORTFOLIO_PREVIEW', { portfolioId });
    }
    return await this.engine.generatePreviewHTML(portfolioId, resumeData);
  }

  async publishPortfolio(portfolioId, resumeData) {
    const result = await this.engine.publishPortfolio(portfolioId, resumeData);
    if (analyticsService) {
      await analyticsService.track('PORTFOLIO_PUBLISHED', { portfolioId });
    }
    return result;
  }

  async exportAndShareHTML(portfolioId, resumeData) {
    return await this.shareService.exportHTML(portfolioId, resumeData);
  }

  async generateQRCode(targetUrl, targetType, portfolioId) {
    return await this.qrCodeService.generateQRCode(targetUrl, targetType, portfolioId);
  }

  async getQRCodes(portfolioId) {
    return await this.qrCodeService.getQRCodesForPortfolio(portfolioId);
  }

  async getPortfolioHistory(portfolioId) {
    return await this.historyService.getHistory(portfolioId);
  }

  async getAnalyticsEvents() {
    return await this.analyticsRepo.getEventCounts();
  }
}

// Initialize via singleton provider rather than statically requiring SQLiteService DB
import SQLiteService from '../../database/sqlite';

let instance = null;

export const portfolioService = new Proxy({}, {
  get(target, prop) {
    if (!instance) {
      if (!SQLiteService.db) {
        throw new Error('SQLiteService.db is not initialized yet. PortfolioService cannot be used.');
      }
      instance = new PortfolioService(SQLiteService.db);
    }
    return instance[prop];
  }
});
