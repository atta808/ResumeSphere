class JobDescriptionParser {
  /**
   * Basic parser to extract structured information from a raw text block.
   * This provides a lightweight fallback/initial parse before any AI enhancement.
   */
  static parse(rawText) {
    if (!rawText) return {};

    const text = rawText.trim();

    // Very basic heuristic parsing for demonstration.
    // In a production scenario, you would use regex or NLP,
    // or eventually pass the raw text to an AI parser.
    const extractSection = (keyword) => {
      const regex = new RegExp(\`\${keyword}s?:?\\s*([\\s\\S]*?)(?=(?:\\n\\n|[A-Z][a-z]+s?:|\\Z))\`, 'i');
      const match = text.match(regex);
      return match && match[1] ? match[1].trim() : '';
    };

    // Simple line parsing
    const lines = text.split('\\n').map(l => l.trim()).filter(l => l);
    const jobTitle = lines.length > 0 ? lines[0] : '';
    const companyName = lines.length > 1 ? lines[1] : '';

    return {
      originalText: text,
      jobTitle: extractSection('Job Title') || jobTitle,
      companyName: extractSection('Company') || companyName,
      location: extractSection('Location'),
      employmentType: extractSection('Employment Type') || extractSection('Type'),
      salary: extractSection('Salary') || extractSection('Compensation'),
      experienceRequired: extractSection('Experience'),
      educationRequired: extractSection('Education') || extractSection('Degree'),
      requiredSkills: extractSection('Required Skills') || extractSection('Skills'),
      preferredSkills: extractSection('Preferred Skills') || extractSection('Bonus Points'),
      responsibilities: extractSection('Responsibilities') || extractSection('What You Will Do'),
      qualifications: extractSection('Qualifications') || extractSection('Requirements'),
      certifications: extractSection('Certifications') || extractSection('Certificates'),
      languages: extractSection('Languages'),
      benefits: extractSection('Benefits') || extractSection('Perks'),
      parsedVersion: '1.0'
    };
  }
}

export default JobDescriptionParser;
