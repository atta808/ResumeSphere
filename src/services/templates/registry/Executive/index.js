import { createBaseRenderer } from '../BaseRenderer';

const renderer = createBaseRenderer('executive-container');
const styles = `
  .executive-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Times New Roman', serif;
    color: var(--text-color, #222);
  }
  .executive-container .personal-info {
    text-align: center;
    border-top: 2px solid #222;
    border-bottom: 2px solid #222;
    padding: 20px 0;
    margin-bottom: 2em;
  }
  .executive-container h1 { margin: 0; font-size: 2.5em; letter-spacing: 2px; }
  .executive-container section h3 {
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 1em;
  }
`;

export default {
  id: 'executive',
  name: 'Executive',
  category: 'Traditional',
  thumbnail: 'executive-thumb.png',
  preview: 'executive-preview.png',
  supportedSections: ['personal', 'summary', 'experience', 'education', 'skills'],
  supportsPhoto: false,
  supportsQR: false,
  supportsMultiPage: true,
  supportsColor: true,
  ATSFriendly: true,
  Premium: false,
  renderer,
  styles
};
