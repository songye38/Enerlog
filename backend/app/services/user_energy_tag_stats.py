
from app.db.models import Behave,BehaveStatusEnum,PhaseEnum,UserEnergyTagStats
from app.db.schemas import BehaveResponse


def update_before_stats(db, behave: Behave):

    print("호출은 되었는지?")

    # 전체 항목을 보기 위해 Pydantic 모델로 변환
    behave_dict = BehaveResponse.from_orm(behave).dict()
    print("behave 전체 항목:", behave_dict)
    
    """
    behave.status == 'emotion_recorded' 일 때 호출
    before_phase의 태그를 stats에 반영
    """
    if behave.status != BehaveStatusEnum.emotion_recorded:
        return

    for bt in behave.behave_tags:
        if bt.phase != PhaseEnum.before:
            continue
        energy_level = behave.before_energy
        if not energy_level:
            continue

        tag_ids = [tag.id for tag in bt.tags]
        existing_stats = db.query(UserEnergyTagStats).filter(
            UserEnergyTagStats.user_id == behave.user_id,
            UserEnergyTagStats.energy_level == energy_level,
            UserEnergyTagStats.tag_id.in_(tag_ids)
        ).all()
        existing_dict = {stat.tag_id: stat for stat in existing_stats}

        for tag in bt.tags:
            stat = existing_dict.get(tag.id)
            if stat:
                stat.selected_count += 1
            else:
                db.add(UserEnergyTagStats(
                    user_id=behave.user_id,
                    energy_level=energy_level,
                    tag_type=tag.type,
                    tag_id=tag.id,
                    selected_count=1
                ))

    db.commit()


def update_after_stats(db, behave: Behave):
    """
    behave.status == 'completed' 일 때 호출
    after_phase의 태그를 stats에 반영
    """
    if behave.status != BehaveStatusEnum.completed:
        return

    for bt in behave.behave_tags:
        if bt.phase != PhaseEnum.after:
            continue
        energy_level = behave.after_energy
        if not energy_level:
            continue

        tag_ids = [tag.id for tag in bt.tags]
        existing_stats = db.query(UserEnergyTagStats).filter(
            UserEnergyTagStats.user_id == behave.user_id,
            UserEnergyTagStats.energy_level == energy_level,
            UserEnergyTagStats.tag_id.in_(tag_ids)
        ).all()
        existing_dict = {stat.tag_id: stat for stat in existing_stats}

        for tag in bt.tags:
            stat = existing_dict.get(tag.id)
            if stat:
                stat.selected_count += 1
            else:
                db.add(UserEnergyTagStats(
                    user_id=behave.user_id,
                    energy_level=energy_level,
                    tag_type=tag.type,
                    tag_id=tag.id,
                    selected_count=1
                ))

    db.commit()
