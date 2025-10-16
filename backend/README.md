# InsightBoard AI - Backend API

FastAPI backend for AI-powered meeting transcript analysis and action item generation.

## Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.9+
- **LLM**: OpenAI GPT-3.5-turbo
- **Dependencies**: See `requirements.txt`

## Setup Instructions

### 1. Prerequisites

- Python 3.9 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### 2. Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
ENVIRONMENT=development
```

### 4. Run the Server

```bash
# Make sure you're in the backend directory with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (interactive Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc

## API Endpoints

### GET `/`
Root endpoint with API information

### GET `/api/health`
Health check endpoint - verifies OpenAI connection

**Response:**
```json
{
  "status": "healthy",
  "service": "InsightBoard AI API",
  "openai_status": "connected",
  "environment": "development"
}
```

### POST `/api/transcripts/analyze`
Analyze meeting transcript and extract action items

**Request Body:**
```json
{
  "transcript": "Team meeting notes: John will prepare the Q4 report by Friday. Sarah needs to review the marketing strategy."
}
```

**Response:**
```json
{
  "success": true,
  "action_items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "text": "John will prepare the Q4 report by Friday",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "text": "Sarah to review the marketing strategy",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:05Z"
    }
  ],
  "total_count": 2
}
```

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:8000/api/health

# Analyze transcript
curl -X POST http://localhost:8000/api/transcripts/analyze \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Meeting notes: Alice will create the presentation. Bob should send the email to clients by EOD."}'
```

### Using the Interactive Docs

Visit http://localhost:8000/docs to use the built-in Swagger UI for testing.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app & routes
│   ├── models.py            # Pydantic models
│   └── services/
│       ├── __init__.py
│       └── llm_service.py   # OpenAI integration
├── .env                     # Environment variables (create this)
├── .env.example             # Example env file
├── .gitignore
├── requirements.txt         # Python dependencies
└── README.md
```

## Troubleshooting

### "OPENAI_API_KEY environment variable is not set"
- Make sure you created a `.env` file in the `backend/` directory
- Verify your OpenAI API key is correct
- Restart the server after creating/updating `.env`

### CORS errors from frontend
- The CORS middleware is configured to allow localhost:5173 (Vite default)
- If using a different port, update the `allow_origins` list in `app/main.py`

### Import errors
- Make sure your virtual environment is activated
- Run `pip install -r requirements.txt` again

## Deployment

### Live Application
- **Backend API**: [Deploy to Render](https://render.com)
- **API Documentation**: `https://your-app.onrender.com/docs`

### Environment Variables
Set in Render dashboard:
```env
OPENAI_API_KEY=your-openai-api-key
ENVIRONMENT=production
```

### Procfile
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Next Steps

- ✅ Deploy to Render for production
- Add database integration (Level 2)
- Implement authentication (Level 3)

