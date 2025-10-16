import os
import logging
from datetime import datetime
import requests
from typing import List, Optional
from ..models import ActionItem

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatabaseService:
    """Service for database operations using Supabase REST API"""

    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_ANON_KEY")

        if not self.supabase_url or not self.supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")

        # Set up headers for Supabase REST API
        self.headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        logger.info("✅ Supabase REST API client initialized successfully")

    def create_action_item(self, action_item: ActionItem) -> ActionItem:
        """Insert a new action item into the database"""
        try:
            current_time = datetime.utcnow().isoformat()
            item_data = {
                "id": action_item.id,
                "text": action_item.text,
                "status": action_item.status,
                "priority": action_item.priority,
                "created_at": current_time,
                "updated_at": current_time  # Set updated_at to current time on creation
            }

            url = f"{self.supabase_url}/rest/v1/action_items"
            response = requests.post(url, json=item_data, headers=self.headers)
            response.raise_for_status()

            logger.info(f"Created action item with ID: {action_item.id}")
            return action_item

        except Exception as e:
            logger.error(f"❌ Database insertion error: {e}")
            raise

    def create_multiple_action_items(self, action_items: List[ActionItem]) -> List[ActionItem]:
        """Insert multiple action items into the database"""
        try:
            current_time = datetime.utcnow().isoformat()
            items_data = []
            for item in action_items:
                items_data.append({
                    "id": item.id,
                    "text": item.text,
                    "status": item.status,
                    "priority": item.priority,
                    "created_at": current_time,
                    "updated_at": current_time  # Set updated_at to current time on creation
                })

            url = f"{self.supabase_url}/rest/v1/action_items"
            response = requests.post(url, json=items_data, headers=self.headers)
            response.raise_for_status()

            logger.info(f"Created {len(action_items)} action items")
            return action_items

        except Exception as e:
            logger.error(f"❌ Database insertion error: {e}")
            raise

    def get_all_action_items(self) -> List[ActionItem]:
        """Fetch all action items"""
        try:
            url = f"{self.supabase_url}/rest/v1/action_items"
            params = {"order": "created_at.desc"}
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()

            data = response.json()
            action_items = []
            for row in data:
                action_item = ActionItem(
                    id=row["id"],
                    text=row["text"],
                    status=row["status"],
                    priority=row["priority"],
                    createdAt=datetime.fromisoformat(row["created_at"].replace('Z', '+00:00')),
                    updatedAt=datetime.fromisoformat(row["updated_at"].replace('Z', '+00:00')) if row.get("updated_at") else None
                )
                action_items.append(action_item)

            logger.info(f"Retrieved {len(action_items)} action items")
            return action_items

        except Exception as e:
            logger.error(f"❌ Error retrieving action items: {e}")
            raise

    def update_action_item(self, item_id: str, updates: dict) -> Optional[ActionItem]:
        """Update an existing action item"""
        try:
            updates["updated_at"] = datetime.utcnow().isoformat()
            
            url = f"{self.supabase_url}/rest/v1/action_items"
            params = {"id": f"eq.{item_id}"}
            response = requests.patch(url, json=updates, headers=self.headers, params=params)
            response.raise_for_status()

            data = response.json()
            if data:
                logger.info(f"Updated item {item_id}")
                row = data[0]
                return ActionItem(
                    id=row["id"],
                    text=row["text"],
                    status=row["status"],
                    priority=row["priority"],
                    createdAt=datetime.fromisoformat(row["created_at"].replace('Z', '+00:00')),
                    updatedAt=datetime.fromisoformat(row["updated_at"].replace('Z', '+00:00')) if row.get("updated_at") else None
                )
            else:
                logger.warning(f"No item found with ID {item_id}")
                return None

        except Exception as e:
            logger.error(f"❌ Error updating item: {e}")
            raise

    def delete_action_item(self, item_id: str) -> bool:
        """Delete an item from the database"""
        try:
            url = f"{self.supabase_url}/rest/v1/action_items"
            params = {"id": f"eq.{item_id}"}
            response = requests.delete(url, headers=self.headers, params=params)
            response.raise_for_status()

            logger.info(f"Deleted item {item_id}")
            return True

        except Exception as e:
            logger.error(f"❌ Error deleting item: {e}")
            raise

    def test_connection(self) -> bool:
        """Test Supabase connection"""
        try:
            url = f"{self.supabase_url}/rest/v1/action_items"
            params = {"select": "id", "limit": "1"}
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            
            logger.info("✅ Database connection test successful")
            return True
        except Exception as e:
            logger.error(f"❌ Database connection failed: {e}")
            return False
