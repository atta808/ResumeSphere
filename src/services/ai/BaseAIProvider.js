class BaseAIProvider {
  /**
   * Initializes the AI Provider
   */
  async initialize() {
    throw new Error('Method must be implemented');
  }

  /**
   * Generates resume content based on a prompt
   * @param {string} prompt
   */
  async generateResume(prompt) {
    throw new Error('Method must be implemented');
  }

  /**
   * Analyzes an existing resume
   * @param {Object} profile
   */
  async analyzeResume(profile) {
    throw new Error('Method must be implemented');
  }

  /**
   * Improves a specific section of a resume
   * @param {string} sectionContent
   */
  async improveSection(sectionContent) {
    throw new Error('Method must be implemented');
  }
}

export default BaseAIProvider;
