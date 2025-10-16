# InsightBoard AI Dashboard

A modern AI-powered dashboard for analyzing meeting transcripts and generating actionable task items.

## Project Structure

```
autonomix_insight_ai_dashboard/
├── backend/                 # FastAPI backend service
│   ├── app/                # Application code
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI app and routes
│   │   ├── models.py       # Pydantic data models
│   │   └── services/       # Business logic services
│   │       ├── __init__.py
│   │       └── llm_service.py  # OpenAI integration
│   ├── .env.example        # Environment variables template
│   ├── .gitignore          # Git ignore rules
│   ├── Procfile            # Production deployment config
│   ├── README.md           # Backend documentation
│   ├── requirements.txt    # Python dependencies
│   └── runtime.txt         # Python version specification
├── frontend/               # React + TypeScript frontend
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   │   ├── ui/        # Reusable UI components
│   │   │   ├── ActionItemsList.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   └── TranscriptForm.tsx
│   │   ├── services/      # API client
│   │   │   └── api.ts
│   │   ├── types/         # TypeScript definitions
│   │   │   └── index.ts
│   │   ├── lib/           # Utility functions
│   │   │   └── utils.ts
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # App entry point
│   │   └── index.css      # Global styles
│   ├── .env.example       # Environment variables template
│   ├── .gitignore         # Git ignore rules
│   ├── index.html         # HTML template
│   ├── package.json       # Node.js dependencies
│   ├── README.md          # Frontend documentation
│   ├── tailwind.config.js # Tailwind CSS config
│   ├── tsconfig.json      # TypeScript config
│   └── vite.config.ts     # Vite build config
├── .gitignore             # Root git ignore
├── DEPLOYMENT_GUIDE.md    # Deployment instructions
└── README.md              # This file
```

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **AI Service**: OpenAI GPT-4o-mini
- **Deployment**: Render.com
- **Dependencies**: See `backend/requirements.txt`

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Charts**: Recharts
- **Deployment**: Vercel
- **Dependencies**: See `frontend/package.json`

## Features

- ✅ **AI-Powered Analysis**: Extract action items from meeting transcripts
- ✅ **Task Management**: Mark tasks complete/incomplete, delete tasks
- ✅ **Progress Visualization**: Pie chart showing completion percentage
- ✅ **Modern UI**: Responsive design with beautiful components
- ✅ **Error Handling**: User-friendly error messages and loading states
- ✅ **Production Ready**: Deployed and accessible online

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your OpenAI API key
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
```

## Production Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## API Documentation

- **Development**: http://localhost:8000/docs
- **Production**: https://your-backend-app.onrender.com/docs

## Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
ENVIRONMENT=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
