import KeywordMatcher from './KeywordMatcher';
import SkillMatcher from './SkillMatcher';
import ExperienceMatcher from './ExperienceMatcher';
import EducationMatcher from './EducationMatcher';
import ResponsibilityMatcher from './ResponsibilityMatcher';
import GapAnalyzer from './GapAnalyzer';
import MatchScoringEngine from './MatchScoringEngine';
import RecommendationEngine from './RecommendationEngine';

class JobMatchingEngine {
  /**
   * Orchestrates the matching of a resume/profile against a job description.
   * Returns a comprehensive match report.
   */
  static async runAnalysis(resume, profile, jobDescription) {
    const startTime = Date.now();

    // 1. Run all matchers
    const keywordResults = KeywordMatcher.match(resume, profile, jobDescription);
    const skillResults = SkillMatcher.match(resume, profile, jobDescription);
    const experienceResults = ExperienceMatcher.match(resume, profile, jobDescription);
    const educationResults = EducationMatcher.match(resume, profile, jobDescription);
    const responsibilityResults = ResponsibilityMatcher.match(resume, profile, jobDescription);

    const matchResults = {
      keywordScore: keywordResults.score,
      keywords: keywordResults,
      skillsScore: skillResults.score,
      skills: skillResults,
      experienceScore: experienceResults.score,
      experience: experienceResults,
      educationScore: educationResults.score,
      education: educationResults,
      responsibilityScore: responsibilityResults.score,
      responsibilities: responsibilityResults,
    };

    // 2. Calculate Overall Score
    const overallScore = MatchScoringEngine.calculateOverallScore(matchResults);
    matchResults.overallScore = overallScore;

    // 3. Gap Analysis
    const gaps = GapAnalyzer.analyze(matchResults, profile, jobDescription);

    // 4. Generate Recommendations
    const recommendations = RecommendationEngine.generate(gaps, matchResults);

    const endTime = Date.now();

    // 5. Structure the final report
    return {
      overallScore,
      skillsScore: matchResults.skillsScore,
      experienceScore: matchResults.experienceScore,
      educationScore: matchResults.educationScore,
      keywordScore: matchResults.keywordScore,
      responsibilityScore: matchResults.responsibilityScore,
      certificationScore: 0, // Placeholder
      languageScore: 0, // Placeholder
      matchedItems: JSON.stringify({
        skills: skillResults.matched,
        keywords: keywordResults.matched,
      }),
      missingItems: JSON.stringify({
        skills: skillResults.missing,
        keywords: keywordResults.missing,
        gaps,
      }),
      extraItems: JSON.stringify([]),
      recommendations: JSON.stringify(recommendations),
      processingTime: endTime - startTime,
      provider: 'Local-Rule-Based',
      algorithmVersion: '1.0'
    };
  }
}

export default JobMatchingEngine;
