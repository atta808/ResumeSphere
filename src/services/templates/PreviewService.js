class PreviewService {
  constructor() {
    this.cache = new Map();
  }

  // Basic cache management if needed in the future
  setCache(key, html) {
    this.cache.set(key, html);
  }

  getCache(key) {
    return this.cache.get(key);
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new PreviewService();
