import BaseATSAnalyzer from './BaseATSAnalyzer';
import { ATS_CONFIG } from '../../config/ats';
import { SECTION_TYPES } from '../../constants/appConstants';

class KeywordAnalyzer extends BaseATSAnalyzer {
  constructor() {
    super(ATS_CONFIG);
  }

  async analyze(resumeData) {
    this.validate(resumeData);
    const startTime = Date.now();
    let score = 100;

    // Combine text from relevant sections for keyword analysis
    const textToAnalyze = this._extractText(resumeData).toLowerCase();

    const actionVerbs = this.config.DICTIONARIES.ACTION_VERBS;
    const weakWords = this.config.DICTIONARIES.WEAK_WORDS;
    const buzzwords = this.config.DICTIONARIES.BUZZWORDS;

    // Check for Action Verbs
    let actionVerbCount = 0;
    actionVerbs.forEach(verb => {
        if (textToAnalyze.includes(verb)) actionVerbCount++;
    });

    if (actionVerbCount < 5) {
        score -= 15;
        this.addRecommendation(
            'Use More Action Verbs',
            'Your resume lacks strong action verbs. Start bullet points with words like "Achieved", "Developed", or "Managed".',
            this.config.RECOMMENDATION_PRIORITIES.HIGH,
            15,
            SECTION_TYPES.EXPERIENCE,
            'Rewrite Experience'
        );
    } else {
        this.strengths.push('Good use of action verbs');
    }

    // Check for Weak Words
    let weakWordCount = 0;
    weakWords.forEach(word => {
        if (textToAnalyze.includes(word)) weakWordCount++;
    });

    if (weakWordCount > 0) {
        score -= (weakWordCount * 2);
        this.addRecommendation(
            'Remove Weak Phrases',
            `Found ${weakWordCount} instances of weak phrases like "responsible for" or "helped". Replace them with active accomplishments.`,
            this.config.RECOMMENDATION_PRIORITIES.MEDIUM,
            weakWordCount * 2,
            SECTION_TYPES.EXPERIENCE,
            'Rewrite Experience'
        );
    }

    // Check for Buzzwords
    let buzzwordCount = 0;
    buzzwords.forEach(word => {
        if (textToAnalyze.includes(word)) buzzwordCount++;
    });

    if (buzzwordCount > 0) {
         score -= (buzzwordCount * 2);
         this.addRecommendation(
            'Avoid Cliché Buzzwords',
             `Found ${buzzwordCount} cliché buzzwords. Use concrete metrics instead of fluff.`,
             this.config.RECOMMENDATION_PRIORITIES.LOW,
             buzzwordCount * 2,
             SECTION_TYPES.SUMMARY,
             'Improve Summary'
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

  _extractText(resumeData) {
      const profile = resumeData.profile || {};
      let text = '';
      if (profile.summary) text += profile.summary + ' ';
      if (profile.experience) {
          profile.experience.forEach(exp => {
              text += (exp.title || '') + ' ' + (exp.description || '') + ' ';
          });
      }
      if (profile.projects) {
          profile.projects.forEach(proj => {
             text += (proj.title || '') + ' ' + (proj.description || '') + ' ';
          });
      }
      return text;
  }
}

export default KeywordAnalyzer;
