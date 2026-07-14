class GapAnalyzer {
  static analyze(results, profile, jobDescription) {
    const gaps = [];

    // Missing Skills
    if (results.skills && results.skills.missing && results.skills.missing.length > 0) {
      gaps.push({
        type: 'Missing Skills',
        severity: 'High',
        details: results.skills.missing.slice(0, 5).join(', ') + (results.skills.missing.length > 5 ? ' and more...' : '')
      });
    }

    // Missing Keywords
    if (results.keywords && results.keywords.missing && results.keywords.missing.length > 0) {
       gaps.push({
        type: 'Missing Keywords',
        severity: 'Medium',
        details: 'Consider adding more keywords from the job description.'
      });
    }

    // Experience gap
    if (results.experience && results.experience.score < 100) {
      gaps.push({
        type: 'Experience Gap',
        severity: 'High',
        details: `Requires ${results.experience.required} years, found ${results.experience.yearsFound}.`
      });
    }

    // Education gap
    if (results.education && results.education.missing) {
       gaps.push({
        type: 'Education Gap',
        severity: 'Critical',
        details: 'Your education might not meet the minimum requirements.'
      });
    }

    return gaps;
  }
}

export default GapAnalyzer;
