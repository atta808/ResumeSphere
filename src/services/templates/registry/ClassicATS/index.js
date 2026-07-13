import renderer from './renderer';
import styles from './styles';

export default {
  id: 'classic-ats',
  name: 'Classic ATS',
  category: 'Professional',
  thumbnail: 'classic-ats-thumb.png',
  preview: 'classic-ats-preview.png',
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
