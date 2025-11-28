interface ActivityTabProps {
  myActivitiesCount: number;
  selectedTab?: "추천 활동" | "내가 만든 활동"; // 부모가 선택한 탭
  onChange?: (selected: "추천 활동" | "내가 만든 활동") => void;
}

export default function ActivityTab({ myActivitiesCount, selectedTab, onChange }: ActivityTabProps) {
  const tabs = ["추천 활동", "내가 만든 활동"] as const;
  
  // 부모에서 선택값이 없으면 기본 0, 있으면 해당 인덱스로 설정
  const activeIndex = selectedTab ? tabs.indexOf(selectedTab) : 0;

  const handleClick = (idx: number) => {
    if (onChange) onChange(tabs[idx]);
  };

  return (
    <div style={{ display: "flex", gap: 10, marginTop: 36 }}>
      {tabs.map((label, idx) => {
        const displayLabel =
          label === "내가 만든 활동" ? `${label} (${myActivitiesCount}개)` : label;

        return (
          <div
            key={idx}
            onClick={() => handleClick(idx)}
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              borderBottom:
                activeIndex === idx ? "1.6px black solid" : "none",
            }}
          >
            <div
              style={{
                color: activeIndex === idx ? "black" : "#BFBFBF",
                fontSize: 18,
                fontFamily: "Pretendard",
                fontWeight: 600,
                wordWrap: "break-word",
              }}
            >
              {displayLabel}
            </div>
          </div>
        );
      })}
    </div>
  );
}
