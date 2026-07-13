import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Logger from '../../utils/logger';

export class PortfolioShareService {
  constructor(portfolioEngine, analyticsService) {
    this.portfolioEngine = portfolioEngine;
    this.analyticsService = analyticsService;
  }

  async exportHTML(portfolioId, resumeData) {
    try {
      const html = await this.portfolioEngine.generatePreviewHTML(portfolioId, resumeData);

      const fileUri = `${FileSystem.cacheDirectory}portfolio_${portfolioId}.html`;
      await FileSystem.writeAsStringAsync(fileUri, html, { encoding: FileSystem.EncodingType.UTF8 });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/html',
          dialogTitle: 'Share Digital Portfolio'
        });

        if (this.analyticsService) {
          await this.analyticsService.track('PORTFOLIO_SHARED', { portfolioId, type: 'html' });
        }
      } else {
        Logger.warn('Sharing is not available on this platform.');
      }
    } catch (error) {
      Logger.error('Error exporting HTML:', error);
      throw error;
    }
  }
}
