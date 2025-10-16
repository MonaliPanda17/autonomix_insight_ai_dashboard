from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import logging

from .models import TranscriptRequest, ActionItemsResponse, ErrorResponse
from .services.llm_service import LLMService

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="InsightBoard AI API",
    description="Backend API for AI-powered meeting transcript analysis and action item generation",
    version="1.0.0"
)

# Configure CORS - Allow frontend to make requests
allowed_origins = [
    "http://localhost:5173",  # Vite default dev server
    "http://localhost:3000",  # Alternative React dev server
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://autonomix-insight-ai-dashboard.vercel.app",  # Production Vercel frontend
]

# Add production frontend URL if specified
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

# In development, allow all origins for easier testing
if os.getenv("ENVIRONMENT", "development") == "development":
    allowed_origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize LLM servic
try:
    llm_service = LLMService()
    logger.info("LLM Service initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize LLM Service: {str(e)}")
    llm_service = None


@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Welcome to InsightBoard AI API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "analyze_transcript": "/api/transcripts/analyze"
        }
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    openai_status = "connected" if llm_service and llm_service.test_connection() else "disconnected"
    
    return {
        "status": "healthy",
        "service": "InsightBoard AI API",
        "openai_status": openai_status,
        "environment": os.getenv("ENVIRONMENT", "development")
    }


@app.post(
    "/api/transcripts/analyze",
    response_model=ActionItemsResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def analyze_transcript(request: TranscriptRequest):
    """
    Analyze a meeting transcript and extract action items using AI
    
    Args:
        request: TranscriptRequest containing the transcript text
        
    Returns:
        ActionItemsResponse with extracted action items
    """
    try:
        # Validate LLM service is available
        if not llm_service:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="LLM service is not initialized. Please check OpenAI API key."
            )
        
        logger.info(f"Received transcript analysis request (length: {len(request.transcript)} chars)")
        
        # Extract action items using LLM
        action_items = llm_service.extract_action_items(request.transcript)
        
        # Build response
        response = ActionItemsResponse(
            success=True,
            action_items=action_items,
            total_count=len(action_items)
        )
        
        logger.info(f"Successfully generated {len(action_items)} action items")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing transcript: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze transcript: {str(e)}"
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unexpected errors"""
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc)
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

