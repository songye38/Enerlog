from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.database import get_db  # SessionLocal 반환
from app.db.models import Behave,TagTypeEnum,UserTag,Tag,PhaseEnum,BehaveTag
from app.db.schemas import BehaveResponse,BehaveCreateRequest
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/behave", tags=["Behave"])

def save_tags(db: Session, behave: Behave, user_tags: list, preset_tags: list):
    # 1️⃣ user_tags 저장
    for tag_data in user_tags:
        new_tag = Tag(title=tag_data["title"], type=TagTypeEnum(tag_data["type"]))
        db.add(new_tag)
        db.flush()


        # 다대다 관계 만들기
        user_tag = UserTag(user_id=behave.user_id, title=tag_data["title"], type=new_tag.type)
        user_tag.tags.append(new_tag)
        db.add(user_tag)
        db.flush()


        # 다대다 관계로 만든 태그들을 behaveTag에 저장
        behave_tag = BehaveTag(behave_id=behave.id, tag_id=new_tag.id, phase=PhaseEnum.before)
        db.add(behave_tag)

    # 2️⃣ preset_tags 저장
    for tag_data in preset_tags:
        behave_tag = BehaveTag(behave_id=behave.id, tag_id=UUID(tag_data["id"]), phase=PhaseEnum.before)
        db.add(behave_tag)

    db.commit()


@router.post("/", response_model=BehaveResponse)
def create_behave(
    payload: BehaveCreateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Behave 생성 + user_tags, preset_tags 저장
    """

    # 1️⃣ Behave 생성
    behave = Behave(
        user_id=current_user.id,
        before_energy=payload.before_energy,
        before_description=payload.before_description,
        status=payload.status
    )
    db.add(behave)
    db.flush()  # id 생성

    # 2️⃣ 태그 저장
    save_tags(
        db=db,
        behave=behave,
        user_tags=payload.user_tags,
        preset_tags=payload.preset_tags
    )

    db.refresh(behave)
    return behave
