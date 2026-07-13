cat << 'INNER_EOF' > src/services/ai/ResponseParser.js
class ResponseParser {
  /**
   * Normalizes the AI output into a standard format.
   * Future versions can parse JSON if AI returns structural data.
   */
  parse(rawContent, actionType) {
    if (!rawContent) return { text: '' };

    let text = rawContent.trim();
    // Strip markdown formatting if it's wrapped in a code block by accident
    if (text.startsWith('\`\`\`json')) {
      text = text.substring(7);
      if (text.endsWith('\`\`\`')) {
        text = text.substring(0, text.length - 3);
      }
    } else if (text.startsWith('\`\`\`')) {
      text = text.substring(3);
      if (text.endsWith('\`\`\`')) {
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
INNER_EOF

sed -i 's/const completedAt = new Date().toISOString();/const completedAt = new Date().toISOString();\n    const duration = answers.reduce((total, ans) => total + (ans.timeSpent || 0), 0);/' src/services/interview/InterviewService.js
sed -i 's/`UPDATE interview_sessions SET status = '"'"'completed'"'"', completedAt = ?, overallScore = ? WHERE id = ?`/`UPDATE interview_sessions SET status = '"'"'completed'"'"', completedAt = ?, overallScore = ?, duration = ? WHERE id = ?`/' src/services/interview/InterviewService.js
sed -i 's/\[completedAt, overallScore, sessionId\]/\[completedAt, overallScore, duration, sessionId\]/' src/services/interview/InterviewService.js
