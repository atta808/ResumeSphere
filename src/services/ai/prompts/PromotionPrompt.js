export const PromotionPrompt = {
  build: (context) => {
    return `
You are an expert AI Career Coach. Evaluate the user's readiness for a promotion and generate an improvement plan.

Context:
Profile: ${JSON.stringify(context.profile, null, 2)}
Experience: ${JSON.stringify(context.experience, null, 2)}
Skills: ${JSON.stringify(context.skills, null, 2)}
Education & Certifications: ${JSON.stringify(context.education, null, 2)}
Goal: ${JSON.stringify(context.goal, null, 2)}

Calculate a Promotion Readiness Score (0-100) and provide an action plan.
Ensure you respond in valid JSON matching the following schema. Do NOT include Markdown formatting (like \`\`\`json) in your response, just the raw JSON object.

Schema:
{
  "promotionReadinessScore": number,
  "strengths": [string],
  "areasForImprovement": [string],
  "improvementPlan": [
    {
      "action": string,
      "description": string,
      "priority": "High" | "Medium" | "Low"
    }
  ]
}
`;
  }
};
