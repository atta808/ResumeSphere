class KeywordMatcher {
  /**
   * Matches raw text content of the resume against the required/preferred skills
   * and qualifications in the job description to find missing keywords.
   */
  static match(resume, profile, jobDescription) {
    if (!jobDescription || (!jobDescription.requiredSkills && !jobDescription.qualifications)) {
      return { score: 100, missing: [], matched: [] };
    }

    // A simple, deterministic keyword extraction from the job description
    const extractKeywords = (text) => {
       if (!text) return [];
       // Very naive keyword extraction: split by commas, newlines, bullets, and long strings by space
       // In a real scenario, NLP or a predefined dictionary would be better.
       return text
         .split(/[\\n,•\\-]+/)
         .map(s => s.trim())
         .filter(s => s.length > 2 && s.split(' ').length < 5) // keep short phrases
         .map(s => s.toLowerCase());
    };

    const targetKeywords = new Set([
      ...extractKeywords(jobDescription.requiredSkills),
      ...extractKeywords(jobDescription.qualifications),
      ...extractKeywords(jobDescription.preferredSkills)
    ]);

    if (targetKeywords.size === 0) {
      return { score: 100, missing: [], matched: [] };
    }

    // Flatten all text in the resume/profile
    const allText = [
      profile.summary || '',
      ...(profile.experience || []).map(e => \`\${e.position} \${e.description}\`),
      ...(profile.skills || []).map(s => s.name),
      ...(profile.education || []).map(e => \`\${e.degree} \${e.fieldOfStudy} \${e.description}\`),
      ...(profile.projects || []).map(p => \`\${p.name} \${p.description}\`)
    ].join(' ').toLowerCase();

    const matched = [];
    const missing = [];

    targetKeywords.forEach(keyword => {
      // Basic exact substring match (or regex word boundary)
      const regex = new RegExp(\`\\\\b\${keyword.replace(/[-/\\\\^$*+?.()|[]{}]/g, '\\\\$&')}\\\\b\`, 'i');
      if (regex.test(allText)) {
        matched.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    const score = Math.round((matched.length / targetKeywords.size) * 100);

    return { score, matched, missing };
  }
}

export default KeywordMatcher;
