class ExperienceMatcher {
  /**
   * Matches Experience duration and roles.
   */
  static match(resume, profile, jobDescription) {
    if (!jobDescription || !jobDescription.experienceRequired) {
      return { score: 100, yearsFound: 0, required: 0 };
    }

    // Heuristic: look for "X years" or "X+ years"
    const expRegex = /(\\d+)\\+?\\s*years?/i;
    const match = jobDescription.experienceRequired.match(expRegex);
    const requiredYears = match ? parseInt(match[1], 10) : 0;

    if (requiredYears === 0) {
      return { score: 100, yearsFound: 0, required: 0 };
    }

    // Calculate total years of experience in the profile
    let totalMonths = 0;
    (profile.experience || []).forEach(exp => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.isCurrent || !exp.endDate ? new Date() : new Date(exp.endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
          totalMonths += Math.max(0, months);
        }
      }
    });

    const yearsFound = totalMonths / 12;
    let score = 100;

    if (yearsFound < requiredYears) {
      score = Math.round((yearsFound / requiredYears) * 100);
    }

    return { score, yearsFound: Math.round(yearsFound * 10) / 10, required: requiredYears };
  }
}

export default ExperienceMatcher;
