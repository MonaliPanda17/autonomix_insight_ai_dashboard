from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import logging

from .models import TranscriptRequest, ActionItemsResponse, ErrorResponse
from .services.llm_service import LLMService
from .services.database_service import DatabaseService

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

# Initialize services
try:
    llm_service = LLMService()
    logger.info("LLM Service initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize LLM Service: {str(e)}")
    llm_service = None

try:
    db_service = DatabaseService()
    logger.info("Database Service initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Database Service: {str(e)}")
    db_service = None


@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Welcome to InsightBoard AI API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "analyze_transcript": "/api/transcripts/analyze",
            "get_action_items": "/api/action-items",
            "update_action_item": "/api/action-items/{item_id}",
            "delete_action_item": "/api/action-items/{item_id}"
        }
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    openai_status = "connected" if llm_service and llm_service.test_connection() else "disconnected"
    db_status = "connected" if db_service and db_service.test_connection() else "disconnected"
    
    return {
        "status": "healthy",
        "service": "InsightBoard AI API",
        "openai_status": openai_status,
        "database_status": db_status,
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
        # Validate services are available
        if not llm_service:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="LLM service is not initialized. Please check OpenAI API key."
            )
        
        if not db_service:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database service is not initialized. Please check database configuration."
            )
        
        logger.info(f"Received transcript analysis request (length: {len(request.transcript)} chars)")
        
        # Extract action items using LLM
        action_items = llm_service.extract_action_items(request.transcript)
        
        # Save action items to database
        try:
            db_service.create_multiple_action_items(action_items)
            logger.info(f"Saved {len(action_items)} action items to database")
        except Exception as db_error:
            logger.error(f"Failed to save to database: {str(db_error)}")
            # Continue without database save for now, but log the error
        
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


@app.get("/api/action-items", response_model=ActionItemsResponse)
async def get_action_items():
    """Get all action items from database"""
    try:
        if not db_service:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database service is not initialized"
            )
        
        action_items = db_service.get_all_action_items()
        
        return ActionItemsResponse(
            success=True,
            action_items=action_items,
            total_count=len(action_items)
        )
        
    except Exception as e:
        logger.error(f"Error retrieving action items: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve action items: {str(e)}"
        )


@app.put("/api/action-items/{item_id}")
async def update_action_item(item_id: str, updates: dict):
    """Update an action item"""
    try:
        if not db_service:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database service is not initialized"
            )
        
        updated_item = db_service.update_action_item(item_id, updates)
        
        if updated_item:
            return {"success": True, "action_item": updated_item}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Action item not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating action item: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update action item: {str(e)}"
        )


@app.delete("/api/action-items/{item_id}")
async def delete_action_item(item_id: str):
    """Delete an action item"""
    try:
        if not db_service:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database service is not initialized"
            )
        
        success = db_service.delete_action_item(item_id)
        
        if success:
            return {"success": True, "message": "Action item deleted successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Action item not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting action item: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete action item: {str(e)}"
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

