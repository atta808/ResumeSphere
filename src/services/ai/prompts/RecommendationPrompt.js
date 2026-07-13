export const RecommendationPrompt = {
  build: (context) => `You are an expert career coach and professional writer.
Write a professional request for a letter of recommendation or reference.

USER INFO:
Name: ${context.profile.firstName} ${context.profile.lastName}

INSTRUCTIONS:
1. Include a subject line.
2. Ask politely if they would be comfortable providing a strong reference/recommendation.
3. Briefly remind them of the work done together or the context of the relationship.
4. Offer to provide context (like a resume) to make it easier for them.
5. Provide a gracious closing.
6. Output ONLY the text of the email.
`
};
