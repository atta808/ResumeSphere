export const ExperiencePrompt = (context) => {
  return `You are an expert resume writer.

CURRENT EXPERIENCE:
${context.experience ? JSON.stringify(context.experience, null, 2) : 'No experience provided.'}

TARGET JOB TITLE: ${context.resume?.targetJobTitle || 'Not specified'}

INSTRUCTIONS:
Rewrite the bullet points of this work experience to be more impactful.
- Start each bullet point with a strong action verb.
- Emphasize quantifiable achievements and results over just listing responsibilities.
- Ensure the tone matches the level expected for the target job title.
- Provide the rewritten bullet points clearly.
`;
};
