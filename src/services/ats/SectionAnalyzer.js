import BaseATSAnalyzer from './BaseATSAnalyzer';
import { ATS_CONFIG } from '../../config/ats';
import { SECTION_TYPES } from '../../constants/appConstants';

class SectionAnalyzer extends BaseATSAnalyzer {
  constructor() {
    super(ATS_CONFIG);
  }

  async analyze(resumeData) {
    this.validate(resumeData);
    const startTime = Date.now();
    let score = 100;
    const profile = resumeData.profile || {};

    const requiredSections = [
        { key: 'email', name: 'Email Address', type: SECTION_TYPES.PERSONAL_INFO, weight: 15, critical: true },
        { key: 'phone', name: 'Phone Number', type: SECTION_TYPES.PERSONAL_INFO, weight: 15, critical: true },
        { key: 'summary', name: 'Professional Summary', type: SECTION_TYPES.SUMMARY, weight: 10, critical: false },
        { key: 'experience', name: 'Work Experience', type: SECTION_TYPES.EXPERIENCE, weight: 20, critical: true },
        { key: 'education', name: 'Education', type: SECTION_TYPES.EDUCATION, weight: 10, critical: true },
        { key: 'skills', name: 'Skills', type: SECTION_TYPES.SKILLS, weight: 10, critical: true }
    ];

    const recommendedSections = [
        { key: 'location', name: 'Location', type: SECTION_TYPES.PERSONAL_INFO, weight: 5 },
        { key: 'linkedin', name: 'LinkedIn Profile', type: SECTION_TYPES.PERSONAL_INFO, weight: 5 }
    ];

    // Check Required Sections
    requiredSections.forEach(sec => {
        let hasSection = false;
        if (sec.key === 'email' || sec.key === 'phone' || sec.key === 'location' || sec.key === 'linkedin') {
            hasSection = profile.personalInfo && !!profile.personalInfo[sec.key];
        } else {
            hasSection = profile[sec.key] && (Array.isArray(profile[sec.key]) ? profile[sec.key].length > 0 : !!profile[sec.key]);
        }

        if (!hasSection) {
            score -= sec.weight;
            this.addRecommendation(
                `Missing ${sec.name}`,
                `${sec.name} is a standard resume section expected by ATS.`,
                sec.critical ? this.config.RECOMMENDATION_PRIORITIES.CRITICAL : this.config.RECOMMENDATION_PRIORITIES.HIGH,
                sec.weight,
                sec.type,
                sec.key === 'summary' ? 'Improve Summary' : null
            );
        } else {
            this.strengths.push(`Included ${sec.name}`);
        }
    });

    // Check Recommended Sections
    recommendedSections.forEach(sec => {
        let hasSection = false;
        if (sec.key === 'location' || sec.key === 'linkedin') {
            hasSection = profile.personalInfo && !!profile.personalInfo[sec.key];
        }

        if (!hasSection) {
             score -= sec.weight;
             this.addRecommendation(
                `Missing ${sec.name}`,
                `Adding your ${sec.name} can improve your ATS score and visibility.`,
                this.config.RECOMMENDATION_PRIORITIES.MEDIUM,
                sec.weight,
                sec.type,
                null
             );
        }
    });

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

export default SectionAnalyzer;
