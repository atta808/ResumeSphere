import * as SecureStore from 'expo-secure-store';
import ErrorHandler from '../ErrorHandler';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

class TokenManager {
  async saveTokens(accessToken, refreshToken) {
    try {
      if (accessToken) await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      ErrorHandler.logError(error, { context: 'TokenManager.saveTokens' });
    }
  }

  async getAccessToken() {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  }

  async getRefreshToken() {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

  async clearTokens() {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
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
