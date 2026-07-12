class BaseATSAnalyzer {
  constructor(config) {
    this.config = config;
    this.score = 0;
    this.warnings = [];
    this.strengths = [];
    this.recommendations = [];
    this.processingTime = 0;
  }

  async analyze(resumeData) {
    throw new Error('BaseATSAnalyzer.analyze() must be implemented by subclasses');
  }

  validate(resumeData) {
    if (!resumeData) throw new Error('Resume data is required for analysis');
  }

  getScore() {
    return this.score;
  }

  getRecommendations() {
    return this.recommendations;
  }

  addRecommendation(title, description, priority, scoreImpact, section, futureAIAction = null) {
      this.recommendations.push({
          title,
          description,
          priority,
          scoreImpact,
          section,
          futureAIAction
      });
  }
}

export default BaseATSAnalyzer;
