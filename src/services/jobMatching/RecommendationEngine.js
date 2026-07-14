class RecommendationEngine {
  static generate(gaps, results) {
    const recommendations = [];

    gaps.forEach(gap => {
      if (gap.type === 'Missing Skills') {
        recommendations.push({
          title: 'Add Missing Skills',
          description: `Add the following skills if you have them: ${gap.details}`,
          reason: 'Matches required skills in job description.',
          estimatedScoreGain: 10,
          futureAiAction: 'TAILOR_SKILLS'
        });
      } else if (gap.type === 'Missing Keywords') {
        recommendations.push({
          title: 'Optimize Professional Summary',
          description: 'Incorporate missing keywords into your summary.',
          reason: 'Improves overall keyword match rate.',
          estimatedScoreGain: 15,
          futureAiAction: 'TAILOR_SUMMARY'
        });
      } else if (gap.type === 'Experience Gap') {
        recommendations.push({
          title: 'Highlight Relevant Experience',
          description: 'You fall short on total years. Make sure to emphasize the impact and relevance of the experience you do have.',
          reason: 'Compensates for lower total years of experience.',
          estimatedScoreGain: 5,
          futureAiAction: 'TAILOR_EXPERIENCE'
        });
      }
    });

    if (results.overallScore < 80) {
       recommendations.push({
          title: 'Tailor Resume for Job',
          description: 'Use AI to rewrite your resume specifically for this job description.',
          reason: 'Comprehensive optimization.',
          estimatedScoreGain: 20,
          futureAiAction: 'TAILOR_RESUME'
        });
    }

    return recommendations;
  }
}

export default RecommendationEngine;
