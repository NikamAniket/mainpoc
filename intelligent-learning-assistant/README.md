# Lumina AI - Intelligent Learning Assistant

Lumina AI is a production-ready learning platform that leverages AI to personalize education paths, provide interactive tutoring, and adapt content difficulty based on user performance.

## 🚀 Key Features

- **Personalized Onboarding**: Assesses baseline knowledge and goals.
- **Adaptive Engine**: Uses SM-2 Spaced Repetition and performance-based difficulty scaling.
- **AI Tutor**: Integrated with Gemini 1.5 Flash for contextual help and explanations.
- **Interactive Modules**: Markdown-based lessons with auto-generated quizzes.
- **Progress Dashboard**: Visualizes mastery levels and study activity.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Winston (Logging), Joi (Validation).
- **Database**: Google Firestore (GCP Native).
- **AI**: Google Gemini API.

## 📦 Setup & Installation

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (optional)
- Gemini API Key

### Local Development

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   cd backend
   cp .env.example .env
   # Add your GEMINI_API_KEY and FIREBASE credentials to .env
   npm install
   npm start
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Setup
```bash
docker-compose up --build
```

## 🏗️ Architecture

The system follows a Clean Architecture pattern:
- **Services Layer**: Handles AI integration and adaptive logic.
- **Controllers Layer**: Manages API endpoints and request handling.
- **Frontend Layer**: Component-based React UI with centralized state.

## 🧪 Testing
Run backend tests:
```bash
cd backend
npm test
```

## ☁️ Deployment (Google Cloud)

1. **GCP Project**: Create a new project in Google Cloud Console.
2. **Cloud Run**:
   - Build and push the backend image to Artifact Registry.
   - Deploy as a Cloud Run service.
3. **Firestore**: Enable Firestore in Native mode.
4. **Environment Variables**: Set `GEMINI_API_KEY` and other secrets in Cloud Run configuration.
