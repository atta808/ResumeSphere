import { useState, useCallback } from 'react';
import AIHistoryService from '../services/ai/AIHistoryService';
import ErrorHandler from '../services/ErrorHandler';

export const useAIHistory = (profileId) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async (resumeId = null) => {
    if (!profileId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await AIHistoryService.getSessions(profileId, resumeId);
      setSessions(data);
    } catch (err) {
      ErrorHandler.logError(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [profileId]);

  const loadSession = useCallback(async (sessionId) => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const sessionData = await AIHistoryService.getSessionWithMessages(sessionId);
      if (sessionData) {
        setCurrentSession(sessionData);
        setMessages(sessionData.messages || []);
      }
    } catch (err) {
      ErrorHandler.logError(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSession = useCallback(async (resumeId, title = 'New Conversation') => {
    setIsLoading(true);
    setError(null);
    try {
      const newSession = await AIHistoryService.createSession(profileId, resumeId, title);
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
      return newSession;
    } catch (err) {
      ErrorHandler.logError(err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [profileId]);

  const deleteSession = useCallback(async (sessionId) => {
    setIsLoading(true);
    setError(null);
    try {
      await AIHistoryService.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch (err) {
      ErrorHandler.logError(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentSession]);

  const clearAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await AIHistoryService.clearAllHistory(profileId);
      setSessions([]);
      setCurrentSession(null);
      setMessages([]);
    } catch (err) {
      ErrorHandler.logError(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [profileId]);

  return {
    sessions,
    currentSession,
    messages,
    isLoading,
    error,
    fetchSessions,
    loadSession,
    createSession,
    deleteSession,
    clearAll,
  };
};
