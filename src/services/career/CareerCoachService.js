import * as Crypto from 'expo-crypto';
import CareerEngine from './CareerEngine';
import CareerGoalService from './CareerGoalService';
import CareerRepository from './CareerRepository';
import AIHistoryService from '../ai/AIHistoryService';
import CareerHistoryService from './CareerHistoryService';
import ProfileService from '../profile/ProfileService';
import { CAREER_CONFIG } from '../../config/career';

class CareerCoachService {
  async getDashboardState(profileId, goalId = null) {
    let goal = null;
    let goals = await CareerGoalService.getGoals(profileId);

    if (goals.length > 0) {
      if (goalId) {
        goal = goals.find(g => g.id === goalId) || goals[0];
      } else {
        goal = goals[0];
      }
    }

    if (!goal) {
      return {
        hasGoal: false,
        goals: [],
        score: 0,
        roadmap: [],
        certifications: [],
        learningPlan: [],
        salaryInsights: null,
      };
    }

    // Load cached recommendations and learning progress
    const roadmap = await CareerRepository.getRecommendations(goal.id, 'ROADMAP');
    const certifications = await CareerRepository.getRecommendations(goal.id, 'CERTIFICATION');
    const skillGaps = await CareerRepository.getRecommendations(goal.id, 'SKILL_GAP');
    const learningPlan = await CareerRepository.getLearningPlan(goal.id);

    const history = await CareerHistoryService.getHistory(goal.id);

    let specialInsights = null;
    try {
        specialInsights = await CareerRepository.getRecommendations(goal.id, 'SPECIALIZED');
    } catch (e) {}

    // Calculate Score (Mock implementation for now, should pull real metrics)
    const metrics = {
      RESUME_QUALITY: 80,
      ATS_SCORE: 75,
      JOB_MATCH: 70,
      INTERVIEW_SCORE: 65,
      SKILLS: 85,
      CERTIFICATIONS: learningPlan.filter(l => l.status === 'COMPLETED').length > 0 ? 100 : 50,
      LEARNING_PROGRESS: learningPlan.length > 0 ? (learningPlan.filter(l => l.status === 'COMPLETED').length / learningPlan.length) * 100 : 0,
      CAREER_COMPLETENESS: 90
    };
    const score = CareerEngine.progressTracker.calculateOverallScore(metrics, CAREER_CONFIG.WEIGHTS);

    return {
      hasGoal: true,
      currentGoal: goal,
      goals,
      score,
      roadmap,
      certifications,
      skillGaps,
      learningPlan,
      promotionReadiness: specialInsights && specialInsights.length > 0 && goal.goalType === 'PROMOTION' ? JSON.parse(specialInsights[0].description) : null,
      history,
    };
  }

  async getSalaryInsights(context) {
      // Proxy call so UI doesn't call engines directly
      return CareerEngine.salaryEngine.getInsights(context);
  }

  async updateLearningProgress(id, updates) {
      // Proxy call so UI doesn't use repository directly
      return CareerRepository.updateLearningProgress(id, updates);
  }

  async createGoal(profileId, goalData) {
      return CareerGoalService.createGoal(profileId, goalData);
  }

  async updateGoal(goalId, updates) {
      return CareerGoalService.updateGoal(goalId, updates);
  }

  async generateCareerPlan(profileId, goalId) {
    const profile = await ProfileService.getFullProfile(profileId);
    const goal = await CareerGoalService.getGoalById(goalId);

    if (!profile || !goal) throw new Error("Profile or Goal not found");

    // Create a new AI Session for this generation
    const sessionId = Crypto.randomUUID();
    await AIHistoryService.createSession(profileId, `Career Plan: ${goal.title}`, sessionId);

    const context = {
      profile,
      experience: profile.experience || [],
      skills: profile.skills || [],
      education: profile.education || [],
      goal
    };

    // Run Engine
    const fullPlan = await CareerEngine.generateFullPlan(context, sessionId);

    // Parse and Store Results (Convert AI output to database schema format)

    // Roadmap
    if (fullPlan.roadmap && fullPlan.roadmap.roadmap) {
       const roadmapRecs = fullPlan.roadmap.roadmap.map(item => ({
          category: 'ROADMAP',
          title: item.title,
          description: item.description,
          priority: item.priority,
          estimatedImpact: item.estimatedCompletionTime
       }));
       await CareerRepository.createRecommendations(goalId, roadmapRecs);
    }

    // Certifications
    if (fullPlan.certifications && fullPlan.certifications.certifications) {
      const certRecs = fullPlan.certifications.certifications.map(item => ({
          category: 'CERTIFICATION',
          title: item.title,
          description: item.description || item.provider,
          priority: item.priority,
          estimatedImpact: item.estimatedImpact,
          provider: item.provider
       }));
       await CareerRepository.createRecommendations(goalId, certRecs);
    }

    // Skill Gaps
    if (fullPlan.skillGapAnalysis && fullPlan.skillGapAnalysis.missingSkills) {
      const skillRecs = fullPlan.skillGapAnalysis.missingSkills.map(item => ({
          category: 'SKILL_GAP',
          title: item.skillName,
          description: item.reasoning,
          priority: item.priority,
          estimatedImpact: item.estimatedLearningTime
       }));
       await CareerRepository.createRecommendations(goalId, skillRecs);
    }

    // Learning Plan
    if (fullPlan.learningPlan && fullPlan.learningPlan.learningPlan) {
      const lp = fullPlan.learningPlan.learningPlan.map(item => ({
         skillName: item.skillName,
         resourceType: item.resourceType,
         resourceName: item.recommendedResource,
         estimatedHours: item.estimatedHours
      }));
      await CareerRepository.createLearningPlan(goalId, lp);
    }

    // Specialized Insights (Promotion/Switch)
    if (fullPlan.specializedInsights) {
        await CareerRepository.createRecommendations(goalId, [{
            category: 'SPECIALIZED',
            title: 'Specialized Plan',
            description: JSON.stringify(fullPlan.specializedInsights),
            priority: 'High',
            status: 'COMPLETED'
        }]);
    }

    // Log generation
    await CareerGoalService.updateGoal(goalId, { status: 'ACTIVE' }); // bump updated at

    return this.getDashboardState(profileId, goalId);
  }
}

export default new CareerCoachService();
