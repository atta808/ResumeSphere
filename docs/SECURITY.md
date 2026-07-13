# Security

- **Tokens**: Must be stored in `expo-secure-store`. Never in SQLite or AsyncStorage.
- **Environment**: All keys loaded from `src/config/env.js`.
- **Logs**: All sensitive data (PII, OCR text, keys) are stripped from logs.
- **No Analytics Leakage**: Use structured Minimal Logging in production.
