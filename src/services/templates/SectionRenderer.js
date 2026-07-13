class SectionRenderer {
  static renderPersonal(data, customization) {
    if (!data) return '';
    const name = data.fullName ? `<h1>${data.fullName}</h1>` : '';
    const title = data.professionalTitle ? `<h2>${data.professionalTitle}</h2>` : '';
    const email = data.email ? `<span>${data.email}</span>` : '';
    const phone = data.phone ? `<span>${data.phone}</span>` : '';
    const location = (data.city || data.country) ? `<span>${[data.city, data.country].filter(Boolean).join(', ')}</span>` : '';

    // Quick info row
    const info = [email, phone, location].filter(Boolean).join(' | ');

    return `
      <section class="personal-info">
        ${name}
        ${title}
        ${info ? `<div class="contact-info">${info}</div>` : ''}
      </section>
    `;
  }

  static renderSummary(data, customization) {
    if (!data?.summary) return '';
    return `
      <section class="summary">
        <h3>Summary</h3>
        <p>${data.summary}</p>
      </section>
    `;
  }

  static renderExperience(dataList, customization) {
    if (!dataList || dataList.length === 0) return '';
    const items = dataList.map(item => `
      <article class="experience-item">
        <div class="header">
          <strong>${item.position}</strong> at ${item.company}
          <span class="dates">${item.startDate || ''} - ${item.isCurrent ? 'Present' : (item.endDate || '')}</span>
        </div>
        <p>${item.description || ''}</p>
      </article>
    `).join('');

    return `
      <section class="experience">
        <h3>Experience</h3>
        ${items}
      </section>
    `;
  }

  static renderEducation(dataList, customization) {
    if (!dataList || dataList.length === 0) return '';
    const items = dataList.map(item => `
      <article class="education-item">
        <div class="header">
          <strong>${item.degree} in ${item.fieldOfStudy}</strong>
          <span class="dates">${item.startDate || ''} - ${item.isCurrent ? 'Present' : (item.endDate || '')}</span>
        </div>
        <div>${item.institution}</div>
      </article>
    `).join('');

    return `
      <section class="education">
        <h3>Education</h3>
        ${items}
      </section>
    `;
  }

  static renderSkills(dataList, customization) {
    if (!dataList || dataList.length === 0) return '';
    const items = dataList.map(item => `<li>${item.name}</li>`).join('');

    return `
      <section class="skills">
        <h3>Skills</h3>
        <ul class="skills-list">
          ${items}
        </ul>
      </section>
    `;
  }
}

export default SectionRenderer;
