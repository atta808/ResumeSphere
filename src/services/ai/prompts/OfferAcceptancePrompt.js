export const OfferAcceptancePrompt = {
  build: (context) => `You are an expert career coach and professional writer.
Write a professional offer acceptance email.

USER INFO:
Name: ${context.profile.firstName} ${context.profile.lastName}

TARGET JOB:
Title: ${context.jobDescription?.jobTitle || context.resume?.targetJobTitle || 'the position'}
Company: ${context.jobDescription?.companyName || context.resume?.companyName || 'the company'}

INSTRUCTIONS:
1. Include a subject line.
2. Formally accept the offer.
3. Express enthusiasm for starting.
4. Mention looking forward to next steps/onboarding.
5. Output ONLY the text of the email.
`
};
