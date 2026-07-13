import { createBaseRenderer } from '../BaseRenderer';

const renderer = createBaseRenderer('creative-container');
const styles = `
  .creative-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: var(--font-family, 'Poppins, sans-serif');
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
  }
  .creative-container .personal-info, .creative-container .skills {
    grid-column: 1;
    background: var(--primary-color, #f4f4f4);
    padding: 20px;
    border-radius: 8px;
  }
  .creative-container .summary, .creative-container .experience, .creative-container .education {
    grid-column: 2;
  }
  .creative-container h1 { font-size: 2em; line-height: 1.1; }
  .skills-list { padding-left: 15px; }
`;

export default {
  id: 'creative',
  name: 'Creative',
  category: 'Creative',
  thumbnail: 'creative-thumb.png',
  preview: 'creative-preview.png',
  supportedSections: ['personal', 'summary', 'experience', 'education', 'skills'],
  supportsPhoto: true,
  supportsQR: true,
  supportsMultiPage: true,
  supportsColor: true,
  ATSFriendly: false, // Grid layout might fail some old ATS
  Premium: false,
  renderer,
  styles
};
