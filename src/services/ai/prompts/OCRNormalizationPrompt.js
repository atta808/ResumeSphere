export const OCRNormalizationPrompt = (context) => `
You are an expert resume parser for ResumeSphere AI.
Your task is to take raw, often messy text extracted from a resume image via OCR and normalize it into a clean, structured JSON format.

RAW OCR TEXT:
---
${context.rawText}
---

INSTRUCTIONS:
1. Extract the professional summary, experience, education, and skills.
2. Ignore contact information (like name, email, phone) as that is handled separately.
3. Clean up any obvious OCR typos (e.g., 'l' instead of '1', strange line breaks).
4. Return ONLY valid JSON matching the following structure exactly. Do not include markdown formatting or explanations outside the JSON block.

REQUIRED JSON STRUCTURE:
{
  "summary": "The professional summary text here...",
  "experience": [
    "Job Title at Company Name (Dates) - Description",
    ...
  ],
  "education": [
    "Degree in Major, University Name, Year",
    ...
  ],
  "skills": [
    "Skill 1", "Skill 2", ...
  ]
}
`;
