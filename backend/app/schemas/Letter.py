import uuid
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class LetterCreate(BaseModel):
    user_id: uuid.UUID
    related_activity_id: uuid.UUID
    content: str

class LetterOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    related_activity_id: uuid.UUID
    content: str
    created_at: Optional[datetime]