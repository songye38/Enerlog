import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import RecommendActivitySection from "../ccomponents/RecommendedActivitySection";
import MakeMyActivitySection from "../ccomponents/MakeMyActivitySection"; // 추가
import type { ActivityFeed } from "../types/ActivityFeed";

const mockActivities: ActivityFeed[] = [
  {
    id : '1',
    level: 4,
    isHearted: true,
    title: "전등 끄고 조용한 환경 만들기",
    description: "주변의 시각적·청각적 자극을 최소화하여 마음과 몸이 안정될 수 있는 환경을 만드는 활동입니다.",
    tags: ["편안함", "스트레스 완화", "마음 안정"],
    count: 4,
    goodPoint: "집중력 회복과 피로 회복에 도움",
    insight: "같은 정도로 에너지가 낮았던 사람들 중 70%가 이 활동 후 조금 기운이 나서 다른 일도 시도할 수 있었다",
    durationMinutes: "3분",
  },
  {
    id : '2',
    level: 2,
    isHearted: false,
    title: "짧은 명상하기",
    description: "잠시 눈을 감고 심호흡하며 마음을 정리하는 활동입니다.",
    tags: ["집중", "마음 안정"],
    count: 2,
    goodPoint: "스트레스 감소 및 심신 안정",
    insight: "짧은 명상으로도 마음의 안정과 집중력 향상 효과를 경험",
    durationMinutes: "5분",
  },
  {
    id : '3',
    level: 6,
    isHearted: true,
    title: "가벼운 산책하기",
    description: "자연을 느끼며 가볍게 산책하며 몸과 마음을 활력 있게 만드는 활동입니다.",
    tags: ["활력", "기분 전환", "신체 활동"],
    count: 5,
    goodPoint: "체력 회복과 기분 전환에 도움",
    insight: "활동 후 기분이 좋아지고 작은 운동으로 에너지 회복 가능",
    durationMinutes: "10분",
  },
];

const RecordPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = mockActivities.length + 1; // +1: MakeMyActivitySection

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1)),
    onSwipedRight: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      {/* 슬라이드 영역 */}
      <div {...swipeHandlers} style={{ overflow: "hidden", width: 390 }}>
        <div style={{ display: "flex", transition: "transform 0.3s ease", transform: `translateX(-${currentIndex * 390}px)` }}>
          {mockActivities.map((activity, index) => (
            <RecommendActivitySection
              key={index}
              data={activity}
              rank={index + 1}
              onDoNow={() => console.log("지금 바로 클릭!", index)}
              onDoLater={() => console.log("나중에 클릭!", index)}
            />
          ))}
          <MakeMyActivitySection key="make-my" /> {/* 새 컴포넌트 추가 */}
        </div>
      </div>

      {/* 인디케이터 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: index === currentIndex ? "#BFBFBF" : "#F0F0F0",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RecordPage;
