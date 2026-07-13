import SkillGapAnalyzer from './SkillGapAnalyzer';
import CareerRoadmapEngine from './CareerRoadmapEngine';
import LearningRecommendationEngine from './LearningRecommendationEngine';
import CertificationEngine from './CertificationEngine';
import SalaryInsightEngine from './SalaryInsightEngine';
import PromotionReadinessEngine from './PromotionReadinessEngine';
import CareerSwitchEngine from './CareerSwitchEngine';
import CareerProgressTracker from './CareerProgressTracker';

class CareerEngine {
  constructor() {
    this.skillGapAnalyzer = SkillGapAnalyzer;
    this.roadmapEngine = CareerRoadmapEngine;
    this.learningEngine = LearningRecommendationEngine;
    this.certificationEngine = CertificationEngine;
    this.salaryEngine = SalaryInsightEngine;
    this.promotionEngine = PromotionReadinessEngine;
    this.switchEngine = CareerSwitchEngine;
    this.progressTracker = CareerProgressTracker;
  }

  async generateFullPlan(context, sessionId) {
    // 1. Analyze Skills First (dependency for Learning Plan)
    const skillGapAnalysis = await this.skillGapAnalyzer.analyze(context, sessionId);

    // 2. Generate parallel requests for performance
    let specializedInsightsPromise = Promise.resolve(null);
    if (context.goal?.goalType === 'PROMOTION') {
        specializedInsightsPromise = this.promotionEngine.evaluate(context, sessionId);
    } else if (context.goal?.goalType === 'CAREER_SWITCH') {
        specializedInsightsPromise = this.switchEngine.planSwitch(context, sessionId);
    }

    const [roadmap, learningPlan, certifications, salaryInsights, specializedInsights] = await Promise.all([
        this.roadmapEngine.generateRoadmap(context, sessionId),
        this.learningEngine.generateLearningPlan(context, skillGapAnalysis.missingSkills || [], sessionId),
        this.certificationEngine.recommendCertifications(context, sessionId),
        this.salaryEngine.getInsights(context, sessionId),
        specializedInsightsPromise
    ]);

    return {
      skillGapAnalysis,
      roadmap,
      learningPlan,
      certifications,
      salaryInsights,
      specializedInsights
    };
  }
}

export default new CareerEngine();
