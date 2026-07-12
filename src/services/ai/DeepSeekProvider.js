import BaseAIProvider from './BaseAIProvider';

class DeepSeekProvider extends BaseAIProvider {
  async initialize() {
    throw new Error('DeepSeekProvider initialization not yet implemented');
  }

  async generateResume(prompt) {
    throw new Error('DeepSeekProvider generateResume not yet implemented');
  }

  async analyzeResume(profile) {
    throw new Error('DeepSeekProvider analyzeResume not yet implemented');
  }

  async improveSection(sectionContent) {
    throw new Error('DeepSeekProvider improveSection not yet implemented');
  }
}

export default DeepSeekProvider;
