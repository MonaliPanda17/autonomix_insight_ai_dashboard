# InsightBoard AI Dashboard - Frontend

React + TypeScript frontend for the InsightBoard AI Dashboard application.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI components
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Features

- ✅ **Transcript Submission**: Multi-line textarea for meeting transcripts
- ✅ **AI-Powered Analysis**: Generates action items using OpenAI API
- ✅ **Task Management**: Mark tasks complete/incomplete, delete tasks
- ✅ **Progress Visualization**: Pie chart showing completion percentage
- ✅ **Modern UI**: Responsive design with beautiful components
- ✅ **Error Handling**: User-friendly error messages and loading states

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- Backend API running on http://localhost:8000

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

For production, update this to your deployed backend URL.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── badge.tsx
│   │   ├── TranscriptForm.tsx  # Form for submitting transcripts
│   │   ├── ActionItemsList.tsx # List of generated action items
│   │   └── ProgressChart.tsx   # Pie chart visualization
│   ├── services/
│   │   └── api.ts              # API client for backend communication
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles and Tailwind setup
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Usage

1. **Submit Transcript**: Paste your meeting transcript in the textarea
2. **Generate Actions**: Click "Generate Action Items" to analyze with AI
3. **Manage Tasks**: Mark tasks complete/incomplete or delete them
4. **Track Progress**: View completion percentage in the pie chart

## Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration

The frontend communicates with the FastAPI backend through:

- `POST /api/transcripts/analyze` - Submit transcript for analysis
- `GET /api/health` - Health check endpoint

See `src/services/api.ts` for API client implementation.

## Styling

The app uses:
- **Tailwind CSS** for utility-first styling
- **Shadcn UI** components for consistent design
- **CSS Variables** for theming support
- **Responsive Design** for mobile/desktop compatibility

## Deployment

### Live Application
- **Frontend**: [Deploy to Vercel](https://vercel.com)
- **Backend**: [Deploy to Render](https://render.com)

### Environment Variables
Create `.env` file:
```env
VITE_API_URL=https://your-backend-app.onrender.com
```

## Level 1 Complete ✅

This frontend implements all Level 1 requirements:
- ✅ Transcript submission form
- ✅ AI-powered action item generation
- ✅ Task interaction (complete/delete)
- ✅ Progress visualization (pie chart)
- ✅ Modern, responsive UI
- ✅ Ready for deployment
- ✅ Hosted on Vercel
