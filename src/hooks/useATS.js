import { useState, useCallback } from 'react';
import ATSService from '../services/ats/ATSService';
import { useToast } from '../components/common/ToastProvider';

export const useATS = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  const analyze = useCallback(async (resumeId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ATSService.analyzeResume(resumeId);
      setReport(result);
      return result;
    } catch (err) {
      setError(err);
      toast.showError('Failed to analyze resume. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    report,
    error,
    analyze
  };
};
