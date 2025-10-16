from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime
import uuid


class TranscriptRequest(BaseModel):
    """Request model for transcript analysis"""
    transcript: str = Field(..., min_length=10, description="Meeting transcript text")
    
    class Config:
        json_schema_extra = {
            "example": {
                "transcript": "Team meeting notes: John will prepare the Q4 report by Friday. Sarah needs to review the marketing strategy. Mike should schedule a follow-up meeting with the client next week."
            }
        }


class ActionItem(BaseModel):
    """Model for a single action item"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str = Field(..., description="Action item description")
    status: Literal["pending", "completed"] = Field(default="pending")
    priority: Literal["high", "medium", "low"] = Field(default="medium", description="Priority level")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "text": "Prepare Q4 report",
                "status": "pending",
                "priority": "high",
                "createdAt": "2024-01-15T10:30:00Z",
                "updatedAt": None
            }
        }


class ActionItemsResponse(BaseModel):
    """Response model containing list of action items"""
    success: bool = True
    action_items: List[ActionItem]
    total_count: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "action_items": [
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "text": "Prepare Q4 report by Friday",
                        "status": "pending",
                        "createdAt": "2024-01-15T10:30:00Z"
                    }
                ],
                "total_count": 1
            }
        }


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    detail: Optional[str] = None

