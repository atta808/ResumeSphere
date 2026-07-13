export const SOPPrompt = {
  build: (context) => `You are an expert admissions counselor and professional writer.
Write a Statement of Purpose (SOP) draft.

USER INFO:
Name: ${context.profile.firstName} ${context.profile.lastName}
Background: ${context.experience?.[0]?.description || 'Academic/Professional background'}
Education: ${context.education?.[0]?.degree || 'Previous studies'}

INSTRUCTIONS:
1. Write a structured, compelling narrative (approx. 4-5 paragraphs).
2. Connect their past experiences and education to their future goals.
3. Maintain a formal, academic, and passionate tone.
4. Ensure the output flows well and demonstrates clear purpose.
5. Output ONLY the text of the Statement of Purpose.
`
};
