from sqlalchemy.orm import Session
from app.db.models import PresetTag, EnergyLevelEnum, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid

# -----------------------------
# DB 연결 설정 (PostgreSQL 예시)
# -----------------------------
DATABASE_URL = "postgresql://user:password@localhost:5432/enerlog"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# -----------------------------
# 예시 PresetTag 데이터
# -----------------------------
PRESET_TAGS = [
    {
        "energy_level_id": 1,  # 실제 energy_levels.id 참조 필요
        "type": "body"
    },
    {
        "energy_level_id": 1,
        "type": "mental"
    },
    {
        "energy_level_id": 2,
        "type": "body"
    },
    {
        "energy_level_id": 2,
        "type": "mental"
    },
    # 필요하면 level 0~10 모두 추가 가능
]

# -----------------------------
# DB에 데이터 넣기
# -----------------------------
def seed_preset_tags():
    db: Session = SessionLocal()
    try:
        for data in PRESET_TAGS:
            preset_tag = PresetTag(
                id=uuid.uuid4(),
                energy_level_id=data["energy_level_id"],
                type=data["type"]
            )
            db.add(preset_tag)
        db.commit()
        print("✅ PresetTag 데이터 입력 완료")
    except Exception as e:
        db.rollback()
        print("❌ 데이터 입력 실패:", e)
    finally:
        db.close()

# -----------------------------
# 실행
# -----------------------------
if __name__ == "__main__":
    seed_preset_tags()
