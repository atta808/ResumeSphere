import CareerRepository from './CareerRepository';
import CareerHistoryService from './CareerHistoryService';

class CareerGoalService {
  async createGoal(profileId, goalData) {
    const goal = await CareerRepository.createGoal(profileId, goalData);
    await CareerHistoryService.logAction(goal.id, 'CREATED_GOAL', `Created career goal: ${goal.title}`);
    return goal;
  }

  async getGoals(profileId) {
    return CareerRepository.getGoalsByProfileId(profileId);
  }

  async getGoalById(id) {
    return CareerRepository.getGoalById(id);
  }

  async updateGoal(id, updates) {
    const goal = await CareerRepository.updateGoal(id, updates);
    await CareerHistoryService.logAction(id, 'UPDATED_GOAL', `Updated career goal status to ${updates.status || 'modified'}`);
    return goal;
  }

  async deleteGoal(id) {
    await CareerRepository.deleteGoal(id);
  }
}

export default new CareerGoalService();
