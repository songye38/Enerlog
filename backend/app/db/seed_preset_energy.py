from app.db.models import EnergyLevel, EnergyLevelEnum  
import uuid
from app.db.database import SessionLocal


# -----------------------------
# 공용 ActivityTemplate 데이터
# -----------------------------
energy_levels_data = [

    # -----------------------------
    # 에너지 레벨 단계
    # -----------------------------

    {   "title": "0 : 완전 방전", 
        "energy_level": EnergyLevelEnum.level_0,
        "value": 0, 
        "description": "몸이 완전히 굳은 느낌이고, 일어나는 것도 벅찰 정도로 에너지가 바닥났어."
    },
    {   "title": "1 : 생존모드", 
        "energy_level": EnergyLevelEnum.level_1,
        "value": 1, 
        "description": "몸이 너무너무 무겁고, 움직이는 것 자체가 너무 힘들어."
    },
    {   "title": "2 : 무기력", 
        "energy_level": EnergyLevelEnum.level_2,
        "value": 2, 
        "description": "몸이 전반적으로 처져 있고 힘이 없지만, 움직이려면 할 수는 있는 정도야."
    },
    {   "title": "3 : 느린 회복", 
        "energy_level": EnergyLevelEnum.level_3,
        "value": 3, 
        "description": "몸이 조금씩 풀리긴 하는데 여전히 피곤해서 오래 집중하긴 어려워."
    },
    {   "title": "4 : 기본 유지", 
        "energy_level": EnergyLevelEnum.level_4,
        "value": 4, 
        "description": "피곤하긴 한데 “아 오늘은 그래도 움직일 순 있겠다” 싶은 정도."
    },
    {   "title": "5: 안정 상태", 
        "energy_level": EnergyLevelEnum.level_5,
        "value": 5, 
        "description": "몸 상태는 무난하고 피로감도 좀 덜하며, 가벼운 활력과 집중력도 느껴져"
    },
    {   "title": "6 : 활동 가능", 
        "energy_level": EnergyLevelEnum.level_6,
        "value": 6, 
        "description": "몸이 비교적 가볍고 상쾌하며, 가벼운 운동이나 외출도 괜찮은 정도야"
    },
    {   "title": "7 : 충전 완료", 
        "energy_level": EnergyLevelEnum.level_7,
        "value": 7, 
        "description": "에너지가 웬만큼 차올라서 몸이 가볍고 활력이 느껴지며, 잘 움직여져."
    },
    {   "title": "8 : 에너지 부스트", 
        "energy_level": EnergyLevelEnum.level_8,
        "value": 8, 
        "description": "체력도 좋고, 활동량을 늘려도 무리 없이 버틸 수 있을 정도로 좋아"
    },
    {   "title": "9 : 최고의 컨디션 ", 
        "energy_level": EnergyLevelEnum.level_9,
        "value": 9, 
        "description": "몸이 너무 가볍고, 움직일수록 에너지가 더 나는 느낌!"
    },
    {   "title": "10 : 슈퍼모드 ", 
        "energy_level": EnergyLevelEnum.level_10,
        "value": 10, 
        "description": "거의 완벽에 가까운 몸 상태, 오래 집중하고 오래 움직여도 끄떡없어."
    },

]

# -----------------------------
# DB에 데이터 넣기
# -----------------------------
def seed_preset_energy():
    db = SessionLocal()
    try:
        for data in energy_levels_data:
            el = EnergyLevel(
                id=uuid.uuid4(),
                title=data["title"],
                energy_level=data["energy_level"],
                value=data["value"],
                description=data["description"]
            )
            db.add(el)
        db.commit()
        print("✅ energylevel 데이터 입력 완료")
    except Exception as e:
        db.rollback()
        print("❌ 데이터 입력 실패:", e)
    finally:
        db.close()