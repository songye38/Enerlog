
import type { ActivityFeed } from "../types/ActivityFeed";
import arrowIcon from '/icons/14X14/arrow-narrow-up-right.png'
import menuIcon from '/icons/20X20/dots-horizontal.png'
import heartIcon from '/icons/16X16/heart.png'
import { useState } from "react";
import UpdateMenu from "../components/Menu/UpdateMenu";
import { DeleteUserActivity } from "../api/activity";

interface ActivitySectionProps {
  activity: ActivityFeed;
  onDeleted?: (id: string) => void; // 부모에게 알려서 리스트 갱신
}


export default function ActivitySection({ activity, onDeleted }: ActivitySectionProps) {

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen((prev) => !prev);  // 토글
  };

  const handleNavigate = async (path: string) => {
    setMenuOpen(false);

    if (path === "/acts") {
      try {
        // 낭비 줄이려면 confirm 한 번
        if (!confirm("정말 삭제할까요?")) return;

        // 옵티미스틱: 부모 콜백으로 먼저 제거
        onDeleted?.(activity.id);

        await DeleteUserActivity(activity.id);
        console.log("삭제 완료");
      } catch (error) {
        console.error("삭제 실패:", error);
        // 실패하면 부모에게 다시 재요청 하게 하거나 에러 UI 띄우기
      }
    }
  };

  return (
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
      {/* 상단 에너지 레벨 및 상태 아이콘 */}
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
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
          <div
            style={{
              color: "#ECEFF9",
              fontSize: 15,
              fontFamily: "Pretendard",
              fontWeight: 600,
              wordWrap: "break-word",
            }}
          >
            에너지 레벨 : {activity.level}
          </div>
        </div>
        <div style={{ flex: "1 1 0", height: 8 }} />

        {/* 하트 아이콘 */}
        <img src={heartIcon} alt="Heart Icon" style={{ width: 16, height: 16 }} />

        {/* 메뉴 아이콘 */}
        {/* 메뉴 아이콘 */}
        <div style={{ position: "relative" }}>
          <img
            src={menuIcon}
            alt="Menu Icon"
            style={{ width: 20, height: 20, cursor: "pointer" }}
            onClick={handleMenuClick}
          />

          {/* dropdown을 icon 바로 아래에 겹치게 */}
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",   // 아이콘 바로 아래
                right: 0,
                marginTop: 6,  // 약간 간격
                zIndex: 50,
              }}
            >
              <UpdateMenu onNavigate={handleNavigate} />
            </div>
          )}
        </div>

      </div>





      {/* 활동 내용 */}
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* 상단 태그 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 7,
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "5px 8px",
              background: "black",
              borderRadius: 4,
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 12,
                fontFamily: "Pretendard",
                fontWeight: 600,
                wordWrap: "break-word",
              }}
            >
              #{activity.count}회 수행
            </div>
          </div>

          {/* 제목 */}
          <div style={{ alignSelf: "stretch", display: "flex", justifyContent: "center" }}>
            <div
              style={{
                color: "black",
                fontSize: 25,
                fontFamily: "IsYun, sans-serif",
                fontWeight: 400,
                lineHeight: "24px",
                textAlign: "center",
              }}
            >
              {activity.title}
            </div>
          </div>
        </div>

        {/* 설명 및 태그 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <div style={{ textAlign: "center", color: "black", fontSize: 15, lineHeight: '22px' }}>
            {activity.description.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </div>

          {/* 해시태그 */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {activity.tags.map((tag, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "2px 6px",
                }}
              >
                <div
                  style={{
                    color: "black",
                    fontSize: 10,
                    fontFamily: "Pretendard",
                    fontWeight: 600,
                  }}
                >
                  #{tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
