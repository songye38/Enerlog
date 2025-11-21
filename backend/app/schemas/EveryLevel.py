import uuid
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class EveryLevelCreate(BaseModel):
    user_id: uuid.UUID
    title: str
    description: Optional[str] = None
    body_conditions: Optional[List[uuid.UUID]] = []
    mental_conditions: Optional[List[uuid.UUID]] = []

class EveryLevelOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: Optional[str]
    body_conditions: List[uuid.UUID]
    mental_conditions: List[uuid.UUID]