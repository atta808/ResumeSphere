import * as Crypto from 'expo-crypto';

/**
 * Generate a universally unique identifier (UUID v4)
 * @returns {string} UUID string
 */
export const generateUUID = () => {
  return Crypto.randomUUID();
};

/**
 * Perform a deep clone of an object or array
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  // This is a simple deep clone, works for most JSON-serializable objects
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Deep merge two objects.
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
export const mergeObjects = (target, source) => {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeObjects(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

/**
 * Formats a date string consistently
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  // Example format: YYYY-MM-DD
  return d.toISOString().split('T')[0];
};

/**
 * Sorts array of objects by an order or date field
 * @param {Array} arr
 * @param {string} field - field to sort by
 * @param {boolean} desc - true for descending
 */
export const sortArrayByField = (arr, field = 'order', desc = false) => {
  if (!Array.isArray(arr)) return [];

  return [...arr].sort((a, b) => {
    let valA = a[field];
    let valB = b[field];

    // Simple string/number comparison
    if (valA < valB) return desc ? 1 : -1;
    if (valA > valB) return desc ? -1 : 1;
    return 0;
  });
};
