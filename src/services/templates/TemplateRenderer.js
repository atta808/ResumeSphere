import ThemeMapper from './ThemeMapper';
import LayoutEngine from './LayoutEngine';
import TemplateRegistry from './TemplateRegistry';

class TemplateRenderer {
  constructor() {
    this.cache = new Map();
  }

  generateHTML(resume, theme, customization, templateId) {
    const template = TemplateRegistry.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Cache key could be based on stringified data if full caching needed.
    // For now we just re-run the pure function template.renderer
    const cssVariables = ThemeMapper.getCSSVariables(theme, customization);
    const layoutStyles = LayoutEngine.getPageStyles(customization);
    const templateStyles = template.styles || '';

    const contentHtml = template.renderer(resume, customization);

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ${cssVariables}
          ${layoutStyles}
          ${templateStyles}
          /* Generic body typography fallbacks */
          body {
            font-family: var(--font-family);
            font-size: var(--font-size-base);
            color: var(--text-color);
            background-color: var(--background-color);
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          ${contentHtml}
        </div>
      </body>
      </html>
    `;
  }
}

export default new TemplateRenderer();
