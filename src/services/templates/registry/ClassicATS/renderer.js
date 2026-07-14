import SectionRenderer from '../../SectionRenderer';

export default function render(resume, customization) {
  const { profile = {}, experience = [], education = [], skills = [] } = resume || {};

  // Combine all sections using SectionRenderer
  const sections = [
    SectionRenderer.renderPersonal(profile, customization),
    SectionRenderer.renderSummary(profile, customization),
    SectionRenderer.renderExperience(experience, customization),
    SectionRenderer.renderEducation(education, customization),
    SectionRenderer.renderSkills(skills, customization)
  ].filter(Boolean).join('\n');

  return `
    <div class="classic-ats-container">
      ${sections}
    </div>
  `;
}
