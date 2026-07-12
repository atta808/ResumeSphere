class ImportService {
  /**
   * Future integration for importing a profile from various sources.
   * Architecture prepared here.
   */
  static async importFromSource(sourceType, payload) {
    throw new Error('ImportService.importFromSource is not yet implemented.');
  }

  static async parseDocument(fileUrl, parserType) {
    throw new Error('ImportService.parseDocument is not yet implemented.');
  }
}

export default ImportService;
