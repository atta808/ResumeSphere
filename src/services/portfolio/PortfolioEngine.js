import * as Crypto from 'expo-crypto';

export class PortfolioEngine {
  constructor(portfolioRepo, historyService, renderer) {
    this.portfolioRepo = portfolioRepo;
    this.historyService = historyService;
    this.renderer = renderer;
  }

  async createNewPortfolio(profileId, resumeId, initialSettings = {}) {
    const defaultSettings = {
      theme: 'light',
      primaryColor: '#007AFF',
      accentColor: '#5AC8FA',
      typography: 'sans',
      sectionOrder: ['about', 'experience', 'education', 'skills', 'projects'],
      hiddenSections: [],
      visibility: 'private'
    };

    const mergedSettings = { ...defaultSettings, ...initialSettings };

    const portfolioId = Crypto.randomUUID();
    const publicUrlId = `portfolio_${Crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

    const portfolio = {
      id: portfolioId,
      profileId,
      resumeId,
      templateId: 'classic',
      name: 'My Digital Portfolio',
      portfolioId: publicUrlId,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };

    const settings = {
      id: Crypto.randomUUID(),
      portfolioId,
      ...mergedSettings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await this.portfolioRepo.create(portfolio, settings);
    return created;
  }

  async generatePreviewHTML(portfolioId, resumeData) {
    const data = await this.portfolioRepo.getById(portfolioId);
    if (!data) throw new Error('Portfolio not found');

    const html = this.renderer.generateHTML(resumeData, data.settings, data.portfolio.templateId);
    return html;
  }

  async publishPortfolio(portfolioId, resumeData) {
    // Phase 14: Just prepares the architecture and saves a history snapshot.
    // Cloud upload is Phase 15.
    const data = await this.portfolioRepo.getById(portfolioId);
    if (!data) throw new Error('Portfolio not found');

    await this.portfolioRepo.updatePortfolio(portfolioId, { status: 'published' });
    await this.historyService.saveSnapshot(portfolioId, data.portfolio, data.settings);

    return {
      status: 'published',
      url: `https://portfolio.resumesphere.app/p/${data.portfolio.portfolioId}` // Placeholder URL
    };
  }
}
