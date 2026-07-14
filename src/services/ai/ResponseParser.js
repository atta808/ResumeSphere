class ResponseParser {
  /**
   * Normalizes the AI output into a standard format.
   * Future versions can parse JSON if AI returns structural data.
   */
  parse(rawContent, actionType) {
    if (!rawContent) return { text: '' };

    let text = rawContent.trim();
    // Strip markdown formatting if it's wrapped in a code block by accident
    if (text.startsWith('```json')) {
      text = text.substring(7);
      if (text.endsWith('```')) {
        text = text.substring(0, text.length - 3);
      }
    } else if (text.startsWith('```')) {
      text = text.substring(3);
      if (text.endsWith('```')) {
        text = text.substring(0, text.length - 3);
      }
    }

    return {
      text: text.trim(),
      actionType,
      parsedAt: new Date().toISOString()
    };
  }
}

export default new ResponseParser();
