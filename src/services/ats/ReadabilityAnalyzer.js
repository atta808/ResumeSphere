import BaseATSAnalyzer from './BaseATSAnalyzer';
import { ATS_CONFIG } from '../../config/ats';
import { SECTION_TYPES } from '../../constants/appConstants';

class ReadabilityAnalyzer extends BaseATSAnalyzer {
  constructor() {
    super(ATS_CONFIG);
  }

  async analyze(resumeData) {
    this.validate(resumeData);
    const startTime = Date.now();
    let score = 100;
    const profile = resumeData.profile || {};

    let fullText = '';
    if (profile.summary) fullText += profile.summary + '. ';
    if (profile.experience) {
        profile.experience.forEach(exp => {
            if (exp.description) fullText += exp.description + '. ';
        });
    }

    if (!fullText.trim()) {
        this.score = 0;
        return {
            score: 0,
            warnings: ['Not enough text to analyze readability.'],
            strengths: [],
            recommendations: [],
            processingTime: Date.now() - startTime
        };
    }

    // Basic Readability Heuristics
    const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = fullText.split(/\s+/).filter(w => w.length > 0);

    const avgSentenceLength = words.length / (sentences.length || 1);

    // Penalize overly long average sentence length
    if (avgSentenceLength > 25) {
        score -= 20;
        this.addRecommendation(
            'Sentences are Too Long',
            `Your average sentence length is ${avgSentenceLength.toFixed(1)} words. Aim for 15-20 words for better readability.`,
            this.config.RECOMMENDATION_PRIORITIES.MEDIUM,
            20,
            SECTION_TYPES.SUMMARY,
            'Improve Summary'
        );
    } else if (avgSentenceLength < 8) {
        score -= 10;
        this.addRecommendation(
            'Sentences are Too Short',
            `Your average sentence length is ${avgSentenceLength.toFixed(1)} words. Consider combining short, choppy sentences.`,
            this.config.RECOMMENDATION_PRIORITIES.LOW,
            10,
            SECTION_TYPES.SUMMARY,
            'Improve Summary'
        );
    } else {
        this.strengths.push('Good average sentence length');
    }

    // Check for extremely long individual sentences
    let overlyLongSentences = 0;
    sentences.forEach(sentence => {
        const wordCount = sentence.trim().split(/\s+/).length;
        if (wordCount > 35) {
            overlyLongSentences++;
        }
    });

    if (overlyLongSentences > 0) {
        score -= (overlyLongSentences * 5);
        this.addRecommendation(
            'Break Up Long Sentences',
            `Found ${overlyLongSentences} extremely long sentences. These are hard for recruiters to scan quickly.`,
            this.config.RECOMMENDATION_PRIORITIES.MEDIUM,
            overlyLongSentences * 5,
            SECTION_TYPES.EXPERIENCE,
            'Rewrite Experience'
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

export default ReadabilityAnalyzer;
