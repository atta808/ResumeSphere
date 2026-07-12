/**
 * Validators for standard data inputs
 */

export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return true; // Phone might be optional, adjust as needed. If required, check empty string.
  const regex = /^\+?[0-9\s\-\(\)]+$/;
  return regex.test(phone);
};

export const isValidURL = (url) => {
  if (!url) return true; // Optional url
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
};
