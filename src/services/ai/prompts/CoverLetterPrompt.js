export const CoverLetterPrompt = (context) => {
  return \`You are an expert career coach and copywriter. Write a customized cover letter for the user.

CANDIDATE INFO:
Name: \${context.profile?.firstName || ''} \${context.profile?.lastName || ''}
Email: \${context.profile?.email || ''}
Phone: \${context.profile?.phone || ''}

TARGET JOB:
Company: \${context.resume?.companyName || 'The Company'}
Role: \${context.resume?.targetJobTitle || 'The Position'}

CANDIDATE BACKGROUND:
Experience: \${context.experience ? JSON.stringify(context.experience, null, 2) : 'No experience provided.'}
Skills: \${context.skills ? JSON.stringify(context.skills, null, 2) : 'No skills provided.'}

INSTRUCTIONS:
Write a compelling, professional cover letter.
- Include a strong opening hook.
- Highlight 1-2 key achievements that demonstrate fit for the role.
- Conclude with a strong call to action.
- Ensure the tone is confident and professional.
- Output ONLY the text of the cover letter.
\`;
};
