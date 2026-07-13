import AIService from '../ai/AIService';
import { AI_ACTION_TYPES } from '../../config/ai';
import Logger from '../../utils/logger';

class CareerRoadmapEngine {
  async generateRoadmap(context, sessionId) {
    try {
      const response = await AIService.processRequest({
        actionType: AI_ACTION_TYPES.GENERATE_CAREER_ROADMAP,
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
      Logger.error('CareerRoadmapEngine Error:', error);
      throw error;
    }
  }
}

export default new CareerRoadmapEngine();
