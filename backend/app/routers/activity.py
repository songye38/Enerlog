from fastapi import APIRouter, Depends,HTTPException,Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from uuid import UUID
import random

from app.db.database import get_db  # SessionLocal 반환
from app.db.models import ActivityTemplate,EnergyLevel,Activity,User,UserSettings, Behave
from app.db.schemas import ActivityTemplateOut,ActivityOut,ActivityCreate,ActivityUpdate
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/activities", tags=["Activities"])

# -----------------------
# 사용자 정의 활동 생성
# -----------------------
@router.post("/", response_model=ActivityOut)
def create_activity(
    activity_in: ActivityCreate,  # user_id 제거한 새로운 Pydantic 모델
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # 로그인한 유저
):
    # EnergyLevel 조회
    energy = db.query(EnergyLevel).filter(EnergyLevel.value == activity_in.energy_level.value).first()
    if not energy:
        raise HTTPException(status_code=404, detail="Energy level not found")

    # Activity 생성
    activity = Activity(
        user_id=current_user.id,  # payload가 아니라 현재 로그인한 유저 사용
        title=activity_in.title,
        description=activity_in.description,
        duration_minutes=activity_in.duration_minutes,
        good_point=activity_in.good_point,
        insight=activity_in.insight,
        energy_level_id=energy.id
    )

    try:
        db.add(activity)
        db.commit()
        db.refresh(activity)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create activity: {e}")

    return activity



# -------------------------------------
# user_id를 기반으로 사용자가 만든 활동 fetch
# -------------------------------------
@router.get("/", response_model=List[ActivityTemplateOut])
def list_user_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # 로그인한 유저
):
    activities = (
        db.query(Activity)
        .filter(Activity.is_deleted == False)
        .filter(Activity.user_id == current_user.id)  # 사용자별 필터
        .all()
    )

    return [ActivityTemplateOut.from_orm_obj(t) for t in activities]


# --------------------------------
# activity_id를 기반으로 활동 내용 수정
# --------------------------------
@router.put("/{activity_id}", response_model=ActivityTemplateOut)
def update_activity(
    activity_id: UUID,
    payload: ActivityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 기존 활동 조회
    activity = (
        db.query(Activity)
        .filter(Activity.id == activity_id)
        .filter(Activity.is_deleted == False)
        .first()
    )

    if not activity:
        raise HTTPException(status_code=404, detail="활동이 존재하지 않습니다.")

    if activity.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다.")

    # 변경 가능한 필드만 업데이트
    if payload.title is not None:
        activity.title = payload.title
    if payload.description is not None:
        activity.description = payload.description
    if payload.duration_minutes is not None:
        activity.duration_minutes = payload.duration_minutes
    if payload.good_point is not None:
        activity.good_point = payload.good_point

    # energy_level ORM 객체 조회 후 할당
    if payload.energy_level is not None:
        level_obj = db.query(EnergyLevel).filter(EnergyLevel.value == payload.energy_level).first()
        if not level_obj:
            raise HTTPException(status_code=404, detail="해당 에너지 레벨이 존재하지 않습니다.")
        activity.energy_level = level_obj  # ORM 객체로 안전하게 할당

    # 커밋 & 갱신
    db.commit()
    db.refresh(activity)

    return ActivityTemplateOut.from_orm_obj(activity)

# -------------------------------
# activity_id를 기반으로 삭제하는 함수
# -------------------------------
@router.delete("/{activity_id}")
def delete_activity(
    activity_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = (
        db.query(Activity)
        .filter(Activity.id == activity_id)
        .filter(Activity.is_deleted == False)
        .first()
    )

    if not activity:
        raise HTTPException(status_code=404, detail="활동이 존재하지 않습니다.")

    if activity.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다.")

    activity.is_deleted = True  # soft delete

    db.commit()

    return {"message": "활동이 삭제되었습니다."}


# @router.get("/{activity_id}", response_model=ActivityOut)
# def get_activity(activity_id: UUID, db: Session = Depends(get_db)):
#     activity = db.query(Activity).filter(Activity.id == activity_id, Activity.is_deleted == False).first()
#     if not activity:
#         raise HTTPException(status_code=404, detail="Activity not found")
#     return activity




# -----------------------
# ActivityTemplate CRUD
# -----------------------
@router.get("/templates", response_model=List[ActivityTemplateOut])
def list_activity_templates(db: Session = Depends(get_db)):
    templates = db.query(ActivityTemplate).all()
    # 각 ORM 객체를 Pydantic 모델로 변환
    return [ActivityTemplateOut.from_orm_obj(t) for t in templates]


# @router.get("/templates/{user_id}", response_model=ActivityTemplateOut)
# def get_activity_template(template_id: UUID, db: Session = Depends(get_db)):
#     template = db.query(ActivityTemplate).filter(ActivityTemplate.id == template_id).first()
#     if not template:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return template






# -----------------------
# 추천 활동 API
# -----------------------
# @router.get("/recommend", response_model=List[ActivityTemplateOut])
# def recommend_activities(
#     energy_level: int = Query(..., ge=0, le=10, description="사용자 현재 에너지 레벨"),
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     # 1. 사용자 환경 설정 조회 (최대 추천 개수)
#     settings = db.query(UserSettings).filter_by(user_id=current_user.id).first()
#     max_count = settings.max_recommendations if settings else 5

#     # 2. 사용자 활동 조회 (해당 에너지 레벨)
#     user_activities = (
#         db.query(Activity)
#         .join(EnergyLevel)
#         .filter(
#             Activity.user_id == current_user.id,
#             Activity.is_deleted == False,
#             EnergyLevel.value == energy_level
#         )
#         .all()
#     )

#     # 3. 템플릿 활동 조회 (해당 에너지 레벨)
#     templates = (
#         db.query(ActivityTemplate)
#         .join(EnergyLevel)
#         .filter(EnergyLevel.value == energy_level)
#         .all()
#     )

#     # 4. 추천 리스트 구성
#     recommended = []
    
#     if len(user_activities) >= max_count:
#         # 사용자 활동만 max_count만큼 선택
#         recommended = random.sample(user_activities, max_count)
#     else:
#         # 사용자 활동 전부 + 부족한 슬롯 템플릿으로 채우기
#         recommended = user_activities.copy()
#         remaining_slots = max_count - len(recommended)
#         if remaining_slots > 0:
#             # 템플릿 중 부족한 개수만큼 샘플링
#             selected_templates = random.sample(templates, min(remaining_slots, len(templates)))
#             recommended.extend(selected_templates)

#     # 5. 최종 섞기
#     random.shuffle(recommended)

#     # 6. Pydantic 변환 후 반환
#     return [ActivityTemplateOut.from_orm_obj(a) for a in recommended]

@router.get("/recommend", response_model=List[ActivityTemplateOut])
def recommend_activities(
    energy_level: int = Query(..., ge=0, le=10, description="사용자 현재 에너지 레벨"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    import random
    from sqlalchemy import func

    # 1. 사용자 설정 조회
    settings = db.query(UserSettings).filter_by(user_id=current_user.id).first()
    max_count = settings.max_recommendations if settings else 5

    # 2. 사용자 활동 조회
    user_activities = (
        db.query(Activity)
        .join(EnergyLevel)
        .filter(
            Activity.user_id == current_user.id,
            Activity.is_deleted == False,
            EnergyLevel.value == energy_level
        )
        .all()
    )

    # 3. 템플릿 활동 조회
    templates = (
        db.query(ActivityTemplate)
        .join(EnergyLevel)
        .filter(EnergyLevel.value == energy_level)
        .all()
    )

    # 4. 추천 리스트 구성
    recommended = []
    if len(user_activities) >= max_count:
        recommended = random.sample(user_activities, max_count)
    else:
        recommended = user_activities.copy()
        remaining_slots = max_count - len(recommended)
        if remaining_slots > 0:
            selected_templates = random.sample(templates, min(remaining_slots, len(templates)))
            recommended.extend(selected_templates)

    random.shuffle(recommended)

    # 5. Behave에서 수행 횟수(count) 조회 후 Pydantic 변환
    result = []
    for activity in recommended:
        count = db.query(func.count(Behave.id)).filter(
            Behave.user_id == current_user.id,
            Behave.activity_id == activity.id,
            Behave.is_deleted == False
        ).scalar()

        result.append(ActivityTemplateOut.from_orm_obj(activity, count=count))

    return result
