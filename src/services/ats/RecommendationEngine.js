class RecommendationEngine {
  static processRecommendations(results) {
    let allRecommendations = [];
    let allStrengths = [];
    let allWarnings = [];

    // Aggregate from all analyzers
    Object.values(results).forEach(result => {
        if (result.recommendations) {
            allRecommendations = [...allRecommendations, ...result.recommendations];
        }
        if (result.strengths) {
            allStrengths = [...allStrengths, ...result.strengths];
        }
        if (result.warnings) {
            allWarnings = [...allWarnings, ...result.warnings];
        }
    });

    // Sort recommendations by score impact (descending)
    allRecommendations.sort((a, b) => (b.scoreImpact || 0) - (a.scoreImpact || 0));

    return {
        recommendations: allRecommendations,
        strengths: allStrengths,
        warnings: allWarnings
    };
  }
}

export default RecommendationEngine;
