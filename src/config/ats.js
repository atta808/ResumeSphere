export const ATS_CONFIG = {
  VERSION: '1.0',
  CONFIG_VERSION: '1.0',

  WEIGHTS: {
    summary: 10,
    experience: 20,
    skills: 20,
    education: 10,
    projects: 10,
    formatting: 10,
    grammar: 10,
    readability: 5,
    completeness: 5
  },

  THRESHOLDS: {
    excellent: 90,
    good: 75,
    average: 60,
    poor: 40,
    critical: 0
  },

  DICTIONARIES: {
    ACTION_VERBS: [
      'achieved', 'built', 'created', 'designed', 'developed', 'directed',
      'engineered', 'improved', 'implemented', 'increased', 'led', 'managed',
      'optimized', 'reduced', 'solved', 'streamlined', 'analyzed', 'orchestrated',
      'spearheaded', 'transformed', 'delivered', 'generated', 'maximized', 'mentored'
    ],
    POWER_WORDS: [
      'innovative', 'strategic', 'dynamic', 'proactive', 'scalable', 'robust',
      'data-driven', 'cross-functional', 'agile', 'seamless', 'impactful'
    ],
    LEADERSHIP_WORDS: [
      'directed', 'guided', 'supervised', 'trained', 'motivated', 'empowered',
      'coached', 'delegated', 'facilitated', 'negotiated'
    ],
    SOFT_SKILLS: [
      'communication', 'teamwork', 'leadership', 'problem solving', 'time management',
      'adaptability', 'critical thinking', 'collaboration', 'emotional intelligence'
    ],
    BUZZWORDS: [
      'synergy', 'go-getter', 'think outside the box', 'thought leadership',
      'wheelhouse', 'deep dive', 'ecosystem', 'paradigm shift', 'ninja', 'rockstar'
    ],
    WEAK_WORDS: [
      'helped', 'worked on', 'assisted', 'responsible for', 'duties included',
      'participated in', 'contributed to'
    ],
    FILLER_WORDS: [
      'very', 'really', 'just', 'quite', 'maybe', 'perhaps', 'stuff', 'things',
      'a lot', 'numerous', 'various'
    ]
  },

  RECOMMENDATION_PRIORITIES: {
    CRITICAL: 'Critical',
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low'
  }
};

export default ATS_CONFIG;
