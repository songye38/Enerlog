from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db  # SessionLocal 반환
from app.db.models import ActivityTemplate
from app.db.schemas import ActivityTemplateOut

router = APIRouter(prefix="/activities", tags=["Activities"])

# -----------------------
# Activity CRUD
# -----------------------
# @router.post("/", response_model=ActivityOut)
# def create_activity(activity_in: ActivityCreate, db: Session = Depends(get_db)):
#     # 에너지 레벨 확인
#     energy = db.query(EnergyLevel).filter(EnergyLevel.id == activity_in.energy_level_id).first()
#     if not energy:
#         raise HTTPException(status_code=404, detail="Energy level not found")

#     activity = Activity(
#         user_id=activity_in.user_id,
#         title=activity_in.title,
#         description=activity_in.description,
#         duration_minutes=activity_in.duration_minutes,
#         good_point=activity_in.good_point,
#         insight=activity_in.insight,
#         energy_level_id=energy.id
#     )
#     db.add(activity)
#     db.commit()
#     db.refresh(activity)
#     return activity

# @router.get("/", response_model=List[ActivityOut])
# def list_activities(db: Session = Depends(get_db)):
#     return db.query(Activity).filter(Activity.is_deleted == False).all()

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
