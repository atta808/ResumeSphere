export const TailoredSummaryPrompt = {
  build: (context) => `
You are an expert career coach and resume writer.
Your task is to generate a highly tailored Professional Summary based on the provided user profile and target job description.

USER PROFILE:
Name: ${context.profile.firstName} ${context.profile.lastName}
Current Summary: ${context.resumeData.summary || context.profile.summary || 'None'}
Skills: ${context.skills.map(s => s.name).join(', ')}

TARGET JOB DESCRIPTION:
Title: ${context.jobDescription?.jobTitle || 'Unknown'}
Company: ${context.jobDescription?.companyName || 'Unknown'}
Required Skills: ${context.jobDescription?.requiredSkills || 'None provided'}
Responsibilities: ${context.jobDescription?.responsibilities || 'None provided'}

INSTRUCTIONS:
1. Write a compelling 3-4 sentence professional summary.
2. Highlight the user's skills that match the target job description.
3. Integrate relevant keywords from the job description naturally.
4. Focus on the value the user brings to the specific role and company.
5. Return ONLY the new summary text. Do not include any conversational filler.
`
};
