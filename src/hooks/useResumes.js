import { useState, useCallback } from 'react';
import ResumeService from '../services/resume/ResumeService';
import ErrorHandler from '../services/ErrorHandler';

export const useResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadResumes = useCallback(async (includeArchived = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = includeArchived
        ? await ResumeService.getArchivedResumes()
        : await ResumeService.getActiveResumes();
      setResumes(data);
    } catch (err) {
      setError(ErrorHandler.process(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const searchResumes = useCallback(async (query) => {
    setLoading(true);
    try {
      const data = await ResumeService.searchResumes(query);
      setResumes(data);
    } catch (err) {
       setError(ErrorHandler.process(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const createResume = useCallback(async (resumeData) => {
    try {
      setLoading(true);
      const created = await ResumeService.createResume(resumeData);
      setResumes((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(ErrorHandler.process(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateResume = useCallback(async (id, newName) => {
    try {
      setLoading(true);
      const duplicated = await ResumeService.duplicateResume(id, newName);
      setResumes((prev) => [duplicated, ...prev]);
      return duplicated;
    } catch (err) {
      setError(ErrorHandler.process(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResume = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const updated = await ResumeService.updateResume(id, data);
      setResumes((prev) => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      setError(ErrorHandler.process(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const archiveResume = useCallback(async (id, isArchived) => {
    try {
      setLoading(true);
      const updated = await ResumeService.toggleArchiveResume(id, isArchived);
      setResumes((prev) => prev.filter(r => r.id !== id)); // Remove from current view
      return updated;
    } catch (err) {
      setError(ErrorHandler.process(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteResume = useCallback(async (id) => {
    try {
      setLoading(true);
      await ResumeService.deleteResume(id);
      setResumes((prev) => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(ErrorHandler.process(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    resumes,
    loading,
    error,
    loadResumes,
    searchResumes,
    createResume,
    duplicateResume,
    updateResume,
    archiveResume,
    deleteResume
  };
};

export default useResumes;
