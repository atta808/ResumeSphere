export const InterviewPrompt = (context) => {
  return \`You are an expert technical interviewer and HR recruiter.

TARGET JOB TITLE: \${context.resume?.targetJobTitle || 'Not specified'}

CANDIDATE EXPERIENCE:
\${context.experience ? JSON.stringify(context.experience, null, 2) : 'No experience provided.'}

INSTRUCTIONS:
Generate a list of 5-7 interview questions tailored to the target job title and the candidate's background.
Include a mix of:
- Technical/Hard skills questions
- Behavioral/Situational questions (e.g., STAR method)
- General HR questions

For each question, briefly provide a "What the interviewer is looking for" tip.
Structure the response clearly.
\`;
};
