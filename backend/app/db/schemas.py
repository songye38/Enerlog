from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from uuid import UUID
from enum import Enum
from app.db.models import EnergyLevelEnum

# -----------------------
# Enums
# -----------------------
class BehaveStatusEnum(str, Enum):
    emotion_recorded = "emotion_recorded"
    activity_pending = "activity_pending"
    completed = "completed"

class TagTypeEnum(str, Enum):
    body = "body"
    mental = "mental"

class PhaseEnum(str, Enum):
    before = "before"
    after = "after"

# -----------------------
# User Schemas
# -----------------------
class UserCreate(BaseModel):
    email: EmailStr
    hashed_password: str
    nickname: Optional[str]

class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    nickname: Optional[str]
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# -----------------------
# Activity Schemas (Energy Level 포함)
# -----------------------
class ActivityCreate(BaseModel):
    user_id: UUID
    title: str
    description: Optional[str] = None
    is_public: Optional[bool] = False
    duration_minutes: Optional[int] = None
    good_point: Optional[str] = None
    insight: Optional[str] = None
    energy_level_id: UUID  # 필수


class EnergyLevelMiniOut(BaseModel):
    id: UUID
    title: str
    value: Optional[int]

    class Config:
        orm_mode = True

class ActivityOut(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    is_public: bool
    duration_minutes: Optional[int]
    good_point: Optional[str]
    insight: Optional[str]
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    energy_level: EnergyLevelMiniOut  # 관계 객체 포함

    class Config:
        orm_mode = True

# -----------------------
# ActivityTemplate Schemas
# -----------------------
class ActivityTemplateCreate(BaseModel):
    title: str
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    good_point: Optional[str] = None
    insight: Optional[str] = None
    energy_level: EnergyLevelEnum  # 0~10 숫자 레벨 Enum


class ActivityTemplateOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    duration_minutes: Optional[int]
    good_point: Optional[str]
    insight: Optional[str]
    created_at: datetime
    updated_at: datetime
    energy_level: EnergyLevelEnum  # Enum 값 그대로

    class Config:
        orm_mode = True


# -----------------------
# EnergyLevel Schemas
# -----------------------
class EnergyLevelCreate(BaseModel):
    user_id: UUID
    title: str
    value: Optional[int] = None
    description: Optional[str] = None

class EnergyLevelOut(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    value: Optional[int]
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True




# -----------------------
# Tag Schemas
# -----------------------
class TagCreate(BaseModel):
    title: str
    type: TagTypeEnum

class TagOut(BaseModel):
    id: UUID
    title: str
    type: TagTypeEnum
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# -----------------------
# PresetTag Schemas
# -----------------------
class PresetTagCreate(BaseModel):
    energy_level_id: UUID
    type: TagTypeEnum
    tag_ids: List[UUID] = []

class PresetTagOut(BaseModel):
    id: UUID
    energy_level_id: UUID
    type: TagTypeEnum
    tags: List[TagOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# -----------------------
# UserTag Schemas
# -----------------------
class UserTagCreate(BaseModel):
    user_id: UUID
    title: str
    type: TagTypeEnum
    tag_ids: List[UUID] = []

class UserTagOut(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    type: TagTypeEnum
    tags: List[TagOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# -----------------------
# BehaveTag Schemas
# -----------------------
class BehaveTagCreate(BaseModel):
    behave_id: UUID
    tag_id: UUID
    phase: PhaseEnum

class BehaveTagOut(BaseModel):
    id: UUID
    behave_id: UUID
    tag: TagOut
    phase: PhaseEnum

    class Config:
        orm_mode = True

# -----------------------
# BehavePhoto Schemas
# -----------------------
class BehavePhotoCreate(BaseModel):
    behave_id: UUID
    photo_url: str

class BehavePhotoOut(BaseModel):
    id: UUID
    behave_id: UUID
    photo_url: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# -----------------------
# Behave Schemas
# -----------------------
class BehaveCreate(BaseModel):
    user_id: UUID
    activity_id: UUID
    before_energy_id: UUID
    after_energy_id: Optional[UUID] = None
    before_description: Optional[str] = None
    after_description: Optional[str] = None
    status: BehaveStatusEnum
    tag_ids: List[UUID] = []  # 태그 선택 시 전달
    photos: List[str] = []    # 사진 URL

class BehaveOut(BaseModel):
    id: UUID
    user_id: UUID
    activity_id: UUID
    before_energy_id: UUID
    after_energy_id: Optional[UUID]
    before_description: Optional[str]
    after_description: Optional[str]
    status: BehaveStatusEnum
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    tags: List[BehaveTagOut] = []
    photos: List[BehavePhotoOut] = []

    class Config:
        orm_mode = True

# -----------------------
# Letter Schemas
# -----------------------
class LetterCreate(BaseModel):
    user_id: UUID
    related_activity_id: Optional[UUID] = None
    content: str

class LetterOut(BaseModel):
    id: UUID
    user_id: UUID
    related_activity_id: Optional[UUID]
    content: str
    created_at: datetime
    updated_at: datetime
    related_activity: Optional[ActivityOut] = None

    class Config:
        orm_mode = True
