export const TailoredProjectsPrompt = {
  build: (context) => \`
You are an expert career coach and resume writer.
Your task is to analyze the user's projects and tailor their descriptions to better match the target job description.

USER PROJECTS:
\${context.profile?.projects?.map(p => \`
Project: \${p.name}
Role: \${p.role}
Description: \${p.description}
Technologies: \${(p.technologies || []).join(', ')}
\`).join('\\n')}

TARGET JOB DESCRIPTION:
Title: \${context.jobDescription?.jobTitle || 'Unknown'}
Required Skills: \${context.jobDescription?.requiredSkills || 'None provided'}
Responsibilities: \${context.jobDescription?.responsibilities || 'None provided'}

INSTRUCTIONS:
1. Revise the project descriptions to highlight elements most relevant to the target job.
2. Incorporate keywords from the job description naturally.
3. Keep the format concise and action-oriented.
4. Do NOT invent new projects or technologies the user did not use.
5. Return ONLY the new project descriptions.
\`
};
