class SkillMatcher {
  /**
   * Specifically matches Profile Skills against Job Description Required/Preferred Skills
   */
  static match(resume, profile, jobDescription) {
    const profileSkills = (profile.skills || []).map(s => s.name.toLowerCase());

    if (!jobDescription || !jobDescription.requiredSkills) {
      return { score: 100, missing: [], matched: [] };
    }

    // Simple extraction, assuming comma or newline separation
    const requiredSkillsList = jobDescription.requiredSkills
      .split(/[\\n,]+/)
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length > 0);

    if (requiredSkillsList.length === 0) {
      return { score: 100, missing: [], matched: [] };
    }

    const matched = [];
    const missing = [];

    requiredSkillsList.forEach(reqSkill => {
      // Check if any profile skill is a substring of the required skill or vice versa
      const isMatch = profileSkills.some(ps => ps.includes(reqSkill) || reqSkill.includes(ps));
      if (isMatch) {
        matched.push(reqSkill);
      } else {
        missing.push(reqSkill);
      }
    });

    const score = Math.round((matched.length / requiredSkillsList.length) * 100);

    return { score, matched, missing };
  }
}

export default SkillMatcher;
