import * as Crypto from 'expo-crypto';

export class QRCodeService {
  constructor(qrRepository, analyticsService) {
    this.qrRepository = qrRepository;
    this.analyticsService = analyticsService;
  }

  /**
   * Generates a new QR code model and saves it.
   */
  async generateQRCode(targetUrl, targetType, portfolioId = null, styleConfig = null) {
    const qrCode = {
      id: Crypto.randomUUID(),
      targetUrl,
      targetType,
      portfolioId,
      styleConfig,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };

    const saved = await this.qrRepository.create(qrCode);

    // Track QR code generation
    if (this.analyticsService) {
      await this.analyticsService.track('QR_GENERATED', {
        qrCodeId: saved.id,
        targetType,
        portfolioId
      });
    }

    return saved;
  }

  async getQRCodesForPortfolio(portfolioId) {
    return await this.qrRepository.getByPortfolioId(portfolioId);
  }

  async deleteQRCode(id) {
    await this.qrRepository.delete(id);
  }
}
