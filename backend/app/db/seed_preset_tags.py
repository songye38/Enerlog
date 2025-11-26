
from app.db.models import EnergyLevel, EnergyLevelEnum  ,PresetTag,Tag,PresetTagTags
import uuid
from app.db.database import SessionLocal



PRESET_TAG_DATA = [
    {
        "energy_level": EnergyLevelEnum.level_0,
        "type": "mental",
        "tag_titles": [
            "집중 불가"
            "무기력"
            "감정적 불안정",
            "비관적 사고",
            "생존모드", 
            "희망 상실감", 
            "현실 도피", 
            "의사소통 불가 느낌", 
            "공허함", 
            "감정 마비", 
        ]
    },
   
    {
        "energy_level": EnergyLevelEnum.level_0,
        "type": "body",
        "tag_titles": [
            "거의 움직임 불가", 
            "극심한 피로", 
            "기력 소진", 
            "근육 침대화", 
            "감각 흐림", 
            "시선 고정", 
            "호흡 무거움", 
            "무반응", 
            "조금만 움직여도 지침", 
            "무중력 피로", 

        ]
    },
    {
        "energy_level": EnergyLevelEnum.level_1,
        "type": "body",
        "tag_titles": [
            "근육 긴장", 
            "비활동", 
            "축 처짐", 
            "둔함", 
            "피로 지속", 
            "낮은 체력", 
            "느린 움직임", 
            "침대 의존", 
            "찌푸림", 
            "무거운 시선", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_1,
        "type": "mental",
        "tag_titles": [
            "부정적 사고", 
            "짜증", 
            "우울함", 
            "의욕 결핍", 
            "민감함", 
            "답답함", 
            "회피 욕구", 
            "포기감", 
            "산만함", 
            "감정 소음 증가", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_2,
        "type": "body",
        "tag_titles": [
            "무거운 몸", 
            "지친 근육", 
            "천천히 가능", 
            "낮은 체력", 
            "느린 걸음", 
            "흐릿한 감각", 
            "기지개 단계", 
            "피곤 지속", 
            "의자-침대 반복", 
            "낮은 활동량", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_2,
        "type": "mental",
        "tag_titles": [
            "집중 저하", 
            "감정 둔화", 
            "멍때림", 
            "귀찮음", 
            "흥미 부족", 
            "산만함", 
            "동기 감소", 
            "무채색 기분", 
            "단절감", 
            "의사결정 어려움", 
            ]
    },
    
    {
        "energy_level": EnergyLevelEnum.level_3,
        "type": "body",
        "tag_titles": [
            "점진적 회복", 
            "굳음 풀림", 
            "가벼운 피로", 
            "찌뿌둥", 
            "천천히 적응", 
            "움직임 재개", 
            "활력 미약", 
            "체온 회복", 
            "근육 깨어남", 
            "느린 박동 느낌", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_3,
        "type": "mental",
        "tag_titles": [
            "간단한 판단 가능", 
            "무난함", 
            "낮은 창의력", 
            "생각 더딤", 
            "감정 회복 시작", 
            "제한적 집중", 
            "여유 조금", 
            "머리 정리 필요", 
            "소소한 의욕", 
            "희망 조각 등장", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_4,
        "type": "body",
        "tag_titles": [
            "피로 잔재", 
            "움직임 가능", 
            "기초 체력 회복", 
            "몸 적응", 
            "조금 가벼움", 
            "어깨 긴장 감소", 
            "활동 재시도", 
            "짧은 외출 가능", 
            "뻐근함 잔존", 
            "근육 반응 시작", 
                ]
    },
    {
        "energy_level": EnergyLevelEnum.level_4,
        "type": "mental",
         "tag_titles": [
            "집중 재가동", 
            "실수 줄어듦", 
            "가벼운 동기", 
            "빠른 피로감", 
            "긍정 회복", 
            "작은 계획 가능", 
            "생각 재배열", 
            "반응 속도 증가", 
            "실행력 소폭 증가", 
            "조심스러운 자신감", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_5,
        "type": "body",
        "tag_titles": [
            "기본 체력 확보", 
            "움직임 편안", 
            "가벼운 피로", 
            "일상 유지", 
            "라이트 컨디션", 
            "짧은 휴식 필요", 
            "긴장 완화", 
            "균형 유지", 
            "편안한 호흡", 
            "일상 활동 가능", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_5,
        "type": "mental",
       "tag_titles": [
           "루틴 수행 가능", 
            "안정감", 
            "중간 집중", 
            "정서 균형", 
            "약한 산만함", 
            "소소한 만족감", 
            "감정 기복 적음", 
            "업무 진행 가능", 
            "안정적 사고", 
            "점진적 의욕", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_6,
        "type": "body",
        "tag_titles": [
            "기운 상승", 
            "빠른 회복", 
            "가벼운 몸", 
            "움직임 활발", 
            "체력 안정", 
            "활동 여유", 
            "바른 자세 유지", 
            "면역 체감", 
            "짧은 운동 가능", 
            "긴장 완화", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_6,
        "type": "mental",
        "tag_titles": [
            "집중 향상", 
            "업무 효율 증가", 
            "긍정적 태도", 
            "사회적 여유", 
            "계획 실행력", 
            "정서 안정", 
            "자기 관리 의지", 
            "목표 지향", 
            "몰입 시도", 
            "감정 유연", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_7,
        "type": "body",
         "tag_titles": [
            "활력 충만", 
            "움직임 가벼움", 
            "운동 적응 완료", 
            "체력 안정화", 
            "근육 탄력", 
            "몸 유연", 
            "속도 증가", 
            "에너지 여유", 
            "활동 지속 가능", 
            "가벼운 도전 가능", 

            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_7,
        "type": "mental",
        "tag_titles": [
            "집중력 상승", 
            "긍정성 강화", 
            "멀티태스킹 가능", 
            "창의력 발동", 
            "자기표현 증가", 
            "목표 실행", 
            "감정 안정", 
            "결정력 증가", 
            "자기 만족감", 
            "의지 강함", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_8,
        "type": "body",
        "tag_titles": [
            "강한 체력", 
            "활동적 움직임", 
            "빠른 회복력", 
            "높은 에너지", 
            "지구력 향상", 
            "리듬 유지", 
            "탄탄한 컨디션", 
            "긴 시간 활동 가능", 
            "체온 안정", 
            "빠른 반응 속도", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_8,
        "type": "mental",
        "tag_titles": [
            "논리적 사고", 
            "문제 해결력", 
            "창의성 증가", 
            "자기계발 의지", 
            "관계 적극성", 
            "몰입 능력", 
            "균형 감각", 
            "정보 흡수 빠름", 
            "작업 성취감", 
            "자기 효능감 증가", 
            ]
    },

    {
        "energy_level": EnergyLevelEnum.level_9,
        "type": "body",
         "tag_titles": [
            "최상 신체능력", 
            "오래 지속되는 체력", 
            "피로 거의 없음", 
            "컨디션 절정", 
            "유연 + 강함", 
            "빠른 움직임", 
            "민첩성 증가", 
            "활력 최대로", 
            "근육 안정감", 
            "어떤 활동도 가능", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_9,
        "type": "mental",
        "tag_titles": [
            "리더십 발휘", 
            "강한 자신감", 
            "빠른 의사결정", 
            "정서적 안정", 
            "높은 자존감", 
            "주도적 태도", 
            "창의력 최고조", 
            "조직적 사고", 
            "생산성 최고", 
            "긍정 전파", 
                ]
    },
    {
        "energy_level": EnergyLevelEnum.level_10,
        "type": "body",
        "tag_titles": [
            "완벽한 컨디션", 
            "최상 체력 유지", 
            "고강도 활동 지속", 
            "근육 최적화", 
            "체력 과충전", 
            "초고속 회복", 
            "기립 완벽", 
            "신체 자신감", 
            "활동 한계 돌파", 
            "장시간 집중 가능", 
            ]
    },
    {
        "energy_level": EnergyLevelEnum.level_10,
        "type": "mental",
        "tag_titles": [
            "창의력 폭발", 
            "최고 집중력", 
            "압도적 자신감", 
            "영감 샘솟음", 
            "미래 전략 구상", 
            "완전한 몰입", 
            "자기 확장", 
            "리더십 극대화", 
            "효율 극대화", 
            "감정 완전 안정", 
            ]
    },
]


def seed_preset_tags():
    db = SessionLocal()
    try:
        for data in PRESET_TAG_DATA:

            energy = db.query(EnergyLevel).filter(
                EnergyLevel.energy_level == data["energy_level"]
            ).first()

            if not energy:
                print("⛔ EnergyLevel 미존재:", data["energy_level"])
                continue

            preset_tag = PresetTag(
                id=uuid.uuid4(),
                energy_level_id=energy.id,
                type=data["type"]
            )
            db.add(preset_tag)
            db.flush()  # ID 확보

            # 연결 TAG들 찾기
            tags = db.query(Tag).filter(Tag.title.in_(data["tag_titles"])).all()

            for tag in tags:
                db.add(PresetTagTags(
                    preset_tag_id=preset_tag.id,
                    tag_id=tag.id
                ))

        db.commit()
        print("✨ PresetTag + PresetTagTags 입력 완료")

    except Exception as e:
        db.rollback()
        print("❌ PresetTag 입력 실패:", e)
    finally:
        db.close()
