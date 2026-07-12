import BaseATSAnalyzer from './BaseATSAnalyzer';
import { ATS_CONFIG } from '../../config/ats';
import { SECTION_TYPES } from '../../constants/appConstants';

class FormattingAnalyzer extends BaseATSAnalyzer {
  constructor() {
    super(ATS_CONFIG);
  }

  async analyze(resumeData) {
    this.validate(resumeData);
    const startTime = Date.now();
    let score = 100;

    const profile = resumeData.profile || {};

    // Check Experience dates formatting consistency (basic check)
    if (profile.experience && profile.experience.length > 0) {
        let missingDates = 0;
        profile.experience.forEach(exp => {
            if (!exp.startDate) missingDates++;
        });

        if (missingDates > 0) {
            score -= (missingDates * 10);
            this.addRecommendation(
                'Missing Experience Dates',
                `Found ${missingDates} experience entries missing a start date. ATS systems need dates to calculate years of experience.`,
                this.config.RECOMMENDATION_PRIORITIES.HIGH,
                missingDates * 10,
                SECTION_TYPES.EXPERIENCE,
                null
            );
        }
    }

    // Check Education dates
    if (profile.education && profile.education.length > 0) {
        let missingDates = 0;
        profile.education.forEach(edu => {
            if (!edu.endDate) missingDates++;
        });

        if (missingDates > 0) {
            score -= (missingDates * 5);
            this.addRecommendation(
                'Missing Education Dates',
                `Found ${missingDates} education entries missing a graduation/end date.`,
                this.config.RECOMMENDATION_PRIORITIES.MEDIUM,
                missingDates * 5,
                SECTION_TYPES.EDUCATION,
                null
            );
        }
    }

    // Check for overly long text blocks instead of bullets (basic heuristic)
    if (profile.experience) {
        let longBlocks = 0;
        profile.experience.forEach(exp => {
            if (exp.description && exp.description.length > 300 && !exp.description.includes('\n')) {
                longBlocks++;
            }
        });

        if (longBlocks > 0) {
             score -= (longBlocks * 5);
             this.addRecommendation(
                 'Use Bullet Points',
                 `Found ${longBlocks} experience descriptions that are long blocks of text. Break them into bullet points for better readability.`,
                 this.config.RECOMMENDATION_PRIORITIES.MEDIUM,
                 longBlocks * 5,
                 SECTION_TYPES.EXPERIENCE,
                 'Rewrite Experience'
             );
        } else {
             this.strengths.push('Good use of formatting and structure');
        }
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

export default FormattingAnalyzer;
