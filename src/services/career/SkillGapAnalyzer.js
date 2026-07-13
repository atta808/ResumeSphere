import AIService from '../ai/AIService';
import { AI_ACTION_TYPES } from '../../config/ai';
import Logger from '../../utils/logger';

class SkillGapAnalyzer {
  async analyze(context, sessionId) {
    try {
      const response = await AIService.processRequest({
        actionType: AI_ACTION_TYPES.ANALYZE_SKILL_GAP,
        profileId: context.profile.id,
        sessionId,
        jobDescriptionContext: context.goal // Passing goal as job context
      });
      // In a real implementation, we would parse JSON. Since AI might return raw text, we expect JSON.
      // Assuming ResponseParser might not parse complex JSON yet, we parse it here if needed, or rely on AI returning strict JSON.
      try {
        return JSON.parse(response.text);
      } catch (e) {
        return { error: 'Failed to parse AI response as JSON.', rawText: response.text };
      }
    } catch (error) {
      Logger.error('SkillGapAnalyzer Error:', error);
      throw error;
    }
  }
}

export default new SkillGapAnalyzer();
