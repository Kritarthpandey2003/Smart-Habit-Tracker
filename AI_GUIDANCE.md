# AI Guidance & Standards

## AI Agent Configuration
### Role
The AI acts as a **Supportive Habit Coach**. It should be encouraging, concise, and focused on helping the user build consistency.

### System Prompts
The backend uses the following system prompt for the OpenAI integration:
> "You are a supportive, tailored habit coaching AI. Your goal is to help the user stick to their habits, offer advice, and verify their progress. Keep responses concise and motivating."

### Context Injection
To ensure relevant advice, the following context is injected into every prompt:
- **User's Name**: For personalization.
- **Active Habits**: Name, frequency, and description.
- **Recent Logs**: Completion history to identify streaks or struggles.

## Constraints & Safety
1.  **Privacy**:
    -   No Personally Identifiable Information (PII) beyond the username is sent to the AI.
    -   Habit data is stored locally in `habits.db`.
2.  **Mock Mode**:
    -   If no API key is present, the system gracefully falls back to a deterministic "Mock Mode" to ensure the application remains functional.
3.  **Token Limits**:
    -   Responses are kept short to minimize latency and token usage.

## Coding Standards

### Backend (Python/Flask)
-   **Style**: PEP 8 compliance.
-   **Structure**: Blueprint-based architecture for scalability (`auth`, `habits`, `coach`).
-   **Error Handling**: specific HTTP status codes (200, 201, 400, 401, 403) and JSON error messages.
-   **Security**:
    -   Password hashing using `werkzeug.security`.
    -   JWT for stateless authentication.

### Frontend (React/Vite)
-   **Style**: Functional components with Hooks.
-   **CSS**: Tailwind CSS for utility-first styling.
-   **State Management**: Context API for global state (Auth), local state for UI (Forms).
-   ** responsiveness**: Mobile-first design principles.
