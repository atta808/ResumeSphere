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

    const required = (field, name) => {
      if (!data[field] || String(data[field]).trim() === '') {
        isValid = false;
        errors[field] = `${name} is required`;
      }
    };

    const isEmail = (field) => {
      if (data[field]) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(data[field])) {
          isValid = false;
          errors[field] = 'Invalid email format';
        }
      }
    };

    const isUrl = (field) => {
      if (data[field]) {
        try {
          new URL(data[field]);
        } catch (_) {
          isValid = false;
          errors[field] = 'Invalid URL format';
        }
      }
    };

    const isPhone = (field) => {
      if (data[field]) {
        const regex = /^\+?[0-9\s\-\(\)]+$/;
        if (!regex.test(data[field])) {
           isValid = false;
           errors[field] = 'Invalid phone number';
        }
      }
    }

    const checkDateRange = (startField, endField, isCurrentField = null) => {
      if (data[startField] && data[endField]) {
        if (isCurrentField && data[isCurrentField]) return;
        const start = new Date(data[startField]);
        const end = new Date(data[endField]);
        if (start > end) {
          isValid = false;
          errors[endField] = 'End date cannot be before start date';
        }
      }
    };


    switch (sectionType) {
      case 'personal_info':
        required('fullName', 'Full Name');
        isEmail('email');
        isPhone('phone');
        isUrl('website');
        isUrl('linkedIn');
        isUrl('gitHub');
        isUrl('portfolio');
        break;

      case 'summary':
        // Optional validation logic
        break;

      case 'education':
        required('institution', 'Institution');
        required('degree', 'Degree');
        checkDateRange('startDate', 'endDate', 'isCurrent');
        break;

      case 'experience':
        required('company', 'Company');
        required('position', 'Position');
        checkDateRange('startDate', 'endDate', 'isCurrent');
        break;

      case 'projects':
        required('name', 'Project Name');
        isUrl('url');
        checkDateRange('startDate', 'endDate', 'isCurrent');
        break;

      case 'skills':
        required('name', 'Skill Name');
        break;

      case 'languages':
        required('name', 'Language');
        break;

      case 'certificates':
        required('name', 'Certificate Name');
        isUrl('credentialUrl');
        checkDateRange('issueDate', 'expirationDate');
        break;

      case 'awards':
        required('title', 'Award Title');
        break;

      case 'references':
        required('name', 'Reference Name');
        isEmail('email');
        isPhone('phone');
        break;

      case 'custom':
        required('title', 'Section Title');
        break;

      default:
        break;
    }

    return { isValid, errors };
  }
}

export default ValidationService;
