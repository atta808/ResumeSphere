class OCRParser {
  /**
   * Helper to structure a normalized field with confidence and source.
   * @param {*} value
   * @param {number} confidence (0-100)
   * @param {string} source
   * @returns {Object}
   */
  static createField(value, confidence, source = 'Google Vision') {
    return { value, confidence, source };
  }

  /**
   * Parses raw OCR text into a structured profile format.
   * This provides a basic structural extraction. Messy data will later be passed
   * to AI normalization.
   * @param {string} text - Raw OCR text
   * @returns {Object} - Normalized profile object
   */
  static parse(text) {
    if (!text) {
      return {};
    }

    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const profile = {
      fullName: this.createField('', 0),
      email: this.createField('', 0),
      phone: this.createField('', 0),
      address: this.createField('', 0),
      website: this.createField('', 0),
      linkedin: this.createField('', 0),
      github: this.createField('', 0),
      summary: this.createField('', 0),
      education: [],
      experience: [],
      skills: [],
      projects: [],
      languages: [],
      certifications: [],
      awards: [],
      references: [],
    };

    // Very rudimentary extraction rules for basic contact info
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Assuming first non-empty line is likely the name if it's not too long
      if (!profile.fullName.value && i < 3 && line.length < 50 && !emailRegex.test(line) && !phoneRegex.test(line)) {
        profile.fullName = this.createField(line, 70); // Medium confidence
        continue;
      }

      if (!profile.email.value && emailRegex.test(line)) {
        const match = line.match(emailRegex);
        profile.email = this.createField(match[0], 95);
        continue;
      }

      if (!profile.phone.value && phoneRegex.test(line)) {
        const match = line.match(phoneRegex);
        profile.phone = this.createField(match[0], 90);
        continue;
      }

      if (!profile.linkedin.value && line.toLowerCase().includes('linkedin.com/in/')) {
        profile.linkedin = this.createField(line, 95);
        continue;
      }

      if (!profile.github.value && line.toLowerCase().includes('github.com/')) {
        profile.github = this.createField(line, 95);
        continue;
      }
    }

    // The raw text is also passed along so the AI prompt can normalize it properly.
    return profile;
  }
}

export default OCRParser;
