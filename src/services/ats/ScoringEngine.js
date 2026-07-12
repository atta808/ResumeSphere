import { ATS_CONFIG } from '../../config/ats';

class ScoringEngine {
  static generateScore(results) {
    const weights = ATS_CONFIG.WEIGHTS;

    // Default sub-scores if a specific analyzer didn't return one
    const subScores = {
        summary: results.keywords?.score || 100, // Approximation based on keywords analyzer for now
        experience: results.formatting?.score || 100, // Assuming formatting mainly checks experience dates etc
        skills: results.skills?.score || 0,
        education: results.formatting?.score || 100,
        projects: 100, // Placeholder: to be replaced with a dedicated Projects analyzer later
        formatting: results.formatting?.score || 100,
        grammar: results.grammar?.score || 100,
        readability: results.readability?.score || 100,
        completeness: results.sections?.score || 100
    };

    let totalWeight = 0;
    let weightedSum = 0;

    for (const [category, weight] of Object.entries(weights)) {
        if (subScores[category] !== undefined) {
            weightedSum += (subScores[category] * weight);
            totalWeight += weight;
        }
    }

    const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

    return {
        overallScore,
        categoryScores: subScores
    };
  }
}

export default ScoringEngine;
