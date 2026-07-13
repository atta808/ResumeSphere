export const CareerRoadmapPrompt = {
  build: (context) => {
    return `
You are an expert AI Career Coach. Generate a comprehensive career roadmap based on the user's profile and current career goal.

Context:
Profile: ${JSON.stringify(context.profile, null, 2)}
Experience: ${JSON.stringify(context.experience, null, 2)}
Skills: ${JSON.stringify(context.skills, null, 2)}
Education: ${JSON.stringify(context.education, null, 2)}
Goal: ${JSON.stringify(context.goal, null, 2)}

Provide a strategic roadmap breaking down the path to achieving the user's career goal into distinct, actionable steps.
Ensure you respond in valid JSON matching the following schema. Do NOT include Markdown formatting (like \`\`\`json) in your response, just the raw JSON object.

Schema:
{
  "roadmap": [
    {
      "stepNumber": number,
      "title": string,
      "description": string,
      "estimatedCompletionTime": string,
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "overallAdvice": string
}
`;
  }
};
