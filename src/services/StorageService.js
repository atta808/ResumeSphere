import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorHandler from './ErrorHandler';
import { ERROR_CODES } from '../constants/appConstants';

/**
 * StorageService wrapper around AsyncStorage for app settings/preferences.
 * STRICTLY not for large datasets or DB records.
 */
class StorageService {
  static async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      ErrorHandler.logError(error, { key, context: 'StorageService.setItem' });
      throw ErrorHandler.process(error, ERROR_CODES.UNKNOWN_ERROR);
    }
  }

  static async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      ErrorHandler.logError(error, { key, context: 'StorageService.getItem' });
      return null;
    }
  }

  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      ErrorHandler.logError(error, { key, context: 'StorageService.removeItem' });
    }
  }

  static async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      ErrorHandler.logError(error, { context: 'StorageService.clearAll' });
    }
  }
}

export default StorageService;
