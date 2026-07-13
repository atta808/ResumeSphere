export const SkillGapPrompt = {
  build: (context) => {
    return `
You are an expert AI Career Coach. Analyze the gap between the user's current skills and the skills required for their target career goal.

Context:
Profile: ${JSON.stringify(context.profile, null, 2)}
Current Skills: ${JSON.stringify(context.skills, null, 2)}
Goal: ${JSON.stringify(context.goal, null, 2)}

Identify missing skills, recommend new skills to learn, and prioritize them.
Ensure you respond in valid JSON matching the following schema. Do NOT include Markdown formatting (like \`\`\`json) in your response, just the raw JSON object.

Schema:
{
  "missingSkills": [
    {
      "skillName": string,
      "reasoning": string,
      "priority": "High" | "Medium" | "Low",
      "estimatedLearningTime": string
    }
  ],
  "transferableSkills": [
    {
      "skillName": string,
      "howToLeverage": string
    }
  ]
}
`;
  }
};
