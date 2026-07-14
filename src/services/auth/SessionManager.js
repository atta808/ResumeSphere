import { SECURE_STORE_KEYS } from '../../config/secureStore';
import { setSecureItem, getSecureItem, deleteSecureItem } from '../../utils/secureStoreWrapper';
import TokenManager from './TokenManager';

class SessionManager {
  constructor() {
    this.currentUser = null;
  }

  async saveSession(user) {
    this.currentUser = user;
    await setSecureItem(SECURE_STORE_KEYS.USER_SESSION, JSON.stringify(user));
  }

  async restoreSession() {
    const response = await getSecureItem(SECURE_STORE_KEYS.USER_SESSION);
    if (response.success && response.value) {
      this.currentUser = JSON.parse(response.value);
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
    await deleteSecureItem(SECURE_STORE_KEYS.USER_SESSION);
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

export default new SessionManager();
