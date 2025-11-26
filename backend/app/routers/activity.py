from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db  # SessionLocal 반환
from app.db.models import ActivityTemplate,EnergyLevel,Activity,User
from app.db.schemas import ActivityTemplateOut,ActivityOut,ActivityCreate
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/activities", tags=["Activities"])

# -----------------------
# Activity CRUD
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
