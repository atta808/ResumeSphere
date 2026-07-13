import InterviewService from './InterviewService';
import InterviewHistoryService from './InterviewHistoryService';

// Central orchestrator exposing needed methods cleanly to UI/Hooks
class InterviewEngine {
  constructor() {
    this.service = InterviewService;
    this.history = InterviewHistoryService;
  }

  async startNewSession(config) {
    return await this.service.createSession(config);
  }

  async generateQuestions(sessionId, context) {
    return await this.service.generateQuestionsForSession(sessionId, context);
  }

  async submitAnswer(answerData) {
    return await this.service.submitAnswer(answerData);
  }

  async finishSession(sessionId) {
    return await this.service.completeSession(sessionId);
  }

  async getSessionQuestions(sessionId) {
    return await this.service.getSessionQuestions(sessionId);
  }

  async getSessionAnswers(sessionId) {
    return await this.service.getSessionAnswers(sessionId);
  }

  async getHistory() {
    return await this.history.getHistory();
  }

  async getSessionDetails(sessionId) {
    return await this.history.getSessionDetails(sessionId);
  }

  async getAnalytics() {
    return await this.history.getProgressAnalytics();
  }
}

export default new InterviewEngine();
