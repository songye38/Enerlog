import type { ActivityFeed } from "../types/ActivityFeed";
import arrowIcon from '/icons/14X14/arrow-narrow-up-right.png';

interface ActivitySectionProps {
  activity: ActivityFeed;
  onSelected?: (id: string) => void;
}

export default function ActivityDisplaySection({ activity, onSelected }: ActivitySectionProps) {

  const handleClick = () => {
    if (onSelected) {
      onSelected(activity.id);
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <div
        style={{
          width: 390,
          padding: "20px 16px 24px 16px",
          background: "#ECEFF9",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* 에너지 레벨 */}
        <div style={{ alignSelf: "stretch", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
          <div
            style={{
              padding: "6px 8px",
              background: "#455CC5",
              borderRadius: 6,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <img src={arrowIcon} alt="Arrow Icon" style={{ width: 14, height: 14 }} />
            <div style={{ color: "#ECEFF9", fontSize: 15, fontWeight: 600 }}>
              에너지 레벨 : {activity.level}
            </div>
          </div>
          <div style={{ flex: "1 1 0", height: 8 }} />
          {/* <img src={heartIcon} alt="Heart Icon" style={{ width: 16, height: 16 }} /> */}
        </div>

        {/* 내용 */}
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 7 }}>
            <div style={{ padding: "5px 8px", background: "black", borderRadius: 4 }}>
              <div style={{ color: "white", fontSize: 12, fontWeight: 600 }}>
                #{activity.count}회 수행
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 7 }}>
            <div style={{ fontSize: 25, fontFamily: "IsYun", fontWeight: 400 ,color:'black'}}>
              {activity.title}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 8, fontSize: 15, lineHeight: "22px",color:'black' }}>
            {activity.description}
          </div>
        </div>
      </div>
    </div>
  );
}
