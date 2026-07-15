import { SECURE_STORE_KEYS } from '../../config/secureStore';
import { setSecureItem, getSecureItem, deleteSecureItem } from '../../utils/secureStoreWrapper';
import ErrorHandler from '../ErrorHandler';

class TokenManager {
  async saveTokens(accessToken, refreshToken) {
    try {
      if (accessToken) await setSecureItem(SECURE_STORE_KEYS.AUTH_TOKEN, accessToken);
      if (refreshToken) await setSecureItem(SECURE_STORE_KEYS.REFRESH_TOKEN, refreshToken);
    } catch (error) {
      ErrorHandler.logError(error, { context: 'TokenManager.saveTokens' });
    }
  }

  async getAccessToken() {
    const res = await getSecureItem(SECURE_STORE_KEYS.AUTH_TOKEN);
    return res.success ? res.value : null;
  }

  async getRefreshToken() {
    const res = await getSecureItem(SECURE_STORE_KEYS.REFRESH_TOKEN);
    return res.success ? res.value : null;
  }

  async clearTokens() {
    try {
      await deleteSecureItem(SECURE_STORE_KEYS.AUTH_TOKEN);
      await deleteSecureItem(SECURE_STORE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      ErrorHandler.logError(error, { context: 'TokenManager.clearTokens' });
    }
  }

  async hasValidTokens() {
    const token = await this.getAccessToken();
    return !!token;
  }
}

export default new TokenManager();
