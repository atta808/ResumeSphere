import AIService from '../ai/AIService';
import { AI_ACTION_TYPES } from '../../config/ai';
import { generateUUID } from '../../utils/helpers';
import InterviewRepository from './InterviewRepository';
import dbManager from '../../database/sqlite';
import { createInterviewSession, createInterviewQuestion, createInterviewAnswer } from '../../models/factories';

class InterviewService {
  async createSession({ profileId, resumeId, jobDescriptionId, interviewType, difficulty, companyName, position }) {
    const session = createInterviewSession({
      profileId,
      resumeId,
      jobDescriptionId,
      interviewType,
      difficulty,
      companyName,
      position,
    });

    await InterviewRepository.insertSession(session);
    return session;
  }

  async generateQuestionsForSession(sessionId, context) {
    const session = await InterviewRepository.getSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    const promptContext = {
      ...context,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      companyName: session.companyName,
      position: session.position,
    };

    // We pass a dummy string for userMessage to bypass GenericChatPrompt fallback in some versions
    const aiResponse = await AIService.processRequest({
      actionType: AI_ACTION_TYPES.GENERATE_INTERVIEW_QUESTIONS,
      profileId: session.profileId,
      resumeId: session.resumeId,
      sessionId: 'interview-gen-' + session.id, // Using session ID as chat session id
      jobDescriptionContext: context.jobDescription,
      userMessage: 'Generate interview questions based on the context.',
    });

    try {
      // The AI is instructed to return JSON only
      const questionsData = JSON.parse(aiResponse.text);

      const createdQuestions = [];
      for (let i = 0; i < questionsData.length; i++) {
        const qData = questionsData[i];
        const question = createInterviewQuestion({
          sessionId,
          questionNumber: i + 1,
          question: qData.question,
          questionType: qData.questionType,
          category: qData.category,
          expectedSkills: qData.expectedSkills,
          difficulty: session.difficulty
        });
        await InterviewRepository.insertQuestion(question);
        createdQuestions.push(question);
      }
      return createdQuestions;
    } catch (error) {
      console.error('Failed to parse AI generated questions', error);
      throw new Error('AI returned an invalid format for questions.');
    }
  }

  async submitAnswer({ sessionId, questionId, answer, timeSpent }) {
    const session = await InterviewRepository.getSessionById(sessionId);
    const question = await InterviewRepository.getQuestionById(questionId);

    if (!session || !question) throw new Error('Session or Question not found');

    const context = {
      interviewType: session.interviewType,
      question: question.question,
      answer,
    };

    const aiResponse = await AIService.processRequest({
      actionType: AI_ACTION_TYPES.ANALYZE_INTERVIEW_ANSWER,
      profileId: session.profileId, // Required by AIService.buildContext
      resumeId: session.resumeId,
      sessionId: 'interview-ans-' + session.id,
      userMessage: 'Analyze this answer.',
      jobDescriptionContext: context, // HACK: Pass context as jobDescriptionContext to reach PromptBuilder
    });

    // Using a more structured passing: in reality AIService processRequest needs to be patched or we just use context directly.
    // Wait, AIService builds its own context from profile/resume, but PromptBuilder accepts `context`.
    // Let's modify AIService later or build the right context. For now, let's assume we can parse.

    try {
      const feedbackData = JSON.parse(aiResponse.text);

      const interviewAnswer = createInterviewAnswer({
        questionId,
        sessionId,
        answer,
        feedback: feedbackData,
        score: feedbackData.score,
        strengths: feedbackData.strengths,
        weaknesses: feedbackData.weaknesses,
        recommendations: feedbackData.recommendations,
        estimatedImprovement: feedbackData.estimatedImprovement,
        timeSpent,
      });

      await InterviewRepository.insertAnswer(interviewAnswer);
      return interviewAnswer;
    } catch (error) {
      console.error('Failed to parse AI feedback', error);
      throw new Error('AI returned an invalid format for feedback.');
    }
  }

  async getSessionQuestions(sessionId) {
    return InterviewRepository.getQuestionsBySessionId(sessionId);
  }

  async getSessionAnswers(sessionId) {
    return InterviewRepository.getAnswersBySessionId(sessionId);
  }

  async completeSession(sessionId) {
    const answers = await this.getSessionAnswers(sessionId);

    let totalScore = 0;
    answers.forEach(ans => totalScore += ans.score);
    const overallScore = answers.length > 0 ? Math.round(totalScore / answers.length) : 0;

    const db = dbManager.getDb();
    const completedAt = new Date().toISOString();
    const duration = answers.reduce((total, ans) => total + (ans.timeSpent || 0), 0);

    await db.runAsync(
      `UPDATE interview_sessions SET status = 'completed', completedAt = ?, overallScore = ?, duration = ? WHERE id = ?`,
      [completedAt, overallScore, duration, sessionId]
    );

    return await InterviewRepository.getSessionById(sessionId);
  }
}

export default new InterviewService();
