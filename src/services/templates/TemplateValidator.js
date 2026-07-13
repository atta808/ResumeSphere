class TemplateValidator {
  static validate(template) {
    const requiredProps = [
      'id', 'name', 'category', 'thumbnail', 'renderer'
    ];

    for (const prop of requiredProps) {
      if (!template[prop]) {
        return { isValid: false, error: `Missing required property: ${prop}` };
      }
    }

    if (typeof template.renderer !== 'function') {
      return { isValid: false, error: 'Renderer must be a function' };
    }

    return { isValid: true };
  }
}

export default TemplateValidator;
