import ProviderRegistry from './ProviderRegistry';
import LocalSalaryProvider from './providers/LocalSalaryProvider';
import AIService from '../ai/AIService';
import { AI_ACTION_TYPES } from '../../config/ai';

class SalaryInsightEngine {
  constructor() {
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) return;
    const localProvider = new LocalSalaryProvider();
    ProviderRegistry.registerProvider('SALARY', 'LOCAL', localProvider);
    ProviderRegistry.setActiveProvider('SALARY', 'LOCAL');
    this.isInitialized = true;
  }

  async getInsights(context, sessionId) {
    this.initialize();

    // Attempt to use Provider if available (e.g. LocalSalaryProvider)
    try {
        const provider = ProviderRegistry.getActiveProvider('SALARY');
        if (provider) {
             return await provider.getSalaryInsights(context);
        }
    } catch (e) {
        console.warn("Salary Provider failed, falling back to AI", e);
    }

    // Fallback to AI
    try {
      const response = await AIService.processRequest({
        actionType: AI_ACTION_TYPES.GENERATE_SALARY_INSIGHTS,
        profileId: context.profile.id,
        sessionId,
        jobDescriptionContext: context.goal
      });
      try {
        return JSON.parse(response.text);
      } catch (e) {
        return { error: 'Failed to parse AI response as JSON.', rawText: response.text };
      }
    } catch (error) {
      console.error('SalaryInsightEngine Error:', error);
      throw error;
    }
  }
}

export default new SalaryInsightEngine();
