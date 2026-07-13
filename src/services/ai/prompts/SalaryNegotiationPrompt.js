export const SalaryNegotiationPrompt = {
  build: (context) => `You are an expert career coach and professional writer.
Write a professional salary negotiation email.

USER INFO:
Name: ${context.profile.firstName} ${context.profile.lastName}

TARGET JOB:
Title: ${context.jobDescription?.jobTitle || context.resume?.targetJobTitle || 'the position'}
Company: ${context.jobDescription?.companyName || context.resume?.companyName || 'the company'}

INSTRUCTIONS:
1. Include a subject line.
2. Express gratitude for the offer.
3. Professionally state the counter-offer or negotiation points based on market value and experience.
4. Reiterate enthusiasm for joining the team.
5. Maintain a polite, collaborative, and confident tone.
6. Output ONLY the text of the email.
`
};
