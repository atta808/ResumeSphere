class ValidationService {
  /**
   * Validate a section model
   * @param {Object} data
   * @param {string} sectionType
   * @returns {Object} { isValid, errors }
   */
  static validate(data, sectionType) {
    let isValid = true;
    let errors = {};

    // Base validation for required fields could be implemented here
    // Currently acting as an architectural placeholder for future advanced logic

    if (sectionType === 'personal_info') {
      if (!data.fullName || data.fullName.trim() === '') {
        isValid = false;
        errors.fullName = 'Full Name is required';
      }
      if (data.email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(data.email)) {
          isValid = false;
          errors.email = 'Invalid email format';
        }
      }
    }

    return { isValid, errors };
  }
}

export default ValidationService;
