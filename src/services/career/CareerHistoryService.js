import CareerHistoryRepository from './CareerHistoryRepository';

class CareerHistoryService {
  async logAction(goalId, action, description, provider = null, model = null) {
    return CareerHistoryRepository.logAction(goalId, action, description, provider, model);
  }

  async getHistory(goalId) {
    return CareerHistoryRepository.getHistory(goalId);
  }
}

export default new CareerHistoryService();
