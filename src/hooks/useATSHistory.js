import { useState, useCallback } from 'react';
import ATSHistoryRepository from '../repositories/ATSHistoryRepository';
import { useToast } from '../components/common/ToastProvider';

export const useATSHistory = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const toast = useToast();

  const loadHistory = useCallback(async (resumeId, limit = 5) => {
    setLoading(true);
    try {
      const records = await ATSHistoryRepository.getHistoryForResume(resumeId, limit);
      setHistory(records);
      return records;
    } catch (err) {
      console.error(err);
      toast.showError('Failed to load ATS history.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    history,
    loadHistory
  };
};
