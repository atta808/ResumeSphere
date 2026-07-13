class EducationMatcher {
  static match(resume, profile, jobDescription) {
    if (!jobDescription || !jobDescription.educationRequired) {
      return { score: 100, missing: false };
    }

    const edReq = jobDescription.educationRequired.toLowerCase();

    // Very basic heuristic
    const requiresBachelors = edReq.includes('bachelor') || edReq.includes('bs') || edReq.includes('ba') || edReq.includes('b.s');
    const requiresMasters = edReq.includes('master') || edReq.includes('ms') || edReq.includes('ma');
    const requiresPhD = edReq.includes('phd') || edReq.includes('doctorate');

    let profileHasBachelors = false;
    let profileHasMasters = false;
    let profileHasPhD = false;

    (profile.education || []).forEach(edu => {
      const degree = (edu.degree || '').toLowerCase();
      if (degree.includes('bachelor') || degree.includes('bs') || degree.includes('ba')) profileHasBachelors = true;
      if (degree.includes('master') || degree.includes('ms') || degree.includes('ma')) profileHasMasters = true;
      if (degree.includes('phd') || degree.includes('doctorate')) profileHasPhD = true;
    });

    let score = 100;
    let missing = false;

    if (requiresPhD && !profileHasPhD) {
      score = 0;
      missing = true;
    } else if (requiresMasters && !profileHasMasters && !profileHasPhD) {
      score = 50;
      missing = true;
    } else if (requiresBachelors && !profileHasBachelors && !profileHasMasters && !profileHasPhD) {
      score = 0;
      missing = true;
    }

    return { score, missing };
  }
}

export default EducationMatcher;
