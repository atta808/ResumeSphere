export const FollowUpPrompt = {
  build: (context) => `You are an expert career coach and professional writer.
Write a professional interview follow-up email.

USER INFO:
Name: ${context.profile.firstName} ${context.profile.lastName}

TARGET JOB:
Title: ${context.jobDescription?.jobTitle || context.resume?.targetJobTitle || 'the position'}
Company: ${context.jobDescription?.companyName || context.resume?.companyName || 'the company'}

INSTRUCTIONS:
1. Include a subject line.
2. Thank the interviewer for their time.
3. Briefly reiterate enthusiasm and one key fit for the role.
4. Keep it very short and professional.
5. Output ONLY the text of the email.
`
};
