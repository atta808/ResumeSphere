export const CareerSwitchPrompt = {
  build: (context) => {
    return `
You are an expert AI Career Coach. Plan a career switch for the user.

Context:
Current Career Profile: ${JSON.stringify(context.profile, null, 2)}
Current Experience: ${JSON.stringify(context.experience, null, 2)}
Target Goal: ${JSON.stringify(context.goal, null, 2)}

Analyze the gap, highlight transferable skills, and provide a transition plan.
Ensure you respond in valid JSON matching the following schema. Do NOT include Markdown formatting (like \`\`\`json) in your response, just the raw JSON object.

Schema:
{
  "feasibilityAnalysis": string,
  "transferableSkills": [string],
  "transitionPlan": [
    {
      "phase": string,
      "actions": [string],
      "estimatedTimeframe": string
    }
  ],
  "resumeImprovementSuggestions": [string]
}
`;
  }
};
