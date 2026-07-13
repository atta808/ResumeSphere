import AIService from '../ai/AIService';
import { AI_ACTION_TYPES } from '../../config/ai';
import Logger from '../../utils/logger';

class LearningRecommendationEngine {
  async generateLearningPlan(context, missingSkills, sessionId) {
    try {
      const augmentedContext = { ...context, missingSkills };
      const response = await AIService.processRequest({
        actionType: AI_ACTION_TYPES.GENERATE_LEARNING_PLAN,
        profileId: context.profile.id,
        sessionId,
        jobDescriptionContext: augmentedContext
      });
      try {
        return JSON.parse(response.text);
      } catch (e) {
        return { error: 'Failed to parse AI response as JSON.', rawText: response.text };
      }
    } catch (error) {
      Logger.error('LearningRecommendationEngine Error:', error);
      throw error;
    }
  }
}

export default new LearningRecommendationEngine();
