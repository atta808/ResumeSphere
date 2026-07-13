import { createBaseRenderer } from '../BaseRenderer';

const renderer = createBaseRenderer('academic-container');
const styles = `
  .academic-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Garamond', serif;
    line-height: 1.6;
  }
  .academic-container h1 { text-align: center; }
  .academic-container .contact-info { text-align: center; font-style: italic; margin-bottom: 2em; }
  .academic-container section h3 {
    text-transform: uppercase;
    font-weight: bold;
    border-bottom: 2px solid #000;
  }
  .education-item, .experience-item { margin-bottom: 1.5em; }
`;

export default {
  id: 'academic',
  name: 'Academic CV',
  category: 'Academic',
  thumbnail: 'academic-thumb.png',
  preview: 'academic-preview.png',
  supportedSections: ['personal', 'summary', 'education', 'experience', 'skills'],
  supportsPhoto: false,
  supportsQR: false,
  supportsMultiPage: true,
  supportsColor: false,
  ATSFriendly: true,
  Premium: false,
  renderer,
  styles
};
