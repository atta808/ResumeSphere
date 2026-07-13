import ProviderRegistry from './ProviderRegistry';
import DeepSeekProvider from './DeepSeekProvider';
import PromptBuilder from './PromptBuilder';
import ResponseParser from './ResponseParser';
import AIHistoryService from './AIHistoryService';
import ProfileService from '../profile/ProfileService';
import ResumeService from '../resume/ResumeService';
import { AI_PROVIDERS, AI_ACTION_TYPES } from '../../config/ai';

class AIService {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize the AI service and its default provider
   */
  async initialize() {
    if (this.isInitialized) return;

    // Register default provider
    const deepSeek = new DeepSeekProvider();
    await deepSeek.initialize();

    ProviderRegistry.registerProvider(AI_PROVIDERS.DEEPSEEK, deepSeek);
    ProviderRegistry.setActiveProvider(AI_PROVIDERS.DEEPSEEK);

    this.isInitialized = true;
  }

  /**
   * Generates a context object by pulling data directly from ProfileService and ResumeService
   * so the UI doesn't have to manually build large dependency trees.
   */
  async buildContext(profileId, resumeId = null) {
    if (!profileId) throw new Error('Profile ID is required to build AI context.');

    const [fullProfile, resume] = await Promise.all([
      ProfileService.getFullProfile(profileId),
      resumeId ? ResumeService.getResumeById(resumeId) : null
    ]);

    if (!fullProfile) throw new Error('Full Profile not found.');

    return {
      profile: {
        id: fullProfile.id,
        firstName: fullProfile.firstName,
        lastName: fullProfile.lastName,
        email: fullProfile.email,
        phone: fullProfile.phone,
      },
      resume,
      resumeData: resume, // Alias for certain prompts
      experience: fullProfile.experience || [],
      skills: fullProfile.skills || [],
      education: fullProfile.education || [],
      // Optional job description context added ad-hoc
      jobDescription: null,
      // By isolating these, the PromptBuilder can selectively include what it needs
      // avoiding sending massive unrelated context to DeepSeek (e.g., certificates when not needed).
    };
  }

  /**
   * Central orchestrator for making requests to the AI
   *
   * @param {Object} params
   * @param {string} params.actionType - Type of action (e.g. IMPROVE_RESUME)
   * @param {string} params.profileId - The user's master profile ID
   * @param {string} params.resumeId - The targeted resume ID (optional)
   * @param {string} params.sessionId - The current conversation session ID
   * @param {string} params.userMessage - (Optional) Additional user request
   * @param {AbortSignal} params.abortSignal - (Optional) Signal to cancel request
   * @returns {Object} Normalized response and AI metadata
   */
  async processRequest({ actionType, profileId, resumeId, sessionId, userMessage = null, abortSignal = null, jobDescriptionContext = null }) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!sessionId) {
      throw new Error('A valid Session ID is required to process AI requests.');
    }

    // Auto-fetch context from service layer instead of relying on the UI
    const context = await this.buildContext(profileId, resumeId);

    if (jobDescriptionContext) {
      // In cases like INTERVIEW_COACH, jobDescriptionContext might hold the entire interview context
      if (actionType === AI_ACTION_TYPES.GENERATE_INTERVIEW_QUESTIONS || actionType === AI_ACTION_TYPES.ANALYZE_INTERVIEW_ANSWER) {
         Object.assign(context, jobDescriptionContext);
      } else {
        context.jobDescription = jobDescriptionContext;
      }
    }

    // 1. Log the user's prompt in history
    // We only log the userMessage as the 'user' role so the chat UI stays clean.
    // The system prompt is kept behind the scenes.
    if (userMessage) {
      await AIHistoryService.addMessage(sessionId, 'user', userMessage, { actionType });
    } else {
      // If no explicit user message, log a system-generated action event
      await AIHistoryService.addMessage(sessionId, 'user', \`Action Requested: \${actionType}\`, { actionType });
    }

    // 2. Build Prompt (Gather context and assemble instructions)
    const systemPrompt = PromptBuilder.buildPrompt(actionType, context);

    // 3. Get Active Provider
    const provider = ProviderRegistry.getActiveProvider();

    // 4. Call Provider
    const aiResponse = await provider.generateCompletion(
       userMessage || \`Execute \${actionType}\`,
       systemPrompt,
       abortSignal
    );

    // 5. Parse Response
    const parsedResponse = ResponseParser.parse(aiResponse.content, actionType);

    // 6. Log Assistant Response in History
    const savedMessage = await AIHistoryService.addMessage(sessionId, 'assistant', parsedResponse.text, {
      actionType,
      provider: aiResponse.provider,
      model: aiResponse.model,
      tokensUsed: aiResponse.usage.totalTokens,
    });

    return {
      messageId: savedMessage.id,
      text: parsedResponse.text,
      usage: aiResponse.usage,
      provider: aiResponse.provider,
      model: aiResponse.model,
    };
  }

  // --- Convenience Methods for specific actions ---

  async generateSummary(context, sessionId, abortSignal = null) {
    return this.processRequest({
      actionType: AI_ACTION_TYPES.GENERATE_SUMMARY,
      context,
      sessionId,
      abortSignal,
    });
  }

  async improveResume(context, sessionId, abortSignal = null) {
    return this.processRequest({
      actionType: AI_ACTION_TYPES.IMPROVE_RESUME,
      context,
      sessionId,
      abortSignal,
    });
  }

  async rewriteExperience(context, sessionId, abortSignal = null) {
     return this.processRequest({
      actionType: AI_ACTION_TYPES.REWRITE_EXPERIENCE,
      context,
      sessionId,
      abortSignal,
    });
  }

  async suggestSkills(context, sessionId, abortSignal = null) {
    return this.processRequest({
      actionType: AI_ACTION_TYPES.SUGGEST_SKILLS,
      context,
      sessionId,
      abortSignal,
    });
  }

  async generateCoverLetter(context, sessionId, abortSignal = null) {
    return this.processRequest({
      actionType: AI_ACTION_TYPES.GENERATE_COVER_LETTER,
      context,
      sessionId,
      abortSignal,
    });
  }

  async prepareInterview(context, sessionId, abortSignal = null) {
    return this.processRequest({
      actionType: AI_ACTION_TYPES.PREPARE_INTERVIEW,
      context,
      sessionId,
      abortSignal,
    });
  }

  async generateCareerAdvice(context, sessionId, abortSignal = null) {
    return this.processRequest({
      actionType: AI_ACTION_TYPES.CAREER_ADVICE,
      context,
      sessionId,
      abortSignal,
    });
  }

  async tailorResumeSummary(profileId, resumeId, jobDescriptionContext, sessionId, abortSignal = null) {
    return this.processRequest({
      actionType: AI_ACTION_TYPES.TAILOR_SUMMARY,
      profileId,
      resumeId,
      jobDescriptionContext,
      sessionId,
      abortSignal,
    });
  }

  async tailorResumeExperience(profileId, resumeId, jobDescriptionContext, sessionId, abortSignal = null) {
    return this.processRequest({
      actionType: AI_ACTION_TYPES.TAILOR_EXPERIENCE,
      profileId,
      resumeId,
      jobDescriptionContext,
      sessionId,
      abortSignal,
    });
  }

  async tailorResumeSkills(profileId, resumeId, jobDescriptionContext, sessionId, abortSignal = null) {
    return this.processRequest({
      actionType: AI_ACTION_TYPES.TAILOR_SKILLS,
      profileId,
      resumeId,
      jobDescriptionContext,
      sessionId,
      abortSignal,
    });
  }
}

export default new AIService();
