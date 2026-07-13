import AIService from '../ai/AIService';
import { AI_ACTION_TYPES } from '../../config/ai';

class PromotionReadinessEngine {
  async evaluate(context, sessionId) {
    try {
      const response = await AIService.processRequest({
        actionType: AI_ACTION_TYPES.EVALUATE_PROMOTION_READINESS,
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
      console.error('PromotionReadinessEngine Error:', error);
      throw error;
    }
  }
}

export default new PromotionReadinessEngine();
