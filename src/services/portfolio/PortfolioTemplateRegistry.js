export class PortfolioTemplateRegistry {
  constructor() {
    this.templates = [
      { id: 'classic', name: 'Classic', description: 'A timeless, professional layout suitable for any industry.' },
      { id: 'modern', name: 'Modern', description: 'Clean, bold, and contemporary design.' },
      { id: 'developer', name: 'Developer', description: 'Optimized for highlighting tech stack and GitHub projects.' },
      { id: 'executive', name: 'Executive', description: 'Elegant and leadership-focused design.' }
    ];
  }

  getTemplates() {
    return this.templates;
  }

  getTemplateById(id) {
    return this.templates.find(t => t.id === id);
  }

  // Future: provide the actual HTML/JSX structure for each template
  // For now, PortfolioRenderer handles a unified responsive HTML generation.
}
