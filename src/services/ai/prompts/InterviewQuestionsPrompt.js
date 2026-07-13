export class InterviewQuestionsPrompt {
  static build(context) {
    const { interviewType, difficulty, companyName, position, resume, profile, jobDescription } = context;

    return `You are ResumeSphere AI, an expert Executive Interview Coach.
Your task is to generate a list of mock interview questions tailored to the user's upcoming interview.

CONTEXT:
Interview Type: ${interviewType || 'General HR'}
Difficulty: ${difficulty || 'Medium'}
Company: ${companyName || 'Unknown'}
Position: ${position || 'Unknown'}
Resume/Profile Context:
${resume ? JSON.stringify(resume) : JSON.stringify(profile)}
Job Description Context:
${jobDescription ? JSON.stringify(jobDescription) : 'Not provided.'}

REQUIREMENTS:
1. Generate exactly 5 relevant interview questions.
2. The questions MUST align with the specified Interview Type (e.g., if Technical, ask coding/architecture questions; if Behavioral, ask STAR method questions).
3. Adjust the complexity based on the specified Difficulty.
4. If Job Description or Resume is provided, specifically mention technologies, past experiences, or responsibilities to make it realistic.

FORMAT:
Return ONLY a valid JSON array of objects. Do NOT wrap it in Markdown formatting (no \`\`\`json).
Each object MUST have these exact keys:
"question": The interview question string.
"questionType": string (e.g., "behavioral", "technical", "situational", "hr").
"category": string (e.g., "Leadership", "React Native", "Problem Solving").
"expectedSkills": Array of strings representing skills this question tests.`;
  }
}
