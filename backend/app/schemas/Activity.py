import uuid
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class ActivityCreate(BaseModel):
    user_id: uuid.UUID
    title: str
    description: Optional[str] = None
    tags: Optional[List[str]] = []
    count: Optional[int] = 0

class ActivityOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: Optional[str]
    tags: List[str]
    count: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]