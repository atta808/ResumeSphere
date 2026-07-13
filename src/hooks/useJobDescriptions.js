import { useState, useCallback } from 'react';
import JobDescriptionService from '../services/jobMatching/JobDescriptionService';
import ErrorHandler from '../services/ErrorHandler';

export const useJobDescriptions = () => {
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [currentJobDescription, setCurrentJobDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAllJobDescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const jobs = await JobDescriptionService.getAllJobDescriptions();
      setJobDescriptions(jobs);
    } catch (err) {
      setError(err);
      ErrorHandler.logError(err, { context: 'useJobDescriptions.loadAllJobDescriptions' });
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobDescription = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const job = await JobDescriptionService.getJobDescriptionById(id);
      setCurrentJobDescription(job);
      return job;
    } catch (err) {
      setError(err);
      ErrorHandler.logError(err, { context: 'useJobDescriptions.getJobDescription' });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const importJobDescription = useCallback(async (rawText, metadata) => {
    setLoading(true);
    setError(null);
    try {
      const job = await JobDescriptionService.importJobDescription(rawText, metadata);
      setJobDescriptions((prev) => [job, ...prev]);
      setCurrentJobDescription(job);
      return job;
    } catch (err) {
      setError(err);
      ErrorHandler.logError(err, { context: 'useJobDescriptions.importJobDescription' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteJobDescription = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await JobDescriptionService.deleteJobDescription(id);
      setJobDescriptions((prev) => prev.filter((job) => job.id !== id));
      if (currentJobDescription && currentJobDescription.id === id) {
        setCurrentJobDescription(null);
      }
    } catch (err) {
      setError(err);
      ErrorHandler.logError(err, { context: 'useJobDescriptions.deleteJobDescription' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentJobDescription]);

  return {
    jobDescriptions,
    currentJobDescription,
    loading,
    error,
    loadAllJobDescriptions,
    getJobDescription,
    importJobDescription,
    deleteJobDescription,
  };
};
