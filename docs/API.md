# API & Integrations

- Integrations employ a **Provider Architecture**.
- Extends base classes (e.g., `BaseAIProvider`).
- No direct fetch logic in components. `ProviderRegistry` selects the active implementation.
- API requests implement timeouts via `AbortController` and error handling/retry logic.
