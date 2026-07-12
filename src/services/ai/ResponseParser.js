class ResponseParser {
  /**
   * Normalizes the AI output into a standard format.
   * Future versions can parse JSON if AI returns structural data.
   */
  parse(rawContent, actionType) {
    if (!rawContent) return { text: '' };

    // For Phase 6, we return primarily markdown text.
    // In future phases, we could attempt to parse JSON blocks for specific tools.

    // Strip markdown formatting if it's wrapped in a code block by accident
    let text = rawContent;
    if (text.startsWith('\`\`\`') && text.endsWith('\`\`\`')) {
       const lines = text.split('\n');
       if (lines.length >= 2) {
         text = lines.slice(1, -1).join('\n');
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
