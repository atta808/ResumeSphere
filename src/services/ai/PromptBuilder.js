import { ProfessionalSummaryPrompt } from './prompts/ProfessionalSummaryPrompt';
import { ResumeImprovementPrompt } from './prompts/ResumeImprovementPrompt';
import { ExperiencePrompt } from './prompts/ExperiencePrompt';
import { CoverLetterPrompt } from './prompts/CoverLetterPrompt';
import { InterviewPrompt } from './prompts/InterviewPrompt';
import { SkillsPrompt } from './prompts/SkillsPrompt';
import { CareerAdvicePrompt } from './prompts/CareerAdvicePrompt';
import { GenericChatPrompt } from './prompts/GenericChatPrompt';
import { TailoredSummaryPrompt } from './prompts/TailoredSummaryPrompt';
import { TailoredExperiencePrompt } from './prompts/TailoredExperiencePrompt';
import { TailoredSkillsPrompt } from './prompts/TailoredSkillsPrompt';
import { TailoredProjectsPrompt } from './prompts/TailoredProjectsPrompt';
import { TailoredCoverLetterPrompt } from './prompts/TailoredCoverLetterPrompt';
import { JobGapAnalysisPrompt } from './prompts/JobGapAnalysisPrompt';
import { ApplicationEmailPrompt } from './prompts/ApplicationEmailPrompt';
import { FollowUpPrompt } from './prompts/FollowUpPrompt';
import { SalaryNegotiationPrompt } from './prompts/SalaryNegotiationPrompt';
import { OfferAcceptancePrompt } from './prompts/OfferAcceptancePrompt';
import { ResignationPrompt } from './prompts/ResignationPrompt';
import { RecommendationPrompt } from './prompts/RecommendationPrompt';
import { NetworkingPrompt } from './prompts/NetworkingPrompt';
import { SOPPrompt } from './prompts/SOPPrompt';
import { AI_ACTION_TYPES } from '../../config/ai';

class PromptBuilder {
  /**
   * Builds a prompt string based on the requested action type and gathered context.
   * Only includes the necessary context to keep token usage minimal.
   */
  buildPrompt(actionType, context, userMessage = null) {
    let systemPrompt = '';

    switch (actionType) {
      case AI_ACTION_TYPES.GENERATE_SUMMARY:
        systemPrompt = ProfessionalSummaryPrompt(context);
        break;
      case AI_ACTION_TYPES.IMPROVE_RESUME:
        systemPrompt = ResumeImprovementPrompt(context);
        break;
      case AI_ACTION_TYPES.REWRITE_EXPERIENCE:
        systemPrompt = ExperiencePrompt(context);
        break;
      case AI_ACTION_TYPES.GENERATE_COVER_LETTER:
        systemPrompt = CoverLetterPrompt(context);
        break;
      case AI_ACTION_TYPES.PREPARE_INTERVIEW:
        systemPrompt = InterviewPrompt(context);
        break;
      case AI_ACTION_TYPES.SUGGEST_SKILLS:
        systemPrompt = SkillsPrompt(context);
        break;
      case AI_ACTION_TYPES.CAREER_ADVICE:
        systemPrompt = CareerAdvicePrompt(context);
        break;
      case AI_ACTION_TYPES.TAILOR_SUMMARY:
        systemPrompt = TailoredSummaryPrompt.build(context);
        break;
      case AI_ACTION_TYPES.TAILOR_EXPERIENCE:
        systemPrompt = TailoredExperiencePrompt.build(context);
        break;
      case AI_ACTION_TYPES.TAILOR_SKILLS:
        systemPrompt = TailoredSkillsPrompt.build(context);
        break;
      case AI_ACTION_TYPES.TAILOR_PROJECTS:
        systemPrompt = TailoredProjectsPrompt.build(context);
        break;
      case AI_ACTION_TYPES.TAILOR_COVER_LETTER:
        systemPrompt = TailoredCoverLetterPrompt.build(context);
        break;
      case AI_ACTION_TYPES.JOB_GAP_ANALYSIS:
        systemPrompt = JobGapAnalysisPrompt.build(context);
        break;
      case AI_ACTION_TYPES.GENERATE_APPLICATION_EMAIL:
        systemPrompt = ApplicationEmailPrompt.build(context);
        break;
      case AI_ACTION_TYPES.GENERATE_FOLLOW_UP:
        systemPrompt = FollowUpPrompt.build(context);
        break;
      case AI_ACTION_TYPES.GENERATE_SALARY_NEGOTIATION:
        systemPrompt = SalaryNegotiationPrompt.build(context);
        break;
      case AI_ACTION_TYPES.GENERATE_OFFER_ACCEPTANCE:
        systemPrompt = OfferAcceptancePrompt.build(context);
        break;
      case AI_ACTION_TYPES.GENERATE_RESIGNATION:
        systemPrompt = ResignationPrompt.build(context);
        break;
      case AI_ACTION_TYPES.GENERATE_RECOMMENDATION_REQUEST:
      case AI_ACTION_TYPES.GENERATE_REFERENCE_REQUEST:
        systemPrompt = RecommendationPrompt.build(context);
        break;
      case AI_ACTION_TYPES.GENERATE_NETWORKING:
      case AI_ACTION_TYPES.GENERATE_LINKEDIN_MESSAGE:
        systemPrompt = NetworkingPrompt.build(context);
        break;
      case AI_ACTION_TYPES.GENERATE_STATEMENT_OF_PURPOSE:
        systemPrompt = SOPPrompt.build(context);
        break;
      case AI_ACTION_TYPES.GENERATE_THANK_YOU:
        systemPrompt = FollowUpPrompt.build(context); // Alias for now
        break;
      case AI_ACTION_TYPES.GENERATE_INTERNSHIP_REQUEST:
      case AI_ACTION_TYPES.GENERATE_SCHOLARSHIP:
        systemPrompt = CoverLetterPrompt(context); // Alias for now
        break;
      case AI_ACTION_TYPES.GENERIC_CHAT:
      default:
        systemPrompt = GenericChatPrompt(context);
        break;
    }

    if (userMessage) {
      return \`\${systemPrompt}\n\nUSER REQUEST: \${userMessage}\`;
    }

    return systemPrompt;
  }
}

export default new PromptBuilder();
