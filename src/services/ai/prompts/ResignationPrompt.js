export const ResignationPrompt = {
  build: (context) => `You are an expert career coach and professional writer.
Write a professional resignation letter.

USER INFO:
Name: ${context.profile.firstName} ${context.profile.lastName}
Current Role: ${context.experience?.[0]?.position || 'Professional'}

INSTRUCTIONS:
1. Keep it formal and professional.
2. State the intention to resign and mention a standard notice period (e.g., 2 weeks).
3. Express gratitude for the opportunity.
4. Offer assistance with the transition.
5. Output ONLY the text of the letter.
`
};
