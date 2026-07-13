class ResponsibilityMatcher {
  static match(resume, profile, jobDescription) {
    // Similar to Keyword matcher, but focuses on action verbs and context from the experience section
    // For MVP phase, we will return a default score. In a full implementation,
    // NLP similarity between job responsibilities and experience descriptions is needed.

    if (!jobDescription || !jobDescription.responsibilities) {
      return { score: 100, missing: [], matched: [] };
    }

    // A placeholder logic
    const expText = (profile.experience || []).map(e => e.description).join(' ').toLowerCase();

    if (!expText) {
      return { score: 0, missing: ['No experience descriptions provided'], matched: [] };
    }

    return { score: 80, missing: [], matched: ['Experience descriptions found'] };
  }
}

export default ResponsibilityMatcher;
