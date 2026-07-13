export const NetworkingPrompt = {
  build: (context) => `You are an expert career coach and professional writer.
Write a professional networking or LinkedIn outreach message.

USER INFO:
Name: ${context.profile.firstName} ${context.profile.lastName}

INSTRUCTIONS:
1. Keep it concise (under 150 words).
2. Introduce yourself briefly.
3. State the purpose of the connection (e.g., learning about their career path, shared interests).
4. Do NOT explicitly ask for a job. Focus on connection and learning.
5. End with a low-pressure call to action (e.g., "Would love to connect").
6. Output ONLY the text of the message.
`
};
