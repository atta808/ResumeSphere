import TemplateRenderer from './TemplateRenderer';
import TemplateSettingsRepository from '../../repositories/TemplateSettingsRepository';
import './registry/index';

class TemplateEngine {
  static async getCustomization(resumeId) {
    const settings = await TemplateSettingsRepository.findByResumeId(resumeId);
    return settings || {};
  }

  static async saveCustomization(resumeId, customizationData) {
    return await TemplateSettingsRepository.upsert(resumeId, customizationData);
  }

  static async render(resumeData, theme, customizationData, templateId) {
    return TemplateRenderer.generateHTML(resumeData, theme, customizationData, templateId);
  }
}

export default TemplateEngine;
