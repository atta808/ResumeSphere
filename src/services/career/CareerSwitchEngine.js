import AIService from '../ai/AIService';
import { AI_ACTION_TYPES } from '../../config/ai';

class CareerSwitchEngine {
  async planSwitch(context, sessionId) {
    try {
      const response = await AIService.processRequest({
        actionType: AI_ACTION_TYPES.PLAN_CAREER_SWITCH,
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
      console.error('CareerSwitchEngine Error:', error);
      throw error;
    }
  }
}

export default new CareerSwitchEngine();
