# Architecture Overview

ResumeSphere AI utilizes a strict layered pattern ensuring maintainability and scalability.

- **UI / Screens (`src/screens/`)**: React Native components using standard functional patterns. They never access storage or execute SQL directly.
- **Navigation (`src/navigation/`)**: Uses React Navigation for routing.
- **Hooks (`src/hooks/`)**: Wraps services into reusable React hooks, bridging state and business logic.
- **Services (`src/services/`)**: Central business logic containing specific sub-engines (Career Engine, Portfolio Engine, ATS Engine, etc.). Services interact with the repositories.
- **Repositories (`src/repositories/`)**: Abstracted data access layers. They handle SQLite queries and coordinate with the cloud sync queue.
- **Database (`src/database/`)**: Expo SQLite setup, complete with migrations.
- **Models (`src/models/`)**: Plain JavaScript factory functions representing entities. Uses `expo-crypto` for UUID generation.
- **Configuration (`src/config/`)**: Centralized configurations for AI, ATS, Career scoring, and environment variables.
- **Theme (`src/theme/`)**: Global design tokens and context-aware theming.

**Rule**: The master Database holds the "Career Profile". A "Resume" is simply a curated view of this profile.
