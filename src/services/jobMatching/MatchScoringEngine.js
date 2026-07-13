class MatchScoringEngine {
  static calculateOverallScore(results) {
    const weights = {
      skillsScore: 0.4,
      keywordScore: 0.3,
      experienceScore: 0.2,
      educationScore: 0.1,
    };

    let totalScore = 0;
    totalScore += (results.skillsScore || 0) * weights.skillsScore;
    totalScore += (results.keywordScore || 0) * weights.keywordScore;
    totalScore += (results.experienceScore || 0) * weights.experienceScore;
    totalScore += (results.educationScore || 0) * weights.educationScore;

    return Math.round(totalScore);
  }
}

export default MatchScoringEngine;
