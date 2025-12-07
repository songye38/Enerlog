from fastapi import APIRouter, Depends,HTTPException,Body,UploadFile,File
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta,timezone

from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
import cloudinary

import os
from dotenv import load_dotenv




from app.db.database import get_db
from app.db.models import Behave, TagTypeEnum, UserTag, Tag, PhaseEnum, BehaveTag, EnergyLevelEnum, BehaveStatusEnum,BehavePhoto
from app.db.schemas import BehaveResponse, BehaveCreateRequest,SelectActivityRequest,RecentPendingBehaveResponse,BehaveUpdateRequest,BehaveCompleteResponse
from app.auth.dependencies import get_current_user
from app.services.user_energy_tag_stats import update_before_stats,update_after_stats

router = APIRouter(prefix="/behave", tags=["Behave"])

load_dotenv()
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)


# -------------------------------
# 사용자가 선택한 태그를 저장하는 라우터
# -------------------------------
# def save_tags(db: Session, behave: Behave, user_tags: List = None, preset_tags: List = None):
#     # None-safe 처리
#     user_tags = user_tags or []
#     preset_tags = preset_tags or []

#     # 1️⃣ user_tags 저장
#     for tag_data in user_tags:
#         new_tag = Tag(title=tag_data.title, type=TagTypeEnum(tag_data.type))
#         db.add(new_tag)
#         db.flush()

#         user_tag = UserTag(
#             user_id=behave.user_id,
#             title=tag_data.title,
#             type=new_tag.type
#         )
#         user_tag.tags.append(new_tag)
#         db.add(user_tag)
#         db.flush()

#         behave_tag = BehaveTag(
#             behave_id=behave.id,
#             phase=PhaseEnum.before
#         )
#         db.add(behave_tag)
#         db.flush()
#         behave_tag.tags.append(new_tag)

#     # 2️⃣ preset_tags 저장
#     for tag_data in preset_tags:
#         if tag_data.id:
#             tag = db.query(Tag).filter(Tag.id == tag_data.id).first()
#             if tag:
#                 behave_tag = BehaveTag(
#                     behave_id=behave.id,
#                     phase=PhaseEnum.before
#                 )
#                 db.add(behave_tag)
#                 db.flush()
#                 behave_tag.tags.append(tag)

#     db.commit()

def save_tags(db: Session, behave: Behave, phase: PhaseEnum, user_tags: List = None, preset_tags: List = None):
    user_tags = user_tags or []
    preset_tags = preset_tags or []

    # user_tags
    for tag_data in user_tags:
        new_tag = Tag(title=tag_data.title, type=TagTypeEnum(tag_data.type))
        db.add(new_tag)
        db.flush()

        user_tag = UserTag(
            user_id=behave.user_id,
            title=tag_data.title,
            type=new_tag.type
        )
        user_tag.tags.append(new_tag)
        db.add(user_tag)
        db.flush()

        behave_tag = BehaveTag(
            behave_id=behave.id,
            phase=phase
        )
        db.add(behave_tag)
        db.flush()
        behave_tag.tags.append(new_tag)

    # preset_tags
    for tag_data in preset_tags:
        if tag_data.id:
            tag = db.query(Tag).filter(Tag.id == tag_data.id).first()
            if tag:
                behave_tag = BehaveTag(
                    behave_id=behave.id,
                    phase=phase
                )
                db.add(behave_tag)
                db.flush()
                behave_tag.tags.append(tag)

    db.commit()



# --------------------------------------------
# 사용자가 자신의 에너지 레벨을 초기에 저장하는 라우터
# --------------------------------------------
@router.post("/", response_model=BehaveResponse)
def create_behave(
    payload: BehaveCreateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    print("payload", payload)

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
        phase=PhaseEnum.before,
        user_tags=payload.user_tags,
        preset_tags=payload.preset_tags
    )

    # 3️⃣ before_phase stats 업데이트
    update_before_stats(db, behave)

    # 4️⃣ Pydantic ORM 변환해서 반환
    return BehaveResponse.from_orm(behave)


# -------------------------------------------------
# 사용자가 behave_id를 바탕으로 activity를 추가하는 함수
# -------------------------------------------------
@router.patch("/{behave_id}/select-activity", response_model=BehaveResponse)
def select_activity(
    behave_id: UUID,
    payload: SelectActivityRequest = Body(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    behave = db.query(Behave).filter(
        Behave.id == behave_id,
        Behave.user_id == current_user.id
    ).first()

    if not behave:
        raise HTTPException(status_code=404, detail="Behave not found")

    # 🟢 activity / template 구분해서 업데이트
    if payload.activity_id:
        behave.activity_id = payload.activity_id
        behave.activity_template_id = None
    elif payload.activity_template_id:
        behave.activity_template_id = payload.activity_template_id
        behave.activity_id = None
    else:
        raise HTTPException(status_code=400, detail="No activity provided")

    behave.status = BehaveStatusEnum.activity_pending

    db.commit()
    db.refresh(behave)

    return BehaveResponse.from_orm(behave)




# ---------------------------------------------------
# 사용자의 최근 행동 중에서 activity_pending인것만 가져오기
# ---------------------------------------------------
@router.get("/recent-pending", response_model=List[RecentPendingBehaveResponse])
def get_recent_pending_behaves(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    now = datetime.now(timezone.utc)
    since = now - timedelta(hours=24)

    behaves = (
        db.query(Behave)
        .filter(
            Behave.user_id == current_user.id,
            Behave.status == BehaveStatusEnum.activity_pending,
            Behave.is_deleted == False,
            Behave.created_at >= since
        )
        .all()
    )

    result = []
    for b in behaves:
        if b.activity:
            title = b.activity.title
        elif b.activity_template:
            title = b.activity_template.title
        else:
            title = "Unknown"

        result.append(
            RecentPendingBehaveResponse(
                behave_id=b.id,
                user_id=b.user_id,
                activity_id=b.activity_id,
                activity_template_id=b.activity_template_id,
                title=title,
                created_at=b.created_at,
                before_energy=b.before_energy  # 여기 넣기
            )
        )
    return result

# ---------------------------------------------------
# behave_id를 기반으로 최종 behave 테이블 업데이트
# ---------------------------------------------------
@router.patch("/{behave_id}/complete", response_model=BehaveCompleteResponse)
def update_behave_after(
    behave_id: UUID,
    payload: BehaveUpdateRequest = Body(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    behave = (
        db.query(Behave)
        .filter(
            Behave.id == behave_id,
            Behave.user_id == current_user.id,
            Behave.is_deleted == False
        )
        .first()
    )

    if not behave:
        raise HTTPException(status_code=404, detail="Behave not found")

    # after 데이터 업데이트
    if payload.after_energy is not None:
        behave.after_energy = payload.after_energy

    if payload.after_description is not None:
        behave.after_description = payload.after_description

    behave.status = payload.status or BehaveStatusEnum.completed

    # 저장
    db.commit()
    db.refresh(behave)

    # After 태그 저장
    save_tags(
        db=db,
        behave=behave,
        phase=PhaseEnum.after,  # ← 수정 포인트
        user_tags=payload.user_tags,
        preset_tags=payload.preset_tags
    )

    update_after_stats(db,behave)

    return BehaveCompleteResponse.from_orm(behave)


@router.post("/behave/upload-photo/{behave_id}")
async def upload_photo(behave_id: str, file: UploadFile = File(...)):
    # Cloudinary 업로드
    result = upload(file.file, folder=f"enerlog/{behave_id}")
    photo_url = result.get("secure_url")
    
    # DB 저장 로직 예시 (SQLAlchemy)
    db: Session = Depends(get_db),
    new_photo = BehavePhoto(behave_id=behave_id, photo_url=photo_url)
    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)

    return {"photo_url": photo_url, "id": new_photo.id}