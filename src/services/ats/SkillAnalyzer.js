import BaseATSAnalyzer from './BaseATSAnalyzer';
import { ATS_CONFIG } from '../../config/ats';
import { SECTION_TYPES } from '../../constants/appConstants';

class SkillAnalyzer extends BaseATSAnalyzer {
  constructor() {
    super(ATS_CONFIG);
  }

  async analyze(resumeData) {
    this.validate(resumeData);
    const startTime = Date.now();
    let score = 100;

    const profile = resumeData.profile || {};
    const skills = profile.skills || [];

    if (skills.length === 0) {
        score = 0;
        this.addRecommendation(
            'Add a Skills Section',
            'Your resume has no listed skills. ATS systems heavily rely on skill keywords.',
            this.config.RECOMMENDATION_PRIORITIES.CRITICAL,
            100,
            SECTION_TYPES.SKILLS,
            'Improve Skills'
        );
    } else if (skills.length < 5) {
        score -= 30;
        this.addRecommendation(
            'Expand Skills List',
            'You have very few skills listed. Aim for 8-15 highly relevant skills.',
            this.config.RECOMMENDATION_PRIORITIES.HIGH,
            30,
            SECTION_TYPES.SKILLS,
            'Improve Skills'
        );
    } else if (skills.length > 25) {
         score -= 10;
         this.addRecommendation(
             'Too Many Skills',
             'Listing too many skills can dilute your core competencies. Focus on the most relevant ones.',
             this.config.RECOMMENDATION_PRIORITIES.LOW,
             10,
             SECTION_TYPES.SKILLS,
             'Improve Skills'
         );
    } else {
        this.strengths.push('Good number of skills listed');
    }

    // Check for duplicates
    const skillNames = skills.map(s => (s.name || '').toLowerCase().trim());
    const uniqueSkills = new Set(skillNames);
    if (skillNames.length !== uniqueSkills.size) {
        const duplicates = skillNames.length - uniqueSkills.size;
        score -= (duplicates * 5);
        this.addRecommendation(
            'Remove Duplicate Skills',
            `Found ${duplicates} duplicate skills. ATS systems do not give extra credit for repeats.`,
            this.config.RECOMMENDATION_PRIORITIES.MEDIUM,
            duplicates * 5,
            SECTION_TYPES.SKILLS,
            null
        );
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

export default SkillAnalyzer;
