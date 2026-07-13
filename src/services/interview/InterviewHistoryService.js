import InterviewRepository from './InterviewRepository';

class InterviewHistoryService {
  async getHistory() {
    return await InterviewRepository.getAllSessions();
  }

  async getSessionDetails(sessionId) {
    const session = await InterviewRepository.getSessionById(sessionId);
    const questions = await InterviewRepository.getQuestionsBySessionId(sessionId);
    const answers = await InterviewRepository.getAnswersBySessionId(sessionId);

    return {
      session,
      questions,
      answers,
    };
  }

  async getProgressAnalytics() {
    const sessions = await InterviewRepository.getAllSessions();
    const completedSessions = sessions.filter(s => s.status === 'completed');

    if (completedSessions.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        bestScore: 0,
        timePracticed: 0,
        recentTrend: [],
      };
    }

    let totalScore = 0;
    let bestScore = 0;
    let timePracticed = 0;

    completedSessions.forEach(s => {
      totalScore += s.overallScore || 0;
      if ((s.overallScore || 0) > bestScore) bestScore = s.overallScore;
      timePracticed += s.duration || 0;
    });

    return {
      totalSessions: completedSessions.length,
      averageScore: Math.round(totalScore / completedSessions.length),
      bestScore,
      timePracticed,
      recentTrend: completedSessions.slice(0, 5).map(s => s.overallScore), // Last 5 scores
    };
  }
}

export default new InterviewHistoryService();
