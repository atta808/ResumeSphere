export class PortfolioRenderer {
  constructor(themeEngine) {
    this.themeEngine = themeEngine;
  }

  /**
   * Generates responsive HTML based on the user's resume data and portfolio settings.
   */
  generateHTML(resumeData, settings, templateId = 'classic') {
    const cssVars = this.themeEngine.buildCSSVariables(settings);

    // Generate sections dynamically based on settings.sectionOrder and hiddenSections
    const defaultSections = ['about', 'experience', 'education', 'skills', 'projects'];
    let order = settings?.sectionOrder?.length ? settings.sectionOrder : defaultSections;
    const hidden = settings?.hiddenSections || [];

    // Filter out hidden sections
    order = order.filter(section => !hidden.includes(section));

    const contentHtml = order.map(section => this._renderSection(section, resumeData)).join('\n');

    return `
<!DOCTYPE html>
<html lang="${settings?.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeData?.basics?.name || 'Portfolio'}</title>
  <style>
    ${cssVars}
    body {
      font-family: var(--font-family);
      background-color: var(--bg-color);
      color: var(--text-color);
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }
    header {
      text-align: center;
      padding: 3rem 0;
      border-bottom: 1px solid var(--border-color);
    }
    h1 {
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }
    .contact-info {
      color: var(--accent-color);
    }
    section {
      margin: 3rem 0;
    }
    h2 {
      border-bottom: 2px solid var(--primary-color);
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
      display: inline-block;
    }
    .item {
      margin-bottom: 1.5rem;
      background: var(--surface-color);
      padding: 1.5rem;
      border-radius: 8px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.5rem;
    }
    .item-title {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .item-subtitle {
      font-style: italic;
      color: var(--accent-color);
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .skill-badge {
      background: var(--primary-color);
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }
    @media (max-width: 600px) {
      .container { padding: 1rem; }
      .item-header { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${resumeData?.basics?.name || 'Your Name'}</h1>
      <div class="contact-info">
        ${resumeData?.basics?.email ? `<span>${resumeData.basics.email}</span>` : ''}
        ${resumeData?.basics?.phone ? ` | <span>${resumeData.basics.phone}</span>` : ''}
      </div>
    </header>
    ${contentHtml}
  </div>
</body>
</html>
    `;
  }

  _renderSection(sectionType, resumeData) {
    switch (sectionType) {
      case 'about':
        if (!resumeData?.basics?.summary) return '';
        return `
          <section id="about">
            <h2>About</h2>
            <p>${resumeData.basics.summary}</p>
          </section>
        `;
      case 'experience':
        if (!resumeData?.work?.length) return '';
        return `
          <section id="experience">
            <h2>Experience</h2>
            ${resumeData.work.map(w => `
              <div class="item">
                <div class="item-header">
                  <span class="item-title">${w.position} at ${w.company}</span>
                  <span>${w.startDate} - ${w.endDate || 'Present'}</span>
                </div>
                <p>${w.summary || ''}</p>
              </div>
            `).join('')}
          </section>
        `;
      case 'education':
        if (!resumeData?.education?.length) return '';
        return `
          <section id="education">
            <h2>Education</h2>
            ${resumeData.education.map(e => `
              <div class="item">
                <div class="item-header">
                  <span class="item-title">${e.institution}</span>
                  <span>${e.startDate} - ${e.endDate || 'Present'}</span>
                </div>
                <div class="item-subtitle">${e.studyType} in ${e.area}</div>
              </div>
            `).join('')}
          </section>
        `;
      case 'skills':
        if (!resumeData?.skills?.length) return '';
        return `
          <section id="skills">
            <h2>Skills</h2>
            <div class="skills-list">
              ${resumeData.skills.map(s => `<span class="skill-badge">${s.name}</span>`).join('')}
            </div>
          </section>
        `;
      case 'projects':
        if (!resumeData?.projects?.length) return '';
        return `
          <section id="projects">
            <h2>Projects</h2>
            ${resumeData.projects.map(p => `
              <div class="item">
                <div class="item-title">${p.name}</div>
                <p>${p.description}</p>
              </div>
            `).join('')}
          </section>
        `;
      default:
        return '';
    }
  }
}
