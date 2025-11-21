import uuid
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class BodyConditionCreate(BaseModel):
    title: str
    count: Optional[int] = 0

class BodyConditionOut(BaseModel):
    id: uuid.UUID
    title: str
    count: int