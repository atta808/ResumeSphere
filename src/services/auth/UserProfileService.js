import Logger from '../../utils/logger';
class UserProfileService {
  async syncProfile(authUser) {
    // Sync external auth user data with local SQLite profiles
    // In future phases, we will match or create a Profile based on authUser.id
    Logger.info('Syncing user profile with local DB for:', authUser?.email || 'Guest');
  }
}

export default new UserProfileService();
