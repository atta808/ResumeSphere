import { useState, useCallback } from 'react';
import JobMatchingService from '../services/jobMatching/JobMatchingService';
import ErrorHandler from '../services/ErrorHandler';

export const useJobMatches = () => {
  const [matchHistory, setMatchHistory] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMatchHistory = useCallback(async (resumeId) => {
    setLoading(true);
    setError(null);
    try {
      const matches = await JobMatchingService.getMatchHistoryByResume(resumeId);
      setMatchHistory(matches);
    } catch (err) {
      setError(err);
      ErrorHandler.logError(err, { context: 'useJobMatches.loadMatchHistory' });
    } finally {
      setLoading(false);
    }
  }, []);

  const performMatch = useCallback(async (resumeId, jobDescriptionId) => {
    setLoading(true);
    setError(null);
    try {
      const match = await JobMatchingService.performMatch(resumeId, jobDescriptionId);
      setCurrentMatch(match);
      // Optimistically update history
      setMatchHistory((prev) => [match, ...prev.filter(m => m.id !== match.id)]);
      return match;
    } catch (err) {
      setError(err);
      ErrorHandler.logError(err, { context: 'useJobMatches.performMatch' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMatch = useCallback(async (id) => {
     setLoading(true);
     setError(null);
     try {
       const match = await JobMatchingService.getMatchById(id);
       setCurrentMatch(match);
       return match;
     } catch (err) {
        setError(err);
        ErrorHandler.logError(err, { context: 'useJobMatches.getMatch' });
        return null;
     } finally {
        setLoading(false);
     }
  }, []);

  return {
    matchHistory,
    currentMatch,
    loading,
    error,
    loadMatchHistory,
    performMatch,
    getMatch,
  };
};
