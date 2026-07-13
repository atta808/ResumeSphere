# OCR Engine

- Analyzes raw document data, parsing it into `ImportSession` before a user reviews and merges.
- Uses `expo-image-manipulator` for preprocessing (max 2048px, 0.85 compression).
- Implements a heuristic scoring algorithm for duplicate detection to prevent overwriting existing profile data.
