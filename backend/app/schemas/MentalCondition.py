import uuid
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class MentalConditionCreate(BaseModel):
    title: str
    count: Optional[int] = 0

class MentalConditionOut(BaseModel):
    id: uuid.UUID
    title: str
    count: int
