export const TailoredCoverLetterPrompt = {
  build: (context) => `
You are an expert career coach and professional writer.
Your task is to write a highly tailored cover letter for the target job based on the user's profile.

USER PROFILE:
Name: ${context.profile.firstName} ${context.profile.lastName}
Current Role: ${context.experience[0]?.position || 'Professional'}
Skills: ${context.skills.map(s => s.name).join(', ')}
Key Experience: ${context.experience.slice(0, 2).map(e => e.description).join(' ')}

TARGET JOB DESCRIPTION:
Title: ${context.jobDescription?.jobTitle || 'Unknown'}
Company: ${context.jobDescription?.companyName || 'Unknown'}
Requirements & Responsibilities: ${context.jobDescription?.requiredSkills || ''} ${context.jobDescription?.responsibilities || ''}

INSTRUCTIONS:
1. Write a professional, engaging cover letter (approx. 3-4 paragraphs).
2. Start strong by expressing enthusiasm for the role and the company.
3. Highlight specific experiences and skills from the user's profile that directly address the job's biggest requirements.
4. Show cultural fit and understanding of the company's needs based on the job description.
5. End with a strong call to action for an interview.
6. Return ONLY the text of the cover letter.
`
};
