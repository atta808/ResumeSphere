export const ApplicationEmailPrompt = {
  build: (context) => `You are an expert career coach and professional writer.
Write a professional job application email for the user.

USER INFO:
Name: ${context.profile.firstName} ${context.profile.lastName}
Current Role: ${context.experience?.[0]?.position || 'Professional'}

TARGET JOB:
Title: ${context.jobDescription?.jobTitle || context.resume?.targetJobTitle || 'Unknown Position'}
Company: ${context.jobDescription?.companyName || context.resume?.companyName || 'the company'}

INSTRUCTIONS:
1. Write a complete application email including a Subject line.
2. Format as:
Subject: [Your Subject Here]

Dear [Hiring Manager Name or "Hiring Manager"],

[Body of email, keeping it concise and enthusiastic. Mention attached resume.]

Sincerely,
${context.profile.firstName} ${context.profile.lastName}
${context.profile.email}
${context.profile.phone || ''}

3. Keep it professional, concise, and focused on value.
4. Output ONLY the text of the email.
`
};
