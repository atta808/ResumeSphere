import * as SecureStore from 'expo-secure-store';
import TokenManager from './TokenManager';

const SESSION_KEY = '@auth_session';

class SessionManager {
  constructor() {
    this.currentUser = null;
  }

  async saveSession(user) {
    this.currentUser = user;
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(user));
  }

  async restoreSession() {
    const sessionStr = await SecureStore.getItemAsync(SESSION_KEY);
    if (sessionStr) {
      this.currentUser = JSON.parse(sessionStr);
      // Ensure tokens are still valid/present
      const hasTokens = await TokenManager.hasValidTokens();
      if (!hasTokens) {
        await this.clearSession();
      }
    }
    return this.currentUser;
  }

  async clearSession() {
    this.currentUser = null;
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

export default new SessionManager();
