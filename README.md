# Autonomix Insight AI Dashboard

A smart dashboard application for AI-powered meeting transcript analysis and action item generation with priority management and progress tracking.

## Level Completed: **Level 2**

## This project implements all Level 1 and Level 2 enhancements:

## LLM API Used

**OpenAI GPT-4o-mini**
- Used for intelligent action item extraction from meeting transcripts
- Generates priority levels (High/Medium/Low) based on urgency and importance
- Provides structured JSON output with text and priority fields

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.2.0 with TypeScript
- **Build Tool:** Vite 7.1.7
- **UI Library:** Tailwind CSS + Shadcn/ui components
- **Charts:** Recharts for data visualization
- **HTTP Client:** Axios for API communication

### Backend
- **Framework:** FastAPI 0.104.1
- **Language:** Python 3.11
- **Server:** Uvicorn with ASGI
- **LLM Integration:** OpenAI Python client
- **Database:** Supabase (PostgreSQL)

### Infrastructure & Deployment
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** Supabase (PostgreSQL)
- **Version Control:** GitHub

## 🚀 Live Hosted App

**Frontend:** [https://autonomix-insight-ai-dashboard.vercel.app](https://autonomix-insight-ai-dashboard.vercel.app)

**Backend API:** [https://autonomix-insight-ai-dashboard.onrender.com](https://autonomix-insight-ai-dashboard.onrender.com)

## Features

### Level 1 (Core Features)
- **Transcript Submission:** Multi-line text area for meeting transcripts
- **AI-Powered Action Items:** Automatic extraction using OpenAI
- **Task Management:** Mark complete/delete functionality
- **Progress Visualization:** Pie chart for completion status
- **Modern UI:** Responsive design with Tailwind CSS
- **Hosted Deployment:** Live on Vercel and Render

### Level 2 (Enhanced Features)
- **AI Prioritization:** Automatic High/Medium/Low priority assignment
- **Advanced Filtering:** Filter by status, priority, and keyword search
- **Smart Sorting:** Sort by date, priority, or status
- **Priority Charts:** Bar chart visualization for priority distribution
- **Database Integration:** Persistent storage with Supabase
- **Real-time Updates:** Database synchronization across sessions

## Local Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- OpenAI API key
- Supabase account

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MonaliPanda17/autonomix_insight_ai_dashboard.git
   cd autonomix_insight_ai_dashboard/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ENVIRONMENT=development
   FRONTEND_URL=http://localhost:5173
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Start the backend server:**
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

### Database Setup (Supabase)

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Run the SQL schema** in Supabase SQL Editor:
   ```sql
   CREATE TABLE action_items (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       text TEXT NOT NULL,
       status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
       priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE INDEX idx_action_items_status ON action_items(status);
   CREATE INDEX idx_action_items_priority ON action_items(priority);
   CREATE INDEX idx_action_items_created_at ON action_items(created_at);
   
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
       NEW.updated_at = NOW();
       RETURN NEW;
   END;
   $$ language 'plpgsql';
   
   CREATE TRIGGER update_action_items_updated_at 
       BEFORE UPDATE ON action_items 
       FOR EACH ROW 
       EXECUTE FUNCTION update_updated_at_column();
   ```

## Testing

The project includes comprehensive test coverage for the backend API and services.

### Running Tests

1. **Install test dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run all tests:**
   ```bash
   pytest
   ```

3. **Run tests with verbose output:**
   ```bash
   pytest -v
   ```

4. **Run specific test files:**
   ```bash
   pytest tests/test_api.py
   pytest tests/test_llm_service.py
   pytest tests/test_database_service.py
   ```

5. **Run tests with coverage:**
   ```bash
   pytest --cov=app
   ```

### Test Structure

- **`tests/test_api.py`** - API endpoint tests (health, transcript analysis, CRUD operations)
- **`tests/test_llm_service.py`** - LLM service tests (OpenAI integration, action item extraction)
- **`tests/test_database_service.py`** - Database service tests (Supabase operations)

### Test Features

- **Mocked Dependencies:** All external services (OpenAI, Supabase) are mocked for isolated testing
- **Comprehensive Coverage:** Tests cover success cases, error cases, and edge cases
- **Fast Execution:** Tests run quickly without external API calls
- **CI/CD Ready:** Tests are configured for automated testing pipelines

## Repository

**GitHub:** [https://github.com/MonaliPanda17/autonomix_insight_ai_dashboard](https://github.com/MonaliPanda17/autonomix_insight_ai_dashboard)

## API Endpoints

- `GET /api/health` - Health check with service status
- `POST /api/transcripts/analyze` - Analyze transcript and generate action items
- `GET /api/action-items` - Retrieve all action items
- `PUT /api/action-items/{id}` - Update action item
- `DELETE /api/action-items/{id}` - Delete action item

## UI Components

- **TranscriptForm:** Meeting transcript input with AI analysis
- **ActionItemsList:** Task management with priority badges
- **ProgressChart:** Completion status pie chart
- **PriorityChart:** Priority distribution bar chart
- **FilterAndSort:** Advanced filtering and sorting controls

## Development

- **Backend:** FastAPI with automatic API documentation at `/docs`
- **Frontend:** Hot reload with Vite development server
- **Database:** Real-time synchronization with Supabase
- **Deployment:** Automatic deployments on Git push


