import { useState } from "react";

interface ActivityTabProps {
  myActivitiesCount: number; // 외부에서 받은 활동 개수
  onChange?: (selected: "추천 활동" | "내가 만든 활동") => void;
}

export default function ActivityTab({ myActivitiesCount, onChange }: ActivityTabProps) {
  const tabs = ["추천 활동", "내가 만든 활동"] as const;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (idx: number) => {
    setActiveIndex(idx);
    if (onChange) onChange(tabs[idx]);
  };

  return (
    <div style={{ display: "flex", gap: 10,marginTop:36 }}>
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
