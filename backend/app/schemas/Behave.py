import uuid
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class BehaveCreate(BaseModel):
    user_id: uuid.UUID
    before_energy: int
    after_energy: Optional[int]
    before_description: Optional[str] = None
    after_description: Optional[str] = None
    activity_title: Optional[str] = None
    status: Optional[bool] = None

class BehaveOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    before_energy: int
    after_energy: Optional[int]
    before_description: Optional[str]
    after_description: Optional[str]
    activity_title: Optional[str]
    status: Optional[bool]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

# -----------------------------
# Behave_BodyCondition
# -----------------------------
class BehaveBodyConditionCreate(BaseModel):
    behave_id: uuid.UUID
    body_condition_id: uuid.UUID

class BehaveBodyConditionOut(BaseModel):
    behave_id: uuid.UUID
    body_condition_id: uuid.UUID

# -----------------------------
# Behave_MentalCondition
# -----------------------------
class BehaveMentalConditionCreate(BaseModel):
    behave_id: uuid.UUID
    mental_condition_id: uuid.UUID

class BehaveMentalConditionOut(BaseModel):
    behave_id: uuid.UUID
    mental_condition_id: uuid.UUID
