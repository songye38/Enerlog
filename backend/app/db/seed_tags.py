from app.db.models import Tag,TagTypeEnum
import uuid
from app.db.database import SessionLocal


# -----------------------------
# 공용 ActivityTemplate 데이터
# -----------------------------
TAG_DATA = [
    # -----------------------------
    # 에너지 0
    # -----------------------------
    # Mental 상태
    {"title": "집중 불가", "type": TagTypeEnum.mental},
    {"title": "무기력", "type": TagTypeEnum.mental},
    {"title": "감정적 불안정", "type": TagTypeEnum.mental},
    {"title": "비관적 사고", "type": TagTypeEnum.mental},
    {"title": "생존모드", "type": TagTypeEnum.mental},
    {"title": "희망 상실감", "type": TagTypeEnum.mental},
    {"title": "현실 도피", "type": TagTypeEnum.mental},
    {"title": "의사소통 불가 느낌", "type": TagTypeEnum.mental},
    {"title": "공허함", "type": TagTypeEnum.mental},
    {"title": "감정 마비", "type": TagTypeEnum.mental},
    # Body 상태
    {"title": "거의 움직임 불가", "type": TagTypeEnum.body},
    {"title": "극심한 피로", "type": TagTypeEnum.body},
    {"title": "기력 소진", "type": TagTypeEnum.body},
    {"title": "근육 침대화", "type": TagTypeEnum.body},
    {"title": "감각 흐림", "type": TagTypeEnum.body},
    {"title": "시선 고정", "type": TagTypeEnum.body},
    {"title": "호흡 무거움", "type": TagTypeEnum.body},
    {"title": "무반응", "type": TagTypeEnum.body},
    {"title": "조금만 움직여도 지침", "type": TagTypeEnum.body},
    {"title": "무중력 피로", "type": TagTypeEnum.body},


    # -----------------------------
    # 에너지 1
    # -----------------------------
    # Mental 상태
    {"title": "부정적 사고", "type": TagTypeEnum.mental},
    {"title": "짜증", "type": TagTypeEnum.mental},
    {"title": "우울함", "type": TagTypeEnum.mental},
    {"title": "의욕 결핍", "type": TagTypeEnum.mental},
    {"title": "민감함", "type": TagTypeEnum.mental},
    {"title": "답답함", "type": TagTypeEnum.mental},
    {"title": "회피 욕구", "type": TagTypeEnum.mental},
    {"title": "포기감", "type": TagTypeEnum.mental},
    {"title": "산만함", "type": TagTypeEnum.mental},
    {"title": "감정 소음 증가", "type": TagTypeEnum.mental},

    # Body 상태
    {"title": "근육 긴장", "type": TagTypeEnum.body},
    {"title": "비활동", "type": TagTypeEnum.body},
    {"title": "축 처짐", "type": TagTypeEnum.body},
    {"title": "둔함", "type": TagTypeEnum.body},
    {"title": "피로 지속", "type": TagTypeEnum.body},
    {"title": "낮은 체력", "type": TagTypeEnum.body},
    {"title": "느린 움직임", "type": TagTypeEnum.body},
    {"title": "침대 의존", "type": TagTypeEnum.body},
    {"title": "찌푸림", "type": TagTypeEnum.body},
    {"title": "무거운 시선", "type": TagTypeEnum.body},

    # -----------------------------
    # 에너지 2
    # -----------------------------
    # Mental 상태
    {"title": "집중 저하", "type": TagTypeEnum.mental},
    {"title": "감정 둔화", "type": TagTypeEnum.mental},
    {"title": "멍때림", "type": TagTypeEnum.mental},
    {"title": "귀찮음", "type": TagTypeEnum.mental},
    {"title": "흥미 부족", "type": TagTypeEnum.mental},
    {"title": "산만함", "type": TagTypeEnum.mental},
    {"title": "동기 감소", "type": TagTypeEnum.mental},
    {"title": "무채색 기분", "type": TagTypeEnum.mental},
    {"title": "단절감", "type": TagTypeEnum.mental},
    {"title": "의사결정 어려움", "type": TagTypeEnum.mental},
    # Body 상태
    {"title": "무거운 몸", "type": TagTypeEnum.body},
    {"title": "지친 근육", "type": TagTypeEnum.body},
    {"title": "천천히 가능", "type": TagTypeEnum.body},
    {"title": "낮은 체력", "type": TagTypeEnum.body},
    {"title": "느린 걸음", "type": TagTypeEnum.body},
    {"title": "흐릿한 감각", "type": TagTypeEnum.body},
    {"title": "기지개 단계", "type": TagTypeEnum.body},
    {"title": "피곤 지속", "type": TagTypeEnum.body},
    {"title": "의자-침대 반복", "type": TagTypeEnum.body},
    {"title": "낮은 활동량", "type": TagTypeEnum.body},

    # -----------------------------
    # 에너지 3
    # -----------------------------
    # Mental 상태
    {"title": "간단한 판단 가능", "type": TagTypeEnum.mental},
    {"title": "무난함", "type": TagTypeEnum.mental},
    {"title": "낮은 창의력", "type": TagTypeEnum.mental},
    {"title": "생각 더딤", "type": TagTypeEnum.mental},
    {"title": "감정 회복 시작", "type": TagTypeEnum.mental},
    {"title": "제한적 집중", "type": TagTypeEnum.mental},
    {"title": "여유 조금", "type": TagTypeEnum.mental},
    {"title": "머리 정리 필요", "type": TagTypeEnum.mental},
    {"title": "소소한 의욕", "type": TagTypeEnum.mental},
    {"title": "희망 조각 등장", "type": TagTypeEnum.mental},
    # Body 상태
    {"title": "점진적 회복", "type": TagTypeEnum.body},
    {"title": "굳음 풀림", "type": TagTypeEnum.body},
    {"title": "가벼운 피로", "type": TagTypeEnum.body},
    {"title": "찌뿌둥", "type": TagTypeEnum.body},
    {"title": "천천히 적응", "type": TagTypeEnum.body},
    {"title": "움직임 재개", "type": TagTypeEnum.body},
    {"title": "활력 미약", "type": TagTypeEnum.body},
    {"title": "체온 회복", "type": TagTypeEnum.body},
    {"title": "근육 깨어남", "type": TagTypeEnum.body},
    {"title": "느린 박동 느낌", "type": TagTypeEnum.body},

    # -----------------------------
    # 에너지 4
    # -----------------------------
    # Mental 상태
    {"title": "집중 재가동", "type": TagTypeEnum.mental},
    {"title": "실수 줄어듦", "type": TagTypeEnum.mental},
    {"title": "가벼운 동기", "type": TagTypeEnum.mental},
    {"title": "빠른 피로감", "type": TagTypeEnum.mental},
    {"title": "긍정 회복", "type": TagTypeEnum.mental},
    {"title": "작은 계획 가능", "type": TagTypeEnum.mental},
    {"title": "생각 재배열", "type": TagTypeEnum.mental},
    {"title": "반응 속도 증가", "type": TagTypeEnum.mental},
    {"title": "실행력 소폭 증가", "type": TagTypeEnum.mental},
    {"title": "조심스러운 자신감", "type": TagTypeEnum.mental},
    # Body 상태
    {"title": "피로 잔재", "type": TagTypeEnum.body},
    {"title": "움직임 가능", "type": TagTypeEnum.body},
    {"title": "기초 체력 회복", "type": TagTypeEnum.body},
    {"title": "몸 적응", "type": TagTypeEnum.body},
    {"title": "조금 가벼움", "type": TagTypeEnum.body},
    {"title": "어깨 긴장 감소", "type": TagTypeEnum.body},
    {"title": "활동 재시도", "type": TagTypeEnum.body},
    {"title": "짧은 외출 가능", "type": TagTypeEnum.body},
    {"title": "뻐근함 잔존", "type": TagTypeEnum.body},
    {"title": "근육 반응 시작", "type": TagTypeEnum.body},

    # -----------------------------
    # 에너지 5
    # -----------------------------
    # Mental 상태
    {"title": "루틴 수행 가능", "type": TagTypeEnum.mental},
    {"title": "안정감", "type": TagTypeEnum.mental},
    {"title": "중간 집중", "type": TagTypeEnum.mental},
    {"title": "정서 균형", "type": TagTypeEnum.mental},
    {"title": "약한 산만함", "type": TagTypeEnum.mental},
    {"title": "소소한 만족감", "type": TagTypeEnum.mental},
    {"title": "감정 기복 적음", "type": TagTypeEnum.mental},
    {"title": "업무 진행 가능", "type": TagTypeEnum.mental},
    {"title": "안정적 사고", "type": TagTypeEnum.mental},
    {"title": "점진적 의욕", "type": TagTypeEnum.mental},
    # Body 상태
    {"title": "기본 체력 확보", "type": TagTypeEnum.body},
    {"title": "움직임 편안", "type": TagTypeEnum.body},
    {"title": "가벼운 피로", "type": TagTypeEnum.body},
    {"title": "일상 유지", "type": TagTypeEnum.body},
    {"title": "라이트 컨디션", "type": TagTypeEnum.body},
    {"title": "짧은 휴식 필요", "type": TagTypeEnum.body},
    {"title": "긴장 완화", "type": TagTypeEnum.body},
    {"title": "균형 유지", "type": TagTypeEnum.body},
    {"title": "편안한 호흡", "type": TagTypeEnum.body},
    {"title": "일상 활동 가능", "type": TagTypeEnum.body},

    # -----------------------------
    # 에너지 6
    # -----------------------------
    # Mental 상태
    {"title": "집중 향상", "type": TagTypeEnum.mental},
    {"title": "업무 효율 증가", "type": TagTypeEnum.mental},
    {"title": "긍정적 태도", "type": TagTypeEnum.mental},
    {"title": "사회적 여유", "type": TagTypeEnum.mental},
    {"title": "계획 실행력", "type": TagTypeEnum.mental},
    {"title": "정서 안정", "type": TagTypeEnum.mental},
    {"title": "자기 관리 의지", "type": TagTypeEnum.mental},
    {"title": "목표 지향", "type": TagTypeEnum.mental},
    {"title": "몰입 시도", "type": TagTypeEnum.mental},
    {"title": "감정 유연", "type": TagTypeEnum.mental},
    # Body 상태
    {"title": "기운 상승", "type": TagTypeEnum.body},
    {"title": "빠른 회복", "type": TagTypeEnum.body},
    {"title": "가벼운 몸", "type": TagTypeEnum.body},
    {"title": "움직임 활발", "type": TagTypeEnum.body},
    {"title": "체력 안정", "type": TagTypeEnum.body},
    {"title": "활동 여유", "type": TagTypeEnum.body},
    {"title": "바른 자세 유지", "type": TagTypeEnum.body},
    {"title": "면역 체감", "type": TagTypeEnum.body},
    {"title": "짧은 운동 가능", "type": TagTypeEnum.body},
    {"title": "긴장 완화", "type": TagTypeEnum.body},

    # -----------------------------
    # 에너지 7
    # -----------------------------
    # Mental 상태
    {"title": "집중력 상승", "type": TagTypeEnum.mental},
    {"title": "긍정성 강화", "type": TagTypeEnum.mental},
    {"title": "멀티태스킹 가능", "type": TagTypeEnum.mental},
    {"title": "창의력 발동", "type": TagTypeEnum.mental},
    {"title": "자기표현 증가", "type": TagTypeEnum.mental},
    {"title": "목표 실행", "type": TagTypeEnum.mental},
    {"title": "감정 안정", "type": TagTypeEnum.mental},
    {"title": "결정력 증가", "type": TagTypeEnum.mental},
    {"title": "자기 만족감", "type": TagTypeEnum.mental},
    {"title": "의지 강함", "type": TagTypeEnum.mental},
    # Body 상태
    {"title": "활력 충만", "type": TagTypeEnum.body},
    {"title": "움직임 가벼움", "type": TagTypeEnum.body},
    {"title": "운동 적응 완료", "type": TagTypeEnum.body},
    {"title": "체력 안정화", "type": TagTypeEnum.body},
    {"title": "근육 탄력", "type": TagTypeEnum.body},
    {"title": "몸 유연", "type": TagTypeEnum.body},
    {"title": "속도 증가", "type": TagTypeEnum.body},
    {"title": "에너지 여유", "type": TagTypeEnum.body},
    {"title": "활동 지속 가능", "type": TagTypeEnum.body},
    {"title": "가벼운 도전 가능", "type": TagTypeEnum.body},

    # -----------------------------
    # 에너지 8
    # -----------------------------
    # Mental 상태
    {"title": "논리적 사고", "type": TagTypeEnum.mental},
    {"title": "문제 해결력", "type": TagTypeEnum.mental},
    {"title": "창의성 증가", "type": TagTypeEnum.mental},
    {"title": "자기계발 의지", "type": TagTypeEnum.mental},
    {"title": "관계 적극성", "type": TagTypeEnum.mental},
    {"title": "몰입 능력", "type": TagTypeEnum.mental},
    {"title": "균형 감각", "type": TagTypeEnum.mental},
    {"title": "정보 흡수 빠름", "type": TagTypeEnum.mental},
    {"title": "작업 성취감", "type": TagTypeEnum.mental},
    {"title": "자기 효능감 증가", "type": TagTypeEnum.mental},
    # Body 상태
    {"title": "강한 체력", "type": TagTypeEnum.body},
    {"title": "활동적 움직임", "type": TagTypeEnum.body},
    {"title": "빠른 회복력", "type": TagTypeEnum.body},
    {"title": "높은 에너지", "type": TagTypeEnum.body},
    {"title": "지구력 향상", "type": TagTypeEnum.body},
    {"title": "리듬 유지", "type": TagTypeEnum.body},
    {"title": "탄탄한 컨디션", "type": TagTypeEnum.body},
    {"title": "긴 시간 활동 가능", "type": TagTypeEnum.body},
    {"title": "체온 안정", "type": TagTypeEnum.body},
    {"title": "빠른 반응 속도", "type": TagTypeEnum.body},

    # -----------------------------
    # 에너지 9
    # -----------------------------
    # Mental 상태
    {"title": "리더십 발휘", "type": TagTypeEnum.mental},
    {"title": "강한 자신감", "type": TagTypeEnum.mental},
    {"title": "빠른 의사결정", "type": TagTypeEnum.mental},
    {"title": "정서적 안정", "type": TagTypeEnum.mental},
    {"title": "높은 자존감", "type": TagTypeEnum.mental},
    {"title": "주도적 태도", "type": TagTypeEnum.mental},
    {"title": "창의력 최고조", "type": TagTypeEnum.mental},
    {"title": "조직적 사고", "type": TagTypeEnum.mental},
    {"title": "생산성 최고", "type": TagTypeEnum.mental},
    {"title": "긍정 전파", "type": TagTypeEnum.mental},
    # Body 상태
    {"title": "최상 신체능력", "type": TagTypeEnum.body},
    {"title": "오래 지속되는 체력", "type": TagTypeEnum.body},
    {"title": "피로 거의 없음", "type": TagTypeEnum.body},
    {"title": "컨디션 절정", "type": TagTypeEnum.body},
    {"title": "유연 + 강함", "type": TagTypeEnum.body},
    {"title": "빠른 움직임", "type": TagTypeEnum.body},
    {"title": "민첩성 증가", "type": TagTypeEnum.body},
    {"title": "활력 최대로", "type": TagTypeEnum.body},
    {"title": "근육 안정감", "type": TagTypeEnum.body},
    {"title": "어떤 활동도 가능", "type": TagTypeEnum.body},

    # -----------------------------
    # 에너지 10
    # -----------------------------
    # Mental 상태
    {"title": "창의력 폭발", "type": TagTypeEnum.mental},
    {"title": "최고 집중력", "type": TagTypeEnum.mental},
    {"title": "압도적 자신감", "type": TagTypeEnum.mental},
    {"title": "영감 샘솟음", "type": TagTypeEnum.mental},
    {"title": "미래 전략 구상", "type": TagTypeEnum.mental},
    {"title": "완전한 몰입", "type": TagTypeEnum.mental},
    {"title": "자기 확장", "type": TagTypeEnum.mental},
    {"title": "리더십 극대화", "type": TagTypeEnum.mental},
    {"title": "효율 극대화", "type": TagTypeEnum.mental},
    {"title": "감정 완전 안정", "type": TagTypeEnum.mental},
    # Body 상태
    {"title": "완벽한 컨디션", "type": TagTypeEnum.body},
    {"title": "최상 체력 유지", "type": TagTypeEnum.body},
    {"title": "고강도 활동 지속", "type": TagTypeEnum.body},
    {"title": "근육 최적화", "type": TagTypeEnum.body},
    {"title": "체력 과충전", "type": TagTypeEnum.body},
    {"title": "초고속 회복", "type": TagTypeEnum.body},
    {"title": "기립 완벽", "type": TagTypeEnum.body},
    {"title": "신체 자신감", "type": TagTypeEnum.body},
    {"title": "활동 한계 돌파", "type": TagTypeEnum.body},
    {"title": "장시간 집중 가능", "type": TagTypeEnum.body},
]



# -----------------------------
# DB에 데이터 넣기
# -----------------------------
def seed_tags():
    db = SessionLocal()
    try:
        for data in TAG_DATA:
            el = Tag(
                id=uuid.uuid4(),
                title=data["title"],
                type = data['type'],
            )
            db.add(el)
        db.commit()
        print("✅ tag 데이터 입력 완료")
    except Exception as e:
        db.rollback()
        print("❌ 데이터 입력 실패:", e)
    finally:
        db.close()