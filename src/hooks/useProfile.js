import { useState, useCallback, useEffect } from 'react';
import ProfileService from '../services/profile/ProfileService';
import ErrorHandler from '../services/ErrorHandler';

export const useProfile = (profileId = null) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        const data = await ProfileService.getFullProfile(id);
        setProfile(data);
      }
    } catch (err) {
      setError(ErrorHandler.process(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profileId) {
      loadProfile(profileId);
    }
  }, [profileId, loadProfile]);

  const saveProfile = async (profileData) => {
    try {
      setLoading(true);
      const saved = await ProfileService.saveProfile(profileData);
      setProfile((prev) => ({ ...prev, ...saved }));
      return saved;
    } catch (err) {
      setError(ErrorHandler.process(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, loadProfile, saveProfile };
};
