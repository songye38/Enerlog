from datetime import datetime
from sqlalchemy.sql import func
import enum
import uuid
from sqlalchemy import (
    Column, String, Integer, Boolean, Text, ForeignKey, Enum, DateTime
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

# -----------------------
# Behave Status Enum
# -----------------------
class BehaveStatusEnum(str, enum.Enum):
    emotion_recorded = "emotion_recorded"
    activity_pending = "activity_pending"
    completed = "completed"

# -----------------------
# Tag Type Enum
# -----------------------
class TagTypeEnum(str, enum.Enum):
    body = "body"
    mental = "mental"

# -----------------------
# energy Level Enum
# -----------------------
class EnergyLevelEnum(int, enum.Enum):
    level_0 = 0
    level_1 = 1
    level_2 = 2
    level_3 = 3
    level_4 = 4
    level_5 = 5
    level_6 = 6
    level_7 = 7
    level_8 = 8
    level_9 = 9
    level_10 = 10

# -----------------------
# Phase Enum
# -----------------------
class PhaseEnum(str, enum.Enum):
    before = "before"
    after = "after"

# -----------------------
# Users
# -----------------------
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    nickname = Column(String(50))
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    activities = relationship("Activity", back_populates="user")
    user_tags = relationship("UserTag", back_populates="user")
    behaves = relationship("Behave", back_populates="user")
    letters = relationship("Letter", back_populates="user")

# -----------------------
# Activities
# -----------------------
class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    is_public = Column(Boolean, default=False)
    duration_minutes = Column(Integer)
    good_point = Column(Text)
    insight = Column(Text)

    # 에너지 레벨 FK
    energy_level_id = Column(UUID(as_uuid=True), ForeignKey("energy_levels.id"), nullable=False)
    energy_level = relationship("EnergyLevel")


    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="activities")
    behaves = relationship("Behave", back_populates="activity")
    letters = relationship("Letter", back_populates="related_activity")

# -----------------------
# Activity Templates
# -----------------------
class ActivityTemplate(Base):
    __tablename__ = "activity_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    duration_minutes = Column(Integer)
    good_point = Column(Text)
    insight = Column(Text)

    # 에너지 레벨 FK
    energy_level_id = Column(UUID(as_uuid=True), ForeignKey("energy_levels.id"), nullable=False)
    energy_level = relationship("EnergyLevel")  # 관계 연결

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# -----------------------
# Energy Levels
# -----------------------
class EnergyLevel(Base):
    __tablename__ = "energy_levels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    energy_level = Column(Enum(EnergyLevelEnum), nullable=False)
    value = Column(Integer)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# -----------------------
# Tags
# -----------------------
class Tag(Base):
    __tablename__ = "tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    type = Column(Enum(TagTypeEnum), nullable=False)   # 'body' / 'mental'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# -----------------------
# Preset Tags
# -----------------------
class PresetTag(Base):
    __tablename__ = "preset_tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        # 에너지 레벨 FK
    energy_level_id = Column(UUID(as_uuid=True), ForeignKey("energy_levels.id"), nullable=False)
    energy_level = relationship("EnergyLevel", backref="preset_tags")


    type = Column(String(50), nullable=False)  # 'body' / 'mental'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class PresetTagTags(Base):
    __tablename__ = "preset_tag_tags"
    preset_tag_id = Column(UUID(as_uuid=True), ForeignKey("preset_tags.id"), primary_key=True)
    tag_id = Column(UUID(as_uuid=True), ForeignKey("tags.id"), primary_key=True)

# -----------------------
# User Tags
# -----------------------
class UserTag(Base):
    __tablename__ = "user_tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # 'body' / 'mental'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="user_tags")

class UserTagTags(Base):
    __tablename__ = "user_tag_tags"

    user_tag_id = Column(UUID(as_uuid=True), ForeignKey("user_tags.id"), primary_key=True)
    tag_id = Column(UUID(as_uuid=True), ForeignKey("tags.id"), primary_key=True)

# -----------------------
# Behave Tags
# -----------------------
class BehaveTag(Base):
    __tablename__ = "behave_tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    behave_id = Column(UUID(as_uuid=True), ForeignKey("behave.id"))
    tag_id = Column(UUID(as_uuid=True), ForeignKey("tags.id"))
    phase = Column(Enum(PhaseEnum), nullable=False)   # 'before' / 'after'

class BehaveTagTags(Base):
    __tablename__ = "behave_tag_tags"

    behave_tag_id = Column(UUID(as_uuid=True), ForeignKey("behave_tags.id"), primary_key=True)
    tag_id = Column(UUID(as_uuid=True), ForeignKey("tags.id"), primary_key=True)

# -----------------------
# Behave
# -----------------------
class Behave(Base):
    __tablename__ = "behave"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id"))
    before_energy_id = Column(UUID(as_uuid=True), ForeignKey("energy_levels.id"))
    after_energy_id = Column(UUID(as_uuid=True), ForeignKey("energy_levels.id"))
    before_description = Column(Text)
    after_description = Column(Text)
    status = Column(Enum(BehaveStatusEnum), nullable=False)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="behaves")
    activity = relationship("Activity", back_populates="behaves")
    tags = relationship("BehaveTag", backref="behave")
    photos = relationship("BehavePhoto", back_populates="behave")

# -----------------------
# Behave Photos
# -----------------------
class BehavePhoto(Base):
    __tablename__ = "behave_photos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    behave_id = Column(UUID(as_uuid=True), ForeignKey("behave.id"))
    photo_url = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    behave = relationship("Behave", back_populates="photos")

# -----------------------
# Letter
# -----------------------
class Letter(Base):
    __tablename__ = "letter"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    related_activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id"), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="letters")
    related_activity = relationship("Activity", back_populates="letters")
