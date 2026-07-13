export class DigitalResumeService {
  constructor(portfolioEngine, analyticsService) {
    this.portfolioEngine = portfolioEngine;
    this.analyticsService = analyticsService;
  }

  async getPublicResumeLink(portfolioId) {
    // Fetches the placeholder public URL from the portfolio settings/data
    const data = await this.portfolioEngine.portfolioRepo.getById(portfolioId);
    if (!data) throw new Error('Portfolio not found');

    const url = `https://portfolio.resumesphere.app/r/${data.portfolio.portfolioId}`;

    if (this.analyticsService) {
      await this.analyticsService.track('PUBLIC_RESUME_LINK_GENERATED', { portfolioId });
    }

    return url;
  }
}
