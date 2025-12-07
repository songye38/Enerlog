# routers/insights.py
from datetime import datetime, timedelta, date,timezone
from typing import List, Optional, Dict, Any
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case, extract, and_, desc
from sqlalchemy.sql import select

from app.db.database import get_db
from app.db.models import (
    Behave, Activity, Tag, BehaveTag, BehaveTagTags, UserEnergyTagStats,
    EnergyLevelEnum, PhaseEnum,User
)
from app.db.schemas import BehaveStatusEnum
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/insights", tags=["Insights"])


# -----------------------
# 1) 월간 에너지 (하루 단위 평균)
# -----------------------
@router.get("/energy/monthly")
def monthly_energy(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    year: Optional[int] = Query(None, description="조회할 연도 (default: 올해)"),
    month: Optional[int] = Query(None, description="조회할 달 (1-12, default: 이번달)")
) -> Dict[str, Any]:
    """
    user의 해당 월에 대해 날짜별 평균 에너지 반환.
    평균 에너지는 (before + after)/2 (after가 없으면 before로 계산)
    """
    now = datetime.now(timezone.utc)
    year = year or now.year
    month = month or now.month

    # 월의 시작/끝
    start = datetime(year=year, month=month, day=1)
    if month == 12:
        end = datetime(year=year + 1, month=1, day=1)
    else:
        end = datetime(year=year, month=month + 1, day=1)

    # SQL: date_trunc('day', created_at), avg((before_energy + coalesce(after_energy, before_energy))/2)
    q = (
        db.query(
            func.date_trunc("day", Behave.created_at).label("day"),
            func.avg(
                (func.cast(Behave.before_energy, func.INTEGER) + func.coalesce(func.cast(Behave.after_energy, func.INTEGER), func.cast(Behave.before_energy, func.INTEGER))) / 2.0
            ).label("avg_energy")
        )
        .filter(Behave.user_id == current_user.id)
        .filter(Behave.created_at >= start, Behave.created_at < end)
        .group_by("day")
        .order_by("day")
    )

    rows = q.all()
    result = [{"day": r.day.date().isoformat(), "avg_energy": float(r.avg_energy)} for r in rows]
    return {"user_id": str(current_user.id), "year": year, "month": month, "daily": result}


# -----------------------
# 2) 주간 에너지 (지난 7일: 날짜별 평균)
# -----------------------
@router.get("/energy/weekly")
def weekly_energy(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    days: int = Query(7, ge=1, le=90, description="몇 일 전부터 (default 7)")
) -> Dict[str, Any]:
    end = datetime.now(timezone.utc)
    start = end - timedelta(days=days - 1)  # 포함
    q = (
        db.query(
            func.date_trunc("day", Behave.created_at).label("day"),
            func.avg(
                (func.cast(Behave.before_energy, func.INTEGER) + func.coalesce(func.cast(Behave.after_energy, func.INTEGER), func.cast(Behave.before_energy, func.INTEGER))) / 2.0
            ).label("avg_energy")
        )
        .filter(Behave.user_id == current_user.id)
        .filter(Behave.created_at >= start, Behave.created_at <= end)
        .group_by("day")
        .order_by("day")
    )
    rows = q.all()
    result = [{"day": r.day.date().isoformat(), "avg_energy": float(r.avg_energy)} for r in rows]
    return {"user_id": str(current_user.id), "days": days, "daily": result}


# -----------------------
# 3) 회복 인사이트 - (threshold 이하일 때 자주 선택되는 태그)
# -----------------------
@router.get("/recovery/tags")
def recovery_tags_for_low_energy(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    threshold: EnergyLevelEnum = Query(EnergyLevelEnum.level_3, description="before_energy <= threshold")
) -> Dict[str, Any]:
    """
    before_energy <= threshold 인 상황에서 자주 선택된 태그들의 빈도순 반환
    """
    # join: behave -> behave_tags (phase=before) -> behave_tag_tags -> tags
    # SQLAlchemy ORM: join through relationships
    bt_alias = BehaveTag
    # We can join via relationships: Behave -> BehaveTag -> behave_tag_tags -> Tag
    q = (
        db.query(
            Tag.title.label("tag_title"),
            Tag.type.label("tag_type"),
            func.count().label("freq")
        )
        .join(BehaveTagTags, BehaveTagTags.tag_id == Tag.id)
        .join(BehaveTag, BehaveTag.id == BehaveTagTags.behave_tag_id)
        .join(Behave, Behave.id == BehaveTag.behave_id)
        .filter(Behave.user_id == current_user.id)
        .filter(Behave.before_energy <= threshold)
        .filter(BehaveTag.phase == PhaseEnum.before)
        .group_by(Tag.id, Tag.title, Tag.type)
        .order_by(desc("freq"))
    )

    rows = q.all()
    result = [{"title": r.tag_title, "type": r.tag_type.value if hasattr(r.tag_type, "value") else r.tag_type, "count": int(r.freq)} for r in rows]
    return {"user_id": str(current_user.id), "threshold": threshold.name, "tags": result}


# -----------------------
# 4) 회복 인사이트 - 활동별 평균 회복량 (after - before)
# -----------------------
@router.get("/recovery/activity-avg")
def activity_average_recovery(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=100)
) -> Dict[str, Any]:
    """
    activity 별 평균 회복량 (after_energy - before_energy), after_energy 존재하는 경우만 계산
    """
    q = (
        db.query(
            Activity.id.label("activity_id"),
            Activity.title.label("activity_title"),
            func.avg((func.cast(Behave.after_energy, func.INTEGER) - func.cast(Behave.before_energy, func.INTEGER))).label("avg_recovery"),
            func.count(Behave.id).label("count")
        )
        .join(Behave, Behave.activity_id == Activity.id)
        .filter(Behave.user_id == current_user.id)
        .filter(Behave.after_energy.isnot(None))
        .group_by(Activity.id, Activity.title)
        .order_by(desc("avg_recovery"))
        .limit(limit)
    )
    rows = q.all()
    result = [{"activity_id": str(r.activity_id), "title": r.activity_title, "avg_recovery": float(r.avg_recovery), "count": int(r.count)} for r in rows]
    return {"user_id": str(current_user.id), "top": result}


# -----------------------
# 5) 회복 인사이트 - 3일(또는 N일) 연속 기록 시 평균 회복량
# -----------------------
@router.get("/recovery/streak")
def recovery_on_streaks(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    min_streak: int = Query(3, ge=2, description="연속일수(기본 3)")
) -> Dict[str, Any]:
    """
    연속으로 min_streak 이상 기록한 기간들에서의 평균 회복량(after - before)
    """
    # 유저의 behave들을 날짜 오름차순으로 가져오기
    behaves = (
        db.query(Behave)
        .filter(Behave.user_id == current_user.id)
        .order_by(Behave.created_at.asc())
        .all()
    )
    # 날짜만 뽑아서 연속 여부 판단
    if not behaves:
        return {"user_id": str(current_user.id), "streaks": [], "avg_recovery": 0.0}

    streaks = []
    current_streak = [behaves[0]]
    for i in range(1, len(behaves)):
        prev_day = behaves[i - 1].created_at.date()
        cur_day = behaves[i].created_at.date()
        if (cur_day - prev_day).days == 1:
            current_streak.append(behaves[i])
        else:
            if len(current_streak) >= min_streak:
                streaks.append(current_streak)
            current_streak = [behaves[i]]
    if len(current_streak) >= min_streak:
        streaks.append(current_streak)

    # 각 streak에서 after_exists인 것만 recovery로 수집
    recovery_vals = []
    streak_summaries = []
    for s in streaks:
        vals = []
        for b in s:
            if b.after_energy is not None:
                vals.append(int(b.after_energy) - int(b.before_energy))
        if vals:
            recovery_vals.extend(vals)
            streak_summaries.append({
                "start_date": s[0].created_at.date().isoformat(),
                "end_date": s[-1].created_at.date().isoformat(),
                "count": len(s),
                "avg_recovery_in_streak": sum(vals) / len(vals)
            })

    avg_recovery = float(sum(recovery_vals) / len(recovery_vals)) if recovery_vals else 0.0
    return {"user_id": str(current_user.id), "min_streak": min_streak, "streaks": streak_summaries, "avg_recovery": avg_recovery}


# -----------------------
# 6) 활동 시점 패턴 (오전/오후/저녁 비율)
# -----------------------
@router.get("/activity/time-distribution")
def activity_time_distribution(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    created_at hour 기준으로 morning(<12), afternoon(<18), evening(>=18) 비율 계산
    """
    total_q = db.query(func.count(Behave.id)).filter(Behave.user_id == current_user.id)
    total = total_q.scalar() or 0
    if total == 0:
        return {"user_id": str(current_user.id), "total": 0, "distribution": {}}

    period_case = case(
        [
            (extract("hour", Behave.created_at) < 12, "morning"),
            (extract("hour", Behave.created_at) < 18, "afternoon"),
        ],
        else_="evening"
    )

    q = (
        db.query(period_case.label("period"), func.count(Behave.id).label("cnt"))
        .filter(Behave.user_id == current_user.id)
        .group_by("period")
    )
    rows = q.all()
    dist = {r.period: int(r.cnt) for r in rows}
    # percent
    distribution = {k: {"count": v, "percent": round(v * 100.0 / total, 1)} for k, v in dist.items()}
    return {"user_id": str(current_user.id), "total": total, "distribution": distribution}


# -----------------------
# 7) 반복 행동 TOP N
# -----------------------
@router.get("/activity/top")
def top_activities(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    limit: int = Query(3, ge=1, le=50)
) -> Dict[str, Any]:
    q = (
        db.query(Activity.title.label("title"), func.count(Behave.id).label("cnt"))
        .join(Behave, Behave.activity_id == Activity.id)
        .filter(Behave.user_id == current_user.id)
        .group_by(Activity.id, Activity.title)
        .order_by(desc("cnt"))
        .limit(limit)
    )
    rows = q.all()
    result = [{"title": r.title, "count": int(r.cnt)} for r in rows]
    return {"user_id": str(current_user.id), "top_activities": result}



# -----------------------
# 최근 3일 평균 에너지 상태 API
# -----------------------
@router.get("/stats/energy/average-3days")
def get_average_energy_last_3days(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    three_days_ago = datetime.now(timezone.utc) - timedelta(days=3)

    energy_values = (
        db.query(Behave.before_energy)
        .filter(
            Behave.user_id == user.id,
            Behave.created_at >= three_days_ago,
            Behave.before_energy.isnot(None)
        )
        .all()
    )

    if not energy_values:
        return {"average_energy": None}

    avg_energy = sum(v[0] for v in energy_values) / len(energy_values)

    return {"average_energy": avg_energy}



# -----------------------
# 지난 3일간의 에너지 변화량 API
# -----------------------
@router.get("/stats/energy/change-3days")
def get_energy_change_last_3days(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    three_days_ago = datetime.now(timezone.utc) - timedelta(days=3)

    records = (
        db.query(Behave.before_energy, Behave.created_at)
        .filter(
            Behave.user_id == user.id,
            Behave.created_at >= three_days_ago,
            Behave.before_energy.isnot(None)
        )
        .order_by(Behave.created_at.asc())
        .all()
    )

    if len(records) < 2:
        return {"change": None}

    start = records[0][0]
    end = records[-1][0]

    return {"change": end - start}


# -----------------------
# 지난 3일간 "실행 → 기록" 이어진 비율 API
# -----------------------
@router.get("/stats/execute-to-record-ratio-3days")
def get_execute_to_record_ratio_last_3days(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    three_days_ago = datetime.now(timezone.utc) - timedelta(days=3)

    # 지난 3일간의 행동 중 pending이었던 것들을 가져오면서 completed 여부 계산
    behaves_with_completion = (
        db.query(
            Behave.id,
            case(
                [(Behave.status == BehaveStatusEnum.completed, 1)],
                else_=0
            ).label("completed_flag")
        )
        .filter(
            Behave.user_id == user.id,
            Behave.created_at >= three_days_ago,
            Behave.status.in_([BehaveStatusEnum.activity_pending, BehaveStatusEnum.completed])
        )
        .all()
    )

    if not behaves_with_completion:
        return {"ratio": None}

    # 동일 행동 기준으로 completed 여부 평균 계산
    total_count = len(behaves_with_completion)
    completed_count = sum(b.completed_flag for b in behaves_with_completion)

    ratio = completed_count / total_count

    return {"ratio": ratio}