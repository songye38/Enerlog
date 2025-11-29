from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.db.database import get_db
from app.db.models import Behave, TagTypeEnum, UserTag, Tag, PhaseEnum, BehaveTag, EnergyLevelEnum, BehaveStatusEnum
from app.db.schemas import BehaveResponse, BehaveCreateRequest
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/behave", tags=["Behave"])

def save_tags(db: Session, behave: Behave, user_tags: List, preset_tags: List):
    # 1️⃣ user_tags 저장
    for tag_data in user_tags:
        # Pydantic 속성 접근
        new_tag = Tag(title=tag_data.title, type=TagTypeEnum(tag_data.type))
        db.add(new_tag)
        db.flush()  # id 생성

        # 다대다 관계 만들기
        user_tag = UserTag(user_id=behave.user_id, title=tag_data.title, type=new_tag.type)
        user_tag.tags.append(new_tag)
        db.add(user_tag)
        db.flush()

        # BehaveTag 저장 (컬럼명 tag_ref_id 가정)
        behave_tag = BehaveTag(
            behave_id=behave.id,
            tag_ref_id=new_tag.id,  # 실제 컬럼명 확인
            phase=PhaseEnum.before
        )
        db.add(behave_tag)

    # 2️⃣ preset_tags 저장
    for tag_data in preset_tags:
        if tag_data.id:  # None 체크
            behave_tag = BehaveTag(
                behave_id=behave.id,
                tag_ref_id=UUID(tag_data.id),  # 컬럼명 tag_ref_id 사용
                phase=PhaseEnum.before
            )
            db.add(behave_tag)

    db.commit()


@router.post("/")
def create_behave(
    payload: BehaveCreateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    
    print("payload",payload)
    """
    Behave 생성 + user_tags, preset_tags 저장
    """

    # 1️⃣ Behave 생성
    behave = Behave(
        user_id=current_user.id,
        before_energy=payload.before_energy,
        before_description=payload.before_description,
        status=BehaveStatusEnum(payload.status)
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

    # db.refresh(behave)

    # 3️⃣ Pydantic 모델로 명시적 반환
    response = BehaveResponse(
        id=behave.id,
        user_id=behave.user_id,
        before_energy=behave.before_energy,
        before_description=behave.before_description,
        status=behave.status
    )
    return response
