import BaseATSAnalyzer from './BaseATSAnalyzer';
import { ATS_CONFIG } from '../../config/ats';
import { SECTION_TYPES } from '../../constants/appConstants';

class GrammarAnalyzer extends BaseATSAnalyzer {
  constructor() {
    super(ATS_CONFIG);
  }

  async analyze(resumeData) {
    this.validate(resumeData);
    const startTime = Date.now();
    let score = 100;
    const profile = resumeData.profile || {};

    const textBlocks = [
        { text: profile.summary || '', section: SECTION_TYPES.SUMMARY }
    ];

    if (profile.experience) {
        profile.experience.forEach(exp => {
            textBlocks.push({ text: exp.description || '', section: SECTION_TYPES.EXPERIENCE });
        });
    }

    if (profile.projects) {
        profile.projects.forEach(proj => {
            textBlocks.push({ text: proj.description || '', section: SECTION_TYPES.PROJECTS });
        });
    }

    let totalDoubleSpaces = 0;
    let totalMissingPunctuation = 0;
    let totalRepeatedWords = 0;

    textBlocks.forEach(block => {
        if (!block.text) return;
        const text = block.text.trim();
        if (text.length === 0) return;

        // Double spaces
        if (text.includes('  ')) {
            totalDoubleSpaces++;
            score -= 2;
        }

        // Basic repeated words (e.g., "the the")
        const repeatedWordsRegex = /\b(\w+)\s+\1\b/gi;
        const matches = text.match(repeatedWordsRegex);
        if (matches && matches.length > 0) {
            totalRepeatedWords += matches.length;
            score -= (matches.length * 3);
        }

        // Missing trailing punctuation on long blocks (basic heuristic, ignore if very short)
        if (text.length > 50 && !['.', '!', '?'].includes(text.charAt(text.length - 1))) {
            totalMissingPunctuation++;
            score -= 2;
        }
    });

    if (totalDoubleSpaces > 0) {
        this.addRecommendation(
            'Remove Double Spaces',
            `Found double spaces in ${totalDoubleSpaces} text block(s). This can cause ATS parsing errors.`,
            this.config.RECOMMENDATION_PRIORITIES.LOW,
            totalDoubleSpaces * 2,
            SECTION_TYPES.CUSTOM, // General
            null
        );
    }

    if (totalRepeatedWords > 0) {
        this.addRecommendation(
            'Check for Repeated Words',
            `Found ${totalRepeatedWords} instance(s) of repeated words (e.g., "the the").`,
            this.config.RECOMMENDATION_PRIORITIES.MEDIUM,
            totalRepeatedWords * 3,
            SECTION_TYPES.CUSTOM,
            null
        );
    }

    if (totalMissingPunctuation > 0) {
         this.addRecommendation(
            'Missing Punctuation',
            `Found ${totalMissingPunctuation} long text block(s) missing trailing punctuation.`,
            this.config.RECOMMENDATION_PRIORITIES.LOW,
            totalMissingPunctuation * 2,
            SECTION_TYPES.CUSTOM,
            null
        );
    }

    if (score === 100) {
        this.strengths.push('Clean text with no obvious formatting errors');
    }

    this.score = Math.max(0, Math.min(100, score));
    this.processingTime = Date.now() - startTime;

    return {
        score: this.score,
        warnings: this.warnings,
        strengths: this.strengths,
        recommendations: this.recommendations,
        processingTime: this.processingTime
    };
  }
}

export default GrammarAnalyzer;
