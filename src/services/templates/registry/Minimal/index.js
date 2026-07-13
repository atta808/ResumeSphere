import { createBaseRenderer } from '../BaseRenderer';

const renderer = createBaseRenderer('minimal-container');
const styles = `
  .minimal-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: var(--font-family, 'Inter, sans-serif');
    font-weight: 300;
  }
  .minimal-container .personal-info {
    margin-bottom: 3em;
  }
  .minimal-container h1 { font-weight: 200; font-size: 3em; margin: 0 0 10px 0; }
  .minimal-container section h3 {
    font-weight: 400;
    text-transform: lowercase;
    color: var(--primary-color, #666);
    margin-bottom: 1.5em;
  }
  .skills-list { list-style: none; padding: 0; }
  .skills-list li { display: inline-block; margin-right: 15px; color: #555; }
`;

export default {
  id: 'minimal',
  name: 'Minimal',
  category: 'Modern',
  thumbnail: 'minimal-thumb.png',
  preview: 'minimal-preview.png',
  supportedSections: ['personal', 'summary', 'experience', 'education', 'skills'],
  supportsPhoto: true,
  supportsQR: false,
  supportsMultiPage: true,
  supportsColor: true,
  ATSFriendly: true,
  Premium: false,
  renderer,
  styles
};
