export const ProfessionalSummaryPrompt = (context) => {
  return \`You are an expert executive resume writer. Your task is to generate a professional summary for a user's resume.

PROFILE CONTEXT:
Name: \${context.profile?.firstName || ''} \${context.profile?.lastName || ''}
Target Job Title: \${context.resume?.targetJobTitle || 'Not specified'}

EXPERIENCE SUMMARY:
\${context.experience ? JSON.stringify(context.experience, null, 2) : 'No experience provided.'}

SKILLS:
\${context.skills ? JSON.stringify(context.skills, null, 2) : 'No skills provided.'}

INSTRUCTIONS:
1. Write a compelling, 3-4 sentence professional summary.
2. Focus on their most relevant experience and skills aligned with the Target Job Title.
3. Use a professional, objective tone (avoid first-person pronouns like "I", "me").
4. Do not include placeholder text. If information is missing, create a general but professional summary based on what is available.
5. Provide ONLY the summary text in your response, nothing else.
\`;
};
