from fastapi import APIRouter, Depends,HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db  # SessionLocal 반환
from app.db.models import EnergyLevelEnum,EnergyLevel,UserEnergyTagStats,PresetTag,Tag,User
from app.db.schemas import EnergyLevelResponse,EnergyLevelRequest,TagOut,UserTagsResponse,UserTagsRequest
from uuid import UUID
from app.auth.dependencies import get_current_user
from typing import List


router = APIRouter(prefix="/energy", tags=["Energy"])

# -----------------------
# 보조함수
# -----------------------
@router.post("/energy-level-id", response_model=EnergyLevelResponse)
def get_energy_level_id(request: EnergyLevelRequest, db: Session = Depends(get_db)):
    """
    JSON 바디로 level(int) 받음 → 해당 EnergyLevel.id 반환
    """
    try:
        enum_level = EnergyLevelEnum(request.level)  # int → Enum
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid energy level")

    record = db.query(EnergyLevel).filter(EnergyLevel.energy_level == enum_level).first()
    if not record:
        raise HTTPException(status_code=404, detail="Energy level not found")

    return {"id": str(record.id)}


# ---------------------------------
# get_user_tags함수에서 사용하는 보조함수
# ---------------------------------
def get_tags_for_user_energy(db: Session, user_id: UUID, energy_level: EnergyLevelEnum) -> List[TagOut]:
    stats = (
        db.query(UserEnergyTagStats)
        .join(UserEnergyTagStats.tag)
        .filter(
            UserEnergyTagStats.user_id == user_id,
            UserEnergyTagStats.energy_level == energy_level
        )
        .all()
    )
    stats_tags = [stat.tag for stat in stats] if stats else []

    preset_tags = (
        db.query(Tag)
        .join(PresetTag.tags)
        .join(PresetTag.energy_level)
        .filter(PresetTag.energy_level.has(energy_level=energy_level))
        .all()
    )

    # stats + preset_tags 합치고 중복 제거
    all_tags_dict = {tag.id: tag for tag in stats_tags + preset_tags}

    return [TagOut(
        id=tag.id,
        title=tag.title,
        type=tag.type,
        created_at=tag.created_at,
        updated_at=tag.updated_at
    ) for tag in all_tags_dict.values()]

# -----------------------------
# 사용자의 태그들을 모두 가져오는 라우터
# -----------------------------
@router.get("/tags", response_model=UserTagsResponse)
def get_user_tags(
    energy_level: EnergyLevelEnum = Query(..., description="0~10 에너지 레벨"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tags = get_tags_for_user_energy(db, current_user.id, energy_level)
    return UserTagsResponse(tags=tags)