class TemplateRegistry {
  constructor() {
    this.templates = new Map();
  }

  register(template) {
    if (!template || !template.id) {
      throw new Error('Template must have a valid id');
    }
    this.templates.set(template.id, template);
  }

  getTemplate(id) {
    return this.templates.get(id);
  }

  getAllTemplates() {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category) {
    return this.getAllTemplates().filter(t => t.category === category);
  }
}

export default new TemplateRegistry();
