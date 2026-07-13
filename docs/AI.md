# AI Engine

- Managed by `AIService` and `PromptBuilder`.
- AI providers extend `BaseAIProvider` and are strictly read-only. They never overwrite user data without consent.
- `PromptBuilder` aggregates context dynamically from models to avoid hardcoding logic.
- API models and config reside in `src/config/ai.js`.
