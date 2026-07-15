import * as SecureStore from 'expo-secure-store';
import ErrorHandler from '../services/ErrorHandler';

const isValidKey = (key) => {
  return typeof key === 'string' && key.trim() !== '' && /^[a-zA-Z0-9.\-_]+$/.test(key);
};

const normalizeError = (message) => {
  return {
    success: false,
    code: 'INVALID_SECURESTORE_KEY',
    message: message || 'SecureStore key is invalid.'
  };
};

export const setSecureItem = async (key, value) => {
  if (!isValidKey(key)) {
    const err = normalizeError(`Invalid key provided to SecureStore.setItemAsync: ${key}`);
    ErrorHandler.logError(err);
    return err;
  }
  try {
    await SecureStore.setItemAsync(key, value);
    return { success: true };
  } catch (error) {
    const err = ErrorHandler.process(error, 'SECURESTORE_SET_ERROR');
    return { success: false, ...err };
  }
};

export const getSecureItem = async (key) => {
  if (!isValidKey(key)) {
    const err = normalizeError(`Invalid key provided to SecureStore.getItemAsync: ${key}`);
    ErrorHandler.logError(err);
    return { success: false, ...err, value: null };
  }
  try {
    const value = await SecureStore.getItemAsync(key);
    return { success: true, value };
  } catch (error) {
    const err = ErrorHandler.process(error, 'SECURESTORE_GET_ERROR');
    return { success: false, ...err, value: null };
  }
};

export const deleteSecureItem = async (key) => {
  if (!isValidKey(key)) {
    const err = normalizeError(`Invalid key provided to SecureStore.deleteItemAsync: ${key}`);
    ErrorHandler.logError(err);
    return err;
  }
  try {
    await SecureStore.deleteItemAsync(key);
    return { success: true };
  } catch (error) {
    const err = ErrorHandler.process(error, 'SECURESTORE_DELETE_ERROR');
    return { success: false, ...err };
  }
};
