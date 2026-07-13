import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import ENV from '../config/env';
import AuthService from '../services/auth/AuthService';
import SessionManager from '../services/auth/SessionManager';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: ENV.GOOGLE_WEB_CLIENT_ID || 'dummy-web-client-id.apps.googleusercontent.com',
  });

  useEffect(() => {
    setUser(SessionManager.getCurrentUser());
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      AuthService.signInWithGoogle(id_token).then(() => {
        setUser(SessionManager.getCurrentUser());
      }).catch(err => {
        console.error('Failed to sign in with Google', err);
      });
    }
  }, [response]);

  const signInWithGoogle = async () => {
    await promptAsync();
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(SessionManager.getCurrentUser());
  };

  return {
    user,
    signInWithGoogle,
    signOut
  };
};
