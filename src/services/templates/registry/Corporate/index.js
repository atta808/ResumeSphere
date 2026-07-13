import { createBaseRenderer } from '../BaseRenderer';

const renderer = createBaseRenderer('corporate-container');
const styles = `
  .corporate-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: var(--font-family, 'Arial, sans-serif');
    background: #fff;
  }
  .corporate-container .personal-info {
    background: var(--primary-color, #2c3e50);
    color: #fff;
    padding: 30px;
    text-align: center;
  }
  .corporate-container h1 { margin: 0; color: #fff; }
  .corporate-container section { padding: 0 30px; margin-top: 20px; }
  .corporate-container section h3 { color: var(--primary-color, #2c3e50); }
`;

export default {
  id: 'corporate',
  name: 'Corporate',
  category: 'Professional',
  thumbnail: 'corporate-thumb.png',
  preview: 'corporate-preview.png',
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
