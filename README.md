# Smart Habit Tracker

A full-stack habit tracking application with AI coaching.

## Features
- **Habit Management**: Create, track, and delete daily/weekly habits.
- **Progress Tracking**: Visual streaks and completion logs.
- **AI Coach**: Chat with an AI assistant for motivation and advice (powered by OpenAI).
- **Secure Auth**: User registration and login with JWT.
- **Responsive UI**: Modern, clean interface built with React and Tailwind CSS.

## Tech Stack
- **Backend**: Python, Flask, SQLAlchemy (SQLite), OpenAI API
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Database**: SQLite (local)

## Setup Instructions

### Backend
1. Navigate to `api/`:
   ```bash
   cd api
   ```
2. Create virtual environment and install dependencies:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set up environment variables (Optional for AI):
   - Create `.env` file (or set in terminal): `OPENAI_API_KEY=your_key_here`
   - If no key is provided, the AI Coach operates in "Mock Mode".
4. Run the server:
   ```bash
   python index.py
   ```
   Server runs at `http://localhost:5000`.

### Frontend
1. Navigate to project root:
   ```bash
   # (You are already in the root if you cloned the repo)
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`.

## AI Usage
The "AI Coach" feature uses OpenAI's GPT-3.5-turbo to provide personalized advice based on your habit data. 
- **Prompting**: The system prompt instructs the AI to be supportive and concise.
- **Context**: User's habits and completion stats are injected into the prompt context.
- **Privacy**: Only habit names and logs are sent to the AI; no personal PII beyond username.

## Extension Ideas
- **Gamification**: Badges for streaks.
- **Social**: Share habits with friends.
- **Mobile App**: React Native port.
