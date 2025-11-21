import uuid
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    nickname: str
    email: EmailStr
    hash_pw: str

class UserOut(BaseModel):
    id: uuid.UUID
    nickname: str
    email: EmailStr
    created_at: Optional[datetime]
    updated_at: Optional[datetime]