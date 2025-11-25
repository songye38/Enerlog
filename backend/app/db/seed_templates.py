from app.db.models import ActivityTemplate
import uuid
from app.db.database import SessionLocal



# -----------------------------
# 공용 ActivityTemplate 데이터
# -----------------------------
TEMPLATE_DATA = [

    # -----------------------------
    # 에너지 레벨 0
    # -----------------------------
    {
        "title": "전등 끄고 조용한 환경 만들기",
        "description": "빛과 소음을 최소화하여 몸과 마음을 쉬게 하는 환경 조성",
        "duration_minutes": 5,
        "good_point": "감각 자극 최소화로 안정과 휴식 도움",
        "insight": "극도의 피로와 무기력 상태에서 생존 모드 진입에 적합",
        "energy_level_id": "408a542b-3f8a-4f19-84b3-f16fe2593a88"
    },
    {
        "title": "숨을 천천히 들이쉬고 내쉬기 (1분)",
        "description": "천천히 심호흡하며 신체 긴장을 풀고 마음을 안정시킴",
        "duration_minutes": 1,
        "good_point": "심리적 안정과 긴장 완화",
        "insight": "집중 불가 상태에서도 몸과 마음을 조금씩 회복",
        "energy_level_id": "408a542b-3f8a-4f19-84b3-f16fe2593a88"
    },
    {
        "title": "물 한 잔 마시기",
        "description": "차가운 물이나 미지근한 물로 수분 보충",
        "duration_minutes": 2,
        "good_point": "신체 기본 기능 유지, 미약한 자극 제공",
        "insight": "극도로 낮은 에너지 상태에서 회복 시작점 제공",
        "energy_level_id": "408a542b-3f8a-4f19-84b3-f16fe2593a88"
    },
    {
        "title": "휴대폰 멀리 두기",
        "description": "디지털 자극을 최소화하여 신체와 정신의 부담 감소",
        "duration_minutes": 0,
        "good_point": "과도한 정보 노출 감소, 마음 안정",
        "insight": "집중력 거의 없는 상태에서 불필요한 자극 차단",
        "energy_level_id": "408a542b-3f8a-4f19-84b3-f16fe2593a88"
    },
    {
        "title": "단 5분이라도 눈 감고 누워 있기",
        "description": "편안히 누워 눈을 감고 휴식하며 몸 회복",
        "duration_minutes": 5,
        "good_point": "신체 에너지 최소 회복, 심리적 안정",
        "insight": "극도의 피로와 무기력 상태에서 생존 모드 유지에 도움",
        "energy_level_id": "408a542b-3f8a-4f19-84b3-f16fe2593a88"
    },

    # -----------------------------
    # 에너지 레벨1
    # -----------------------------
    {
        "title": "창문 열고 바람 쐬기",
        "description": "잠깐 창문을 열어 신선한 공기를 들이마시며 몸과 마음을 깨움",
        "duration_minutes": 3,
        "good_point": "호흡이 깊어지고 기분 전환에 도움",
        "insight": "최소한의 움직임만 가능한 상태에서 감각 깨우기에 적합",
        "energy_level_id": "6197d8d7-d53d-4276-bdc7-8c73f1895835"
    },
    {
        "title": "미지근한 물로 손/얼굴 씻기",
        "description": "미지근한 물로 얼굴과 손을 씻어 근육 긴장 완화 및 감각 자극",
        "duration_minutes": 2,
        "good_point": "몸과 마음을 조금씩 깨우고 긴장 완화",
        "insight": "의욕이 없고 피곤한 상태에서 회복 시작점 제공",
        "energy_level_id": "6197d8d7-d53d-4276-bdc7-8c73f1895835"
    },
    {
        "title": "좋아하는 음악 한 곡 듣기",
        "description": "편안하거나 즐거운 음악 한 곡으로 감정과 감각 자극",
        "duration_minutes": 3,
        "good_point": "정서적 안정과 긍정적 감정 회복",
        "insight": "부정적인 생각과 우울감을 완화하는 데 도움",
        "energy_level_id": "6197d8d7-d53d-4276-bdc7-8c73f1895835"
    },
    {
        "title": "조용히 앉아서 깊게 숨쉬기",
        "description": "편안히 앉아 깊은 호흡으로 긴장 완화와 마음 정리",
        "duration_minutes": 5,
        "good_point": "신체 긴장 완화, 마음 안정",
        "insight": "감각이 둔하고 의욕 없는 상태에서 회복 시작점 제공",
        "energy_level_id": "6197d8d7-d53d-4276-bdc7-8c73f1895835"
    },
    {
        "title": "가볍게 손가락, 발가락 움직이기",
        "description": "손가락과 발가락을 천천히 움직여 근육 긴장 완화 및 혈액순환 촉진",
        "duration_minutes": 3,
        "good_point": "최소한의 움직임으로 신체 자극 제공",
        "insight": "몸이 무겁고 근육이 긴장된 상태에서 감각 깨우기 도움",
        "energy_level_id": "6197d8d7-d53d-4276-bdc7-8c73f1895835"
    },

    # -----------------------------
    # 에너지 레벨2
    # -----------------------------
    {
        "title": "짧은 문장으로 현재 기분 적기",
        "description": "현재 감정을 한두 문장으로 간단히 기록",
        "duration_minutes": 5,
        "good_point": "정서 인식과 감정 정리 도움",
        "insight": "무기력 상태에서 아주 작은 행동으로 회복 실마리 제공",
        "energy_level_id": "2838ecc5-5d96-4867-bd38-ebc9ec7773e5"
    },
    {
        "title": "5분 산책 or 방 안 한 바퀴 돌기",
        "description": "가볍게 몸을 움직이며 공간 변화 경험",
        "duration_minutes": 5,
        "good_point": "혈액순환과 기분 전환에 도움",
        "insight": "움직임이 적어도 회복 실마리를 찾는 데 도움",
        "energy_level_id": "2838ecc5-5d96-4867-bd38-ebc9ec7773e5"
    },
    {
        "title": "따뜻한 음료 마시기",
        "description": "따뜻한 차나 음료로 몸과 마음을 따뜻하게 함",
        "duration_minutes": 10,
        "good_point": "편안함과 안정감 제공",
        "insight": "에너지가 낮은 상태에서 소소한 즐거움과 회복 자극 제공",
        "energy_level_id": "2838ecc5-5d96-4867-bd38-ebc9ec7773e5"
    },
    {
        "title": "창밖 보기",
        "description": "잠깐 창밖을 보며 자연이나 하늘 관찰",
        "duration_minutes": 3,
        "good_point": "정서적 안정과 시각적 자극 제공",
        "insight": "무기력 상태에서 감각 자극을 통한 회복 시작점 제공",
        "energy_level_id": "2838ecc5-5d96-4867-bd38-ebc9ec7773e5"
    },
    {
        "title": "오늘 하루 감사한 일 한 가지 생각하기",
        "description": "작은 감사 포인트를 떠올리며 긍정적 감정 자극",
        "duration_minutes": 3,
        "good_point": "정서 회복과 긍정적 사고 촉진",
        "insight": "작은 행동으로도 무기력 상태에서 회복 실마리 제공",
        "energy_level_id": "2838ecc5-5d96-4867-bd38-ebc9ec7773e5"
    },

    # -----------------------------
    # 에너지 레벨 3
    # -----------------------------
    {
        "title": "10분 스트레칭",
        "description": "가벼운 전신 스트레칭으로 근육 긴장 완화와 혈액순환 촉진",
        "duration_minutes": 10,
        "good_point": "신체 에너지 회복과 피로 완화 도움",
        "insight": "몸이 조금씩 풀리지만 피곤한 상태에서 느린 회복을 시작하기 적합",
        "energy_level_id": "c8baad43-b80c-4b80-9fc2-1f24c755fb53"
    },
    {
        "title": "간단한 집안일 (설거지, 정리 등)",
        "description": "작은 집안일을 통해 움직임과 성취감을 동시에 경험",
        "duration_minutes": 15,
        "good_point": "소소한 성취감으로 정신적 회복 촉진",
        "insight": "단순 활동을 통해 느리지만 지속 가능한 에너지 회복",
        "energy_level_id": "c8baad43-b80c-4b80-9fc2-1f24c755fb53"
    },
    {
        "title": "좋아하는 향 피우기 or 음악 듣기",
        "description": "좋아하는 향이나 음악으로 감각 자극과 정서 안정",
        "duration_minutes": 10,
        "good_point": "편안함과 기분 전환 제공",
        "insight": "피로가 남아있어 창의적 작업은 어렵지만 감각 회복 도움",
        "energy_level_id": "c8baad43-b80c-4b80-9fc2-1f24c755fb53"
    },
    {
        "title": "일기나 기록 앱에 에너지 기록 남기기",
        "description": "오늘의 에너지 상태와 감정을 간단히 기록",
        "duration_minutes": 5,
        "good_point": "자기 인식과 회복 패턴 분석 도움",
        "insight": "느린 회복 상태에서 작은 성취와 자기 관찰 가능",
        "energy_level_id": "c8baad43-b80c-4b80-9fc2-1f24c755fb53"
    },
    {
        "title": "간단한 목표 1개 세우기 (“컵 설거지하기”)",
        "description": "실현 가능한 작은 목표를 정하고 완료함으로써 성취감 경험",
        "duration_minutes": 10,
        "good_point": "작은 성공으로 동기와 자신감 회복",
        "insight": "피곤하지만 가능한 행동으로 회복의 실마리 제공",
        "energy_level_id": "c8baad43-b80c-4b80-9fc2-1f24c755fb53"
    },
     # -----------------------------
    # 에너지 레벨 4
    # -----------------------------
    {
        "title": "오늘 해야 할 일 1개만 완료하기",
        "description": "하루의 단 한 가지 목표를 선택하고 완료함으로써 성취감 경험",
        "duration_minutes": 20,
        "good_point": "작은 성공으로 동기 부여와 일상 회복 도움",
        "insight": "집중력이 낮은 상태에서도 실행 가능한 활동으로 루틴 회복 시작",
        "energy_level_id": "52dce2ed-01e2-4dc7-b1ad-7daa456b8397"
    },
    {
        "title": "샤워하기",
        "description": "따뜻한 물로 샤워하며 몸과 마음을 정리",
        "duration_minutes": 15,
        "good_point": "피로 완화, 기분 전환, 일상 회복 촉진",
        "insight": "단순 활동으로 몸과 정신의 안정 유지에 도움",
        "energy_level_id": "52dce2ed-01e2-4dc7-b1ad-7daa456b8397"
    },
    {
        "title": "간단한 요리하기",
        "description": "간단한 식사를 준비하며 움직임과 성취감 경험",
        "duration_minutes": 20,
        "good_point": "활동과 성취감 동시에 제공, 일상 루틴 유지",
        "insight": "기본적인 활동이 가능해진 상태에서 적합",
        "energy_level_id": "52dce2ed-01e2-4dc7-b1ad-7daa456b8397"
    },
    {
        "title": "라디오나 팟캐스트 들으며 정리",
        "description": "음악이나 음성 콘텐츠를 들으며 정리하거나 가벼운 작업 수행",
        "duration_minutes": 20,
        "good_point": "심리적 안정과 가벼운 자극 제공",
        "insight": "집중력은 낮지만 단순 업무 수행에 도움",
        "energy_level_id": "52dce2ed-01e2-4dc7-b1ad-7daa456b8397"
    },
    {
        "title": "누군가에게 메시지 한 통 보내기",
        "description": "짧은 메시지로 관계를 이어가며 사회적 연결감 확보",
        "duration_minutes": 5,
        "good_point": "정서적 안정과 긍정적 감정 강화",
        "insight": "기본 활동 수행 가능 상태에서 소소한 만족감 제공",
        "energy_level_id": "52dce2ed-01e2-4dc7-b1ad-7daa456b8397"
    },
     # -----------------------------
    # 에너지 레벨 5
    # -----------------------------
     {
        "title": "20분 산책",
        "description": "가벼운 산책으로 신체 활동과 기분 전환",
        "duration_minutes": 20,
        "good_point": "혈액순환 촉진과 스트레스 완화",
        "insight": "신체 피로감이 덜한 상태에서 에너지 유지에 도움",
        "energy_level_id": "f7ef6b90-21ff-41be-b79a-3ecacc1f0e8f"
    },
    {
        "title": "좋아하는 콘텐츠 보기 (드라마, 유튜브 등)",
        "description": "즐거운 영상 콘텐츠로 긍정적 감정과 휴식 경험",
        "duration_minutes": 30,
        "good_point": "정서적 만족감과 기분 전환 제공",
        "insight": "장시간 집중이 어렵지만 루틴 수행 가능 상태에서 적합",
        "energy_level_id": "f7ef6b90-21ff-41be-b79a-3ecacc1f0e8f"
    },
    {
        "title": "오늘 하루 계획 짧게 세우기",
        "description": "짧게 하루 계획을 정리하여 일상 루틴 점검",
        "duration_minutes": 5,
        "good_point": "업무와 생활 균형 관리, 계획적 행동 유도",
        "insight": "에너지가 안정된 상태에서 효율적인 하루 준비 가능",
        "energy_level_id": "f7ef6b90-21ff-41be-b79a-3ecacc1f0e8f"
    },
    {
        "title": "나를 기분 좋게 하는 사진 정리",
        "description": "좋은 추억이나 사진을 정리하며 정서적 만족감 증진",
        "duration_minutes": 15,
        "good_point": "긍정적 감정 강화와 자기돌봄 경험 제공",
        "insight": "작은 활동으로도 기분과 에너지 유지에 도움",
        "energy_level_id": "f7ef6b90-21ff-41be-b79a-3ecacc1f0e8f"
    },
    {
        "title": "간단한 근육 풀기",
        "description": "가벼운 스트레칭이나 근육 풀기로 피로 예방",
        "duration_minutes": 10,
        "good_point": "신체 회복과 활력 유지에 도움",
        "insight": "루틴 업무 수행 가능 상태에서 활동 지속성 유지",
        "energy_level_id": "f7ef6b90-21ff-41be-b79a-3ecacc1f0e8f"
    },
     # -----------------------------
    # 에너지 레벨 6
    # -----------------------------
    {
        "title": "카페나 공원 등 외출",
        "description": "짧게 외출하여 환경 변화를 경험하고 활력 회복",
        "duration_minutes": 30,
        "good_point": "기분 전환과 정신적 자극 제공",
        "insight": "신체가 가벼워지고 에너지가 올라간 상태에서 적합",
        "energy_level_id": "c243c8af-c298-4198-abaf-f29482bc99a4"
    },
    {
        "title": "집중력 필요한 일 1개 수행",
        "description": "업무나 과제를 하나 선택하여 집중적으로 수행",
        "duration_minutes": 30,
        "good_point": "업무 효율 향상과 성취감 제공",
        "insight": "집중력이 올라가고 정신적 활동 가능 상태에서 적합",
        "energy_level_id": "c243c8af-c298-4198-abaf-f29482bc99a4"
    },
    {
        "title": "친구에게 전화하기",
        "description": "친구와 짧게 소통하며 사회적 연결감 강화",
        "duration_minutes": 10,
        "good_point": "정서적 안정과 긍정적 감정 증진",
        "insight": "활동 가능 상태에서 적은 노력으로 사회적 자극 제공",
        "energy_level_id": "c243c8af-c298-4198-abaf-f29482bc99a4"
    },
    {
        "title": "운동 15분 (요가, 스트레칭 등)",
        "description": "가벼운 운동으로 체력 유지와 정신적 활력 회복",
        "duration_minutes": 15,
        "good_point": "혈액순환 개선, 피로 감소, 집중력 향상",
        "insight": "신체 활력이 회복된 상태에서 적극적 에너지 사용 가능",
        "energy_level_id": "c243c8af-c298-4198-abaf-f29482bc99a4"
    },
    {
        "title": "건강한 식사 준비",
        "description": "영양을 고려한 식사 준비로 신체 에너지 보충",
        "duration_minutes": 20,
        "good_point": "신체 회복과 활력 유지, 자기 돌봄 강화",
        "insight": "에너지가 회복된 상태에서 지속적 활동 기반 마련",
        "energy_level_id": "c243c8af-c298-4198-abaf-f29482bc99a4"
    },
     # -----------------------------
    # 에너지 레벨 7
    # -----------------------------
    {
        "title": "새로운 취미 시도 (그림, 글쓰기 등)",
        "description": "창의적 활동을 통해 새로운 경험과 성취감 획득",
        "duration_minutes": 30,
        "good_point": "창의력 향상과 긍정적 감정 증가",
        "insight": "에너지가 충분히 회복된 상태에서 생산적 활동 시작에 적합",
        "energy_level_id": "ae239a57-7b18-40b6-be1c-60429cf3c21a"
    },
    {
        "title": "목표를 작은 단위로 쪼개서 실행",
        "description": "큰 목표를 실현 가능한 단위로 나누어 단계적 수행",
        "duration_minutes": 20,
        "good_point": "효율적인 업무 수행과 성취감 증대",
        "insight": "멀티태스킹 가능 상태에서 계획적 실행에 도움",
        "energy_level_id": "ae239a57-7b18-40b6-be1c-60429cf3c21a"
    },
    {
        "title": "뇌에 자극 주는 콘텐츠 소비 (강연, 인터뷰 등)",
        "description": "정보와 지식을 접하며 사고력과 창의력 자극",
        "duration_minutes": 25,
        "good_point": "정신적 활력과 창의적 사고 촉진",
        "insight": "집중력이 높아진 상태에서 학습 및 사고 확장에 적합",
        "energy_level_id": "ae239a57-7b18-40b6-be1c-60429cf3c21a"
    },
    {
        "title": "자기돌봄 루틴 기록 정리",
        "description": "일상 자기돌봄 루틴을 점검하고 기록",
        "duration_minutes": 15,
        "good_point": "자기관리와 지속적 에너지 유지에 도움",
        "insight": "활력 넘치는 상태에서 회복 패턴 정리에 적합",
        "energy_level_id": "ae239a57-7b18-40b6-be1c-60429cf3c21a"
    },
    {
        "title": "30분 정도 계획적 운동",
        "description": "조깅, 요가 등 계획적 운동으로 체력 유지 및 활력 강화",
        "duration_minutes": 30,
        "good_point": "체력과 정신적 에너지 모두 강화",
        "insight": "에너지가 충분히 돌아온 상태에서 생산적 활동과 창의적 확장 지원",
        "energy_level_id": "ae239a57-7b18-40b6-be1c-60429cf3c21a"
    },
     # -----------------------------
    # 에너지 레벨 8
    # -----------------------------
    {
        "title": "하루 루틴 점검 (일-휴식 균형)",
        "description": "오늘의 일정과 휴식 시간을 점검하며 균형 유지",
        "duration_minutes": 15,
        "good_point": "에너지 분산과 관리, 효율적 하루 운영",
        "insight": "신체와 정신이 모두 활발한 상태에서 장기적 에너지 관리 가능",
        "energy_level_id": "0958ca95-8477-48f0-8ab1-a0600da24f1f"
    },
    {
        "title": "새로운 사람 만나기 or 커뮤니티 참여",
        "description": "사회적 활동과 새로운 인맥 확장을 통해 자극 경험",
        "duration_minutes": 30,
        "good_point": "사회적 연결감 강화, 창의적 아이디어 자극",
        "insight": "활력 넘치는 상태에서 에너지를 긍정적 방향으로 활용 가능",
        "energy_level_id": "0958ca95-8477-48f0-8ab1-a0600da24f1f"
    },
    {
        "title": "집중력 필요한 프로젝트 진행",
        "description": "논리적 사고와 창의력을 요하는 프로젝트에 몰입",
        "duration_minutes": 60,
        "good_point": "생산성과 문제 해결 능력 극대화",
        "insight": "정신적 에너지와 창의성이 모두 활성화된 상태에서 적합",
        "energy_level_id": "0958ca95-8477-48f0-8ab1-a0600da24f1f"
    },
    {
        "title": "자기계발 활동 (독서, 공부 등)",
        "description": "지식 습득과 스킬 향상을 위한 학습 활동",
        "duration_minutes": 45,
        "good_point": "정신적 성장과 자기효능감 향상",
        "insight": "높은 집중력과 창의성을 활용해 자기계발 극대화 가능",
        "energy_level_id": "0958ca95-8477-48f0-8ab1-a0600da24f1f"
    },
    {
        "title": "잠자기 전 루틴으로 회복 조율",
        "description": "잠들기 전 루틴으로 신체와 정신의 회복 준비",
        "duration_minutes": 15,
        "good_point": "다음 날 에너지 최적화, 회복 효율 증진",
        "insight": "강한 에너지 상태에서도 회복을 고려한 지속 가능 활동",
        "energy_level_id": "0958ca95-8477-48f0-8ab1-a0600da24f1f"
    },
     # -----------------------------
    # 에너지 레벨 9
    # -----------------------------
    {
        "title": "도전적인 과제 시작",
        "description": "난이도 높은 업무나 프로젝트에 도전하여 몰입 경험",
        "duration_minutes": 60,
        "good_point": "몰입과 성취감 극대화, 문제 해결력 강화",
        "insight": "신체와 정신이 최상 상태에서 생산성과 리더십 발휘 가능",
        "energy_level_id": "3a47e99f-a065-4640-92f9-8f6b4548c776"
    },
    {
        "title": "다른 사람 돕는 일 하기",
        "description": "팀원이나 주변 사람을 지원하며 사회적 영향력 발휘",
        "duration_minutes": 30,
        "good_point": "리더십 강화, 긍정적 정서와 관계 형성",
        "insight": "자신감과 에너지가 넘치는 상태에서 사회적 기여 극대화",
        "energy_level_id": "3a47e99f-a065-4640-92f9-8f6b4548c776"
    },
    {
        "title": "목표 달성 피드백 기록",
        "description": "완료한 목표와 과정에 대한 피드백을 기록",
        "duration_minutes": 15,
        "good_point": "자기인식 향상과 성취감 강화",
        "insight": "최상의 집중력과 판단력을 활용해 회고와 개선 가능",
        "energy_level_id": "3a47e99f-a065-4640-92f9-8f6b4548c776"
    },
    {
        "title": "나의 회복 패턴 정리",
        "description": "개인 회복 패턴을 분석하고 기록하여 자기관리 강화",
        "duration_minutes": 20,
        "good_point": "지속적인 에너지 관리와 효율적 자기돌봄 가능",
        "insight": "높은 에너지와 자신감 상태에서 회복 전략 최적화",
        "energy_level_id": "3a47e99f-a065-4640-92f9-8f6b4548c776"
    },
    {
        "title": "성취한 일 SNS나 커뮤니티에 공유",
        "description": "완료한 성과를 외부와 공유하며 동기 부여와 피드백 확보",
        "duration_minutes": 15,
        "good_point": "사회적 인정과 동기 강화, 성취감 상승",
        "insight": "최고 컨디션에서 활동을 외부와 연결하여 긍정적 효과 극대화",
        "energy_level_id": "3a47e99f-a065-4640-92f9-8f6b4548c776"
    },
     # -----------------------------
    # 에너지 레벨 10
    # -----------------------------
     {
        "title": "루틴 점검 및 휴식일 계획 세우기",
        "description": "현재 루틴을 점검하고 효율적인 휴식 계획 포함",
        "duration_minutes": 20,
        "good_point": "지속 가능한 에너지 관리와 효율적 시간 활용",
        "insight": "완벽한 컨디션 상태에서 장기적 에너지 유지 가능",
       "energy_level_id": "20a0e4cf-7a6d-460a-b85e-1359eff18cf3"
    },
    {
        "title": "새로운 프로젝트 기획",
        "description": "창의력과 집중력을 활용해 새로운 프로젝트 기획",
        "duration_minutes": 45,
        "good_point": "생산성과 창의적 성취 극대화",
        "insight": "최상의 집중력과 에너지를 활용한 고강도 활동에 적합",
        "energy_level_id": "20a0e4cf-7a6d-460a-b85e-1359eff18cf3"
    },
    {
        "title": "동료나 친구에게 영감 나누기",
        "description": "아이디어, 경험, 동기 부여를 공유하며 사회적 영향력 확대",
        "duration_minutes": 30,
        "good_point": "리더십 발휘, 긍정적 영향력 증대",
        "insight": "최고의 에너지 상태에서 사회적 관계 강화 및 동기 부여",
        "energy_level_id": "20a0e4cf-7a6d-460a-b85e-1359eff18cf3"
    },
    {
        "title": "다음 주 일정에 '쉼' 배치",
        "description": "다음 주 계획에 휴식과 재충전 시간을 미리 확보",
        "duration_minutes": 15,
        "good_point": "지속 가능한 에너지 관리와 스트레스 예방",
        "insight": "완벽한 컨디션에서도 장기적 회복과 균형 유지에 도움",
        "energy_level_id": "20a0e4cf-7a6d-460a-b85e-1359eff18cf3"
    },
    {
        "title": "자기돌봄 리추얼 유지하기",
        "description": "매일의 자기돌봄 루틴을 지속하며 컨디션 최적화",
        "duration_minutes": 20,
        "good_point": "신체적, 정신적 건강 유지와 성취감 강화",
        "insight": "슈퍼모드 상태에서 지속적 자기관리와 에너지 극대화 지원",
        "energy_level_id": "20a0e4cf-7a6d-460a-b85e-1359eff18cf3"
    }
    
]

# -----------------------------
# DB에 데이터 넣기
# -----------------------------
def seed_templates():
    db = SessionLocal()
    try:
        for data in TEMPLATE_DATA:
            template = ActivityTemplate(
                id=uuid.uuid4(),
                title=data["title"],
                description=data.get("description"),
                duration_minutes=data.get("duration_minutes"),
                good_point=data.get("good_point"),
                insight=data.get("insight"),
                energy_level_id=data["energy_level_id"]
            )
            db.add(template)

        db.commit()
        print("✅ ActivityTemplate 데이터 입력 완료")
    except Exception as e:
        db.rollback()
        print("❌ 입력 실패:", e)
    finally:
        db.close()
