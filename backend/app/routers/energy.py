from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db  # SessionLocal 반환
from app.db.models import EnergyLevelEnum,EnergyLevel
from app.db.schemas import EnergyLevelResponse,EnergyLevelRequest

router = APIRouter(prefix="/energy", tags=["Energy"])




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