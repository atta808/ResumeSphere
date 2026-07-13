export const LearningPlanPrompt = {
  build: (context) => {
    return `
You are an expert AI Career Coach. Create a personalized learning plan based on the user's skill gaps and career goal.

Context:
Goal: ${JSON.stringify(context.goal, null, 2)}
Missing Skills: ${JSON.stringify(context.missingSkills, null, 2)}

Generate a sequence of learning steps.
Ensure you respond in valid JSON matching the following schema. Do NOT include Markdown formatting (like \`\`\`json) in your response, just the raw JSON object.

Schema:
{
  "learningPlan": [
    {
      "stepOrder": number,
      "skillName": string,
      "resourceType": "Course" | "Book" | "Project" | "Documentation",
      "recommendedResource": string,
      "estimatedHours": number,
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "priority": "High" | "Medium" | "Low"
    }
  ]
}
`;
  }
};
