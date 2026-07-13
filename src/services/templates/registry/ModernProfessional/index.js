import { createBaseRenderer } from '../BaseRenderer';

const renderer = createBaseRenderer('modern-professional-container');
const styles = `
  .modern-professional-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: var(--font-family, 'Helvetica, sans-serif');
    color: var(--text-color, #333);
  }
  .modern-professional-container .personal-info {
    text-align: left;
    border-left: 4px solid var(--primary-color, #0056b3);
    padding-left: 20px;
    margin-bottom: 2em;
  }
  .modern-professional-container h1 { color: var(--primary-color, #0056b3); margin: 0; }
  .modern-professional-container section h3 {
    color: var(--accent-color, #0056b3);
    border-bottom: 2px solid var(--primary-color, #0056b3);
    padding-bottom: 5px;
  }
  .skills-list { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0; }
  .skills-list li { background: var(--primary-color, #eee); color: #fff; padding: 5px 10px; border-radius: 4px; font-size: 0.9em; }
`;

export default {
  id: 'modern-professional',
  name: 'Modern Professional',
  category: 'Modern',
  thumbnail: 'modern-thumb.png',
  preview: 'modern-preview.png',
  supportedSections: ['personal', 'summary', 'experience', 'education', 'skills'],
  supportsPhoto: true,
  supportsQR: true,
  supportsMultiPage: true,
  supportsColor: true,
  ATSFriendly: true,
  Premium: false,
  renderer,
  styles
};
