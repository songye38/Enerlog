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
# 
# 새로운 Activity(활동) 객체를 생성합니다.
#
# Args:
#     activity_in (ActivityCreate): 사용자가 입력한 활동 정보.
#         - title (str): 활동 제목
#         - description (str): 활동 설명
#         - duration_minutes (int): 활동 소요 시간(분)
#         - good_point (str): 활동에서 느낀 긍정적인 점
#         - insight (str): 활동을 통해 얻은 인사이트
#         - energy_level.value (int): 활동 시 에너지 수준
#     db (Session): 데이터베이스 세션
#     current_user (User): 현재 로그인한 유저 객체
#
# Process:
#     1. 입력받은 energy_level.value를 기준으로 EnergyLevel 테이블에서 조회
#     2. 조회된 energy_level이 없으면 404 에러 발생
#     3. Activity 객체를 생성하고 현재 로그인한 유저의 id를 user_id로 설정
#     4. DB에 추가 후 커밋, 실패 시 롤백
#
# Returns:
#     ActivityOut: 생성된 활동 정보
#         - id (int): 생성된 활동 ID
#         - user_id (int): 활동을 등록한 유저 ID
#         - title (str), description (str), duration_minutes (int)
#         - good_point (str), insight (str)
#         - energy_level (dict): 연관된 에너지 수준 정보
#             - id (int), value (int)
#         - created_at (datetime), updated_at (datetime): 생성 및 수정 시각
#
# Raises:
#     HTTPException: 
#         - 404: 지정한 energy_level이 존재하지 않을 경우
#         - 500: DB 커밋 실패 등 내부 오류 발생 시
#
# Example Request (JSON):
#     {
#         "title": "아침 조깅",
#         "description": "공원에서 30분 조깅",
#         "duration_minutes": 30,
#         "good_point": "상쾌함과 활력",
#         "insight": "규칙적인 운동이 하루를 활기차게 시작하게 함",
#         "energy_level": {
#             "value": 0
#         }
#     }
#
# Example Response (JSON):
#     {
#         "id": 1,
#         "user_id": 10,
#         "title": "아침 조깅",
#         "description": "공원에서 30분 조깅",
#         "duration_minutes": 30,
#         "good_point": "상쾌함과 활력",
#         "insight": "규칙적인 운동이 하루를 활기차게 시작하게 함",
#         "energy_level": {
#             "id": 2,
#             "value": 0
#         },
#         "created_at": "2025-12-01T08:00:00",
#         "updated_at": "2025-12-01T08:00:00"
#     }
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
#
# 로그인한 사용자가 생성한 Activity(활동) 리스트를 조회합니다.
#
# Args:
#     db (Session): 데이터베이스 세션
#     current_user (User): 현재 로그인한 유저 객체
#
# Process:
#     1. Activity 테이블에서 is_deleted가 False인 활동만 조회
#     2. 현재 로그인한 사용자의 user_id로 필터링
#     3. 조회된 결과를 ActivityTemplateOut DTO로 변환
#
# Returns:
#     List[ActivityTemplateOut]: 사용자가 생성한 활동 리스트
#         - id (int): 활동 ID
#         - title (str): 활동 제목
#         - description (str): 활동 설명
#         - duration_minutes (int): 활동 소요 시간(분)
#         - good_point (str): 활동에서 느낀 긍정적인 점
#         - insight (str): 활동을 통해 얻은 인사이트
#         - energy_level (dict): 연관된 에너지 수준 정보
#             - id (int), value (int)
#         - created_at (datetime), updated_at (datetime): 생성 및 수정 시각
#
# Example Response (JSON):
# [
#     {
#         "id": 1,
#         "title": "아침 조깅",
#         "description": "공원에서 30분 조깅",
#         "duration_minutes": 30,
#         "good_point": "상쾌함과 활력",
#         "insight": "규칙적인 운동이 하루를 활기차게 시작하게 함",
#         "energy_level": {
#             "id": 2,
#             "value": 2
#         },
#         "created_at": "2025-12-01T08:00:00",
#         "updated_at": "2025-12-01T08:00:00"
#     },
#     {
#         "id": 2,
#         "title": "저녁 독서",
#         "description": "자기계발서 1시간 읽기",
#         "duration_minutes": 60,
#         "good_point": "집중력 향상",
#         "insight": "짧은 시간이라도 꾸준히 읽으면 지식이 쌓임",
#         "energy_level": {
#             "id": 1,
#             "value": 2
#         },
#         "created_at": "2025-12-01T20:00:00",
#         "updated_at": "2025-12-01T20:00:00"
#     }
# ]
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
#
# 특정 사용자가 생성한 Activity(활동)를 수정합니다.
#
# Args:
#     activity_id (UUID): 수정할 활동의 ID
#     payload (ActivityUpdate): 수정할 필드 정보 (부분 업데이트 가능)
#         - title (Optional[str]): 활동 제목
#         - description (Optional[str]): 활동 설명
#         - duration_minutes (Optional[int]): 활동 소요 시간(분)
#         - good_point (Optional[str]): 활동에서 느낀 긍정적인 점
#         - energy_level (Optional[str]): 활동 에너지 수준 값
#     db (Session): 데이터베이스 세션
#     current_user (User): 현재 로그인한 유저 객체
#
# Process:
#     1. activity_id와 is_deleted=False 조건으로 기존 Activity 조회
#     2. 활동이 없으면 404 반환
#     3. 현재 사용자가 소유하지 않은 활동이면 403 반환
#     4. payload에 포함된 필드만 기존 Activity에 업데이트
#     5. energy_level이 있다면 EnergyLevel 테이블에서 조회 후 ORM 객체로 할당
#        - 존재하지 않으면 404 반환
#     6. DB 커밋 후 활동 객체 갱신
#
# Returns:
#     ActivityTemplateOut: 업데이트된 활동 정보
#         - id (UUID)
#         - title (str)
#         - description (str)
#         - duration_minutes (int)
#         - good_point (str)
#         - insight (str)
#         - energy_level (dict): {id (int), value (str)}
#         - created_at (datetime), updated_at (datetime)
#
# Raises:
#     HTTPException:
#         - 404: 활동이 존재하지 않거나, 지정한 energy_level이 없을 때
#         - 403: 활동 수정 권한이 없는 경우
#
# Example Request (JSON):
# {
#     "title": "아침 요가",
#     "description": "집에서 20분 요가",
#     "duration_minutes": 20,
#     "good_point": "몸과 마음이 가벼워짐",
#     "energy_level": "Medium"
# }
#
# Example Response (JSON):
# {
#     "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
#     "title": "아침 요가",
#     "description": "집에서 20분 요가",
#     "duration_minutes": 20,
#     "good_point": "몸과 마음이 가벼워짐",
#     "insight": "규칙적인 스트레칭으로 하루를 시작하면 집중력이 올라감",
#     "energy_level": {
#         "id": 1,
#         "value": "Medium"
#     },
#     "created_at": "2025-12-01T07:00:00",
#     "updated_at": "2025-12-01T07:30:00"
# }
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
#
# 특정 사용자가 생성한 Activity(활동)를 soft delete 처리합니다.
#
# Args:
#     activity_id (UUID): 삭제할 활동의 ID
#     db (Session): 데이터베이스 세션
#     current_user (User): 현재 로그인한 유저 객체
#
# Process:
#     1. activity_id와 is_deleted=False 조건으로 기존 Activity 조회
#     2. 활동이 없으면 404 반환
#     3. 현재 사용자가 소유하지 않은 활동이면 403 반환
#     4. Activity 객체의 is_deleted 필드를 True로 설정 (soft delete)
#     5. DB 커밋
#
# Returns:
#     dict: 삭제 성공 메시지
#         - message (str): "활동이 삭제되었습니다."
#
# Raises:
#     HTTPException:
#         - 404: 활동이 존재하지 않을 경우
#         - 403: 활동 삭제 권한이 없는 경우
#
# Example Response (JSON):
# {
#     "message": "활동이 삭제되었습니다."
# }
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


# ------------------------------------------
# 이미 만들어진 추천 활동(프리셋)을 모두 반환하는 라우터
#
# DB에 저장된 ActivityTemplate(추천 활동) 리스트를 조회합니다.
#
# Args:
#     db (Session): 데이터베이스 세션
#
# Process:
#     1. ActivityTemplate 테이블에서 모든 레코드를 조회
#     2. 조회된 ORM 객체를 ActivityTemplateOut Pydantic 모델로 변환
#
# Returns:
#     List[ActivityTemplateOut]: 추천 활동 리스트
#         - id (int): 템플릿 ID
#         - title (str): 활동 제목
#         - description (str): 활동 설명
#         - duration_minutes (int): 활동 소요 시간(분)
#         - good_point (str): 활동에서 느낀 긍정적인 점
#         - insight (str): 활동을 통해 얻은 인사이트
#         - energy_level (dict): {id (int), value (str)}
#         - created_at (datetime), updated_at (datetime)
#
# Example Response (JSON):
# [
#     {
#         "id": 1,
#         "title": "아침 스트레칭",
#         "description": "간단한 10분 스트레칭",
#         "duration_minutes": 10,
#         "good_point": "몸이 개운해짐",
#         "insight": "짧은 스트레칭도 하루 시작에 도움",
#         "energy_level": {
#             "id": 2,
#             "value": "Low"
#         },
#         "created_at": "2025-12-01T06:30:00",
#         "updated_at": "2025-12-01T06:30:00"
#     },
#     {
#         "id": 2,
#         "title": "점심 산책",
#         "description": "점심 후 20분 걷기",
#         "duration_minutes": 20,
#         "good_point": "기분 전환과 소화 도움",
#         "insight": "짧은 산책도 에너지 재충전에 도움",
#         "energy_level": {
#             "id": 3,
#             "value": "Medium"
#         },
#         "created_at": "2025-12-01T12:30:00",
#         "updated_at": "2025-12-01T12:30:00"
#     }
# ]
# ------------------------------------------
@router.get("/templates", response_model=List[ActivityTemplateOut])
def list_activity_templates(db: Session = Depends(get_db)):
    templates = db.query(ActivityTemplate).all()
    # 각 ORM 객체를 Pydantic 모델로 변환
    return [ActivityTemplateOut.from_orm_obj(t) for t in templates]



# ----------------------------------------------------------
# 사용자 id와 에너지 레벨 값을 기반으로 추천 활동을 반환하는 라우터
#
# Args:
#     energy_level (int, Query): 사용자의 현재 에너지 레벨 (0~10)
#     db (Session): 데이터베이스 세션
#     current_user (User): 현재 로그인한 유저 객체
#
# Process:
#     1. UserSettings에서 현재 사용자의 최대 추천 개수(max_recommendations) 조회
#        - 없으면 기본값 5
#     2. Activity 테이블에서 사용자가 만든 활동 중 is_deleted=False이고
#        에너지 레벨이 입력값과 일치하는 활동 조회
#     3. ActivityTemplate 테이블에서 에너지 레벨이 일치하는 템플릿 활동 조회
#     4. 추천 리스트 구성
#        - 사용자가 만든 활동이 max_count 이상이면, 무작위로 max_count 개 선택
#        - 그렇지 않으면, 사용자 활동 + 남은 슬롯 수만큼 템플릿 활동 랜덤 선택
#        - 최종 리스트 섞기 (shuffle)
#     5. 각 추천 활동에 대해 Behave 테이블에서 수행 횟수(count) 조회
#     6. ActivityTemplateOut Pydantic 모델로 변환 후 반환
#
# Returns:
#     List[ActivityTemplateOut]: 추천 활동 리스트
#         - id (UUID or int): 활동 ID
#         - title (str): 활동 제목
#         - description (str): 활동 설명
#         - duration_minutes (int): 활동 소요 시간(분)
#         - good_point (str): 활동에서 느낀 긍정적인 점
#         - insight (str): 활동을 통해 얻은 인사이트
#         - energy_level (dict): {id (int), value (str)}
#         - count (int): 사용자가 수행한 횟수
#         - created_at (datetime), updated_at (datetime)
#
# Example Request (Query):
# GET /recommend?energy_level=7
#
# Example Response (JSON):
# [
#     {
#         "id": 5,
#         "title": "점심 산책",
#         "description": "점심 후 20분 걷기",
#         "duration_minutes": 20,
#         "good_point": "기분 전환과 소화 도움",
#         "insight": "짧은 산책도 에너지 재충전에 도움",
#         "energy_level": {
#             "id": 3,
#             "value": "Medium"
#         },
#         "count": 2,
#         "created_at": "2025-12-01T12:30:00",
#         "updated_at": "2025-12-01T12:30:00"
#     },
#     {
#         "id": 8,
#         "title": "저녁 요가",
#         "description": "집에서 30분 요가",
#         "duration_minutes": 30,
#         "good_point": "몸과 마음의 긴장 완화",
#         "insight": "규칙적인 스트레칭으로 하루를 마무리",
#         "energy_level": {
#             "id": 2,
#             "value": "Low"
#         },
#         "count": 0,
#         "created_at": "2025-12-01T19:00:00",
#         "updated_at": "2025-12-01T19:00:00"
#     }
# ]
# ----------------------------------------------------------
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
