import os
from openai import OpenAI
from typing import List
from ..models import ActionItem
import json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMService:
    """Service for interacting with OpenAI API to generate action items"""
    
    def __init__(self):
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        self.client = OpenAI(api_key=openai_api_key)
        self.model = "gpt-4o-mini"
    
    def extract_action_items(self, transcript: str) -> List[ActionItem]:
        """
        Extract action items from a meeting transcript using OpenAI     
        
        Args:
            transcript: The meeting transcript text
            
        Returns:
            List of ActionItem objects
        """
        try:
            # Craft a detailed prompt for extracting action items
            system_prompt = """You are an AI assistant that extracts actionable tasks from meeting transcripts.
Your job is to identify clear, specific action items that need to be completed.

Rules:
- Extract only concrete, actionable tasks (things people need to do)
- Make each action item clear and specific
- Include who is responsible if mentioned
- Include deadlines if mentioned
- Don't include general discussion points or observations
- Return ONLY a JSON array of strings, nothing else
- Each string should be a complete action item
- If no action items are found, return an empty array []

Example output format:
["John will prepare the Q4 report by Friday", "Sarah to review marketing strategy", "Schedule follow-up meeting with client next week"]"""

            user_prompt = f"Extract action items from this meeting transcript:\n\n{transcript}"
            
            # Call OpenAI API
            logger.info(f"Sending request to OpenAI API with model: {self.model}")
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,  # Lower temperature for more consistent outputs
                max_tokens=500
            )
            
            # Extract the response content
            content = response.choices[0].message.content.strip()
            logger.info(f"Received response from OpenAI: {content}")
            
            # Parse the JSON response
            try:
                action_items_text = json.loads(content)
                if not isinstance(action_items_text, list):
                    raise ValueError("Response is not a list")
            except json.JSONDecodeError:
                logger.warning("Failed to parse JSON, attempting to extract from markdown")
                # Sometimes the API returns markdown code blocks, handle that
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                action_items_text = json.loads(content)
            
            # Convert to ActionItem objects
            action_items = []
            for item_text in action_items_text:
                if isinstance(item_text, str) and item_text.strip():
                    action_item = ActionItem(text=item_text.strip())
                    action_items.append(action_item)
            
            logger.info(f"Successfully extracted {len(action_items)} action items")
            return action_items
            
        except Exception as e:
            logger.error(f"Error extracting action items: {str(e)}")
            raise Exception(f"Failed to generate action items: {str(e)}")
    
    def test_connection(self) -> bool:
        """Test if OpenAI API connection is working"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "Say 'API working'"}],
                max_tokens=10
            )
            return True
        except Exception as e:
            error_msg = str(e)
            logger.error(f"API connection test failed: {error_msg}")
            
            # Check if it's a quota issue (still means API key is valid)
            if "429" in error_msg or "quota" in error_msg.lower() or "insufficient_quota" in error_msg:
                logger.info("API key is valid but quota exceeded - connection is working")
                return True  # Consider this as "connected" since API key works
            
            return False

