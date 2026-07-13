import ENV from './env';

export const AI_CONFIG = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    temperature: 0.7,
    maxTokens: 2000,
    timeout: ENV.API_TIMEOUT || 30000,
    retryCount: 3,
    baseRetryDelayMs: 1000, // Exponential backoff starting point
  },
  // Future providers can be added here
  // openai: { ... },
  // gemini: { ... }
};

export const AI_PROVIDERS = {
  DEEPSEEK: 'DEEPSEEK',
  OPENAI: 'OPENAI',
  GEMINI: 'GEMINI',
};

export const AI_ACTION_TYPES = {
  GENERATE_SUMMARY: 'GENERATE_SUMMARY',
  IMPROVE_RESUME: 'IMPROVE_RESUME',
  REWRITE_EXPERIENCE: 'REWRITE_EXPERIENCE',
  SUGGEST_SKILLS: 'SUGGEST_SKILLS',
  GENERATE_COVER_LETTER: 'GENERATE_COVER_LETTER',
  PREPARE_INTERVIEW: 'PREPARE_INTERVIEW',
  CAREER_ADVICE: 'CAREER_ADVICE',
  GENERIC_CHAT: 'GENERIC_CHAT',
  // Job Tailoring specific actions
  TAILOR_RESUME: 'TAILOR_RESUME',
  TAILOR_SUMMARY: 'TAILOR_SUMMARY',
  TAILOR_EXPERIENCE: 'TAILOR_EXPERIENCE',
  TAILOR_SKILLS: 'TAILOR_SKILLS',
  TAILOR_PROJECTS: 'TAILOR_PROJECTS',
  TAILOR_COVER_LETTER: 'TAILOR_COVER_LETTER',
  JOB_GAP_ANALYSIS: 'JOB_GAP_ANALYSIS',
};
