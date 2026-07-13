import ProviderRegistry from './ProviderRegistry';
import SessionManager from './SessionManager';
import TokenManager from './TokenManager';
import UserProfileService from './UserProfileService';
import ErrorHandler from '../ErrorHandler';

class AuthService {
  constructor() {
    this.provider = null;
  }

  async initialize(providerName = 'firebase') {
    this.provider = ProviderRegistry.getProvider(providerName);
    const session = await SessionManager.restoreSession();

    if (session) {
      const token = await TokenManager.getAccessToken();
      if (this.provider.restoreAuthState && token) {
        await this.provider.restoreAuthState(token);
      }
    }
  }

  async signInWithEmail(email, password) {
    try {
      const response = await this.provider.signInWithEmail(email, password);
      await this._handleAuthSuccess(response);
      return response;
    } catch (error) {
      ErrorHandler.logError(error, { context: 'AuthService.signInWithEmail' });
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      const response = await this.provider.signInWithGoogle();
      await this._handleAuthSuccess(response);
      return response;
    } catch (error) {
      ErrorHandler.logError(error, { context: 'AuthService.signInWithGoogle' });
      throw error;
    }
  }

  async signInAsGuest() {
    try {
      const response = await this.provider.signInAsGuest();
      await this._handleAuthSuccess(response);
      return response;
    } catch (error) {
      ErrorHandler.logError(error, { context: 'AuthService.signInAsGuest' });
      throw error;
    }
  }

  async signOut() {
    try {
      await this.provider.signOut();
      await SessionManager.clearSession();
      await TokenManager.clearTokens();
    } catch (error) {
      ErrorHandler.logError(error, { context: 'AuthService.signOut' });
      throw error;
    }
  }

  async _handleAuthSuccess(response) {
    await TokenManager.saveTokens(response.accessToken, response.refreshToken);
    await SessionManager.saveSession(response.user);
    await UserProfileService.syncProfile(response.user);
  }
}

export default new AuthService();
