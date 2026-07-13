import { createBaseRenderer } from '../BaseRenderer';

const renderer = createBaseRenderer('international-container');
const styles = `
  .international-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: var(--font-family, 'Roboto, sans-serif');
    display: flex;
    flex-direction: column;
  }
  .international-container .personal-info {
    display: flex;
    align-items: center;
    border-bottom: 3px solid var(--primary-color, #e74c3c);
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  .international-container h1 { flex-grow: 1; }
  .international-container section h3 {
    background: var(--primary-color, #e74c3c);
    color: #fff;
    display: inline-block;
    padding: 5px 15px;
    border-radius: 4px;
  }
`;

export default {
  id: 'international',
  name: 'International',
  category: 'Modern',
  thumbnail: 'international-thumb.png',
  preview: 'international-preview.png',
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
