import { useState } from "react";
import type { ActivityFeed } from "../types/ActivityFeed";
import arrowIcon from '/icons/14X14/arrow-narrow-up-right.png';
import menuIcon from '/icons/20X20/dots-horizontal.png';
import heartIcon from '/icons/16X16/heart.png';
import UpdateMenu from "../components/Menu/UpdateMenu";
import MakeMyActivitySectionS from "./MakeMyActivitySectionS";
import { DeleteUserActivity, UpdateUserActivity } from "../api/activity";
import type { ActivityUpdatePayload } from "../api/activity";

interface ActivitySectionProps {
  activity: ActivityFeed;
  onDeleted?: (id: string) => void; // 부모에게 알려서 리스트 갱신
}

export default function ActivitySection({ activity, onDeleted }: ActivitySectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 활동 수정 후 상태 업데이트
  const handleEdited = (id: string, payload: ActivityUpdatePayload) => {
    // 여기서는 필요한 경우 로컬 상태를 갱신
    // 예: 부모 컴포넌트에서 activities를 관리하는 경우
    console.log("편집 완료:", id, payload);
  };

  const handleMenuClick = () => setMenuOpen(prev => !prev);

  const handleNavigate = async (path: string) => {
    setMenuOpen(false);

    if (path === "/updateActivity") {
      setIsEditing(true);
    }

    if (path === "/deleteAcitivity") {
      try {
        if (!confirm("정말 삭제할까요?")) return;

        onDeleted?.(activity.id); // 옵티미스틱 제거

        await DeleteUserActivity(activity.id);
        console.log("삭제 완료");
      } catch (err) {
        console.error("삭제 실패:", err);
      }
    }
  };

  return (
    <div>
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
        {/* 상단 에너지 레벨 및 아이콘 */}
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
            <div style={{ color: "#ECEFF9", fontSize: 15, fontFamily: "Pretendard", fontWeight: 600 }}>
              에너지 레벨 : {activity.level}
            </div>
          </div>
          <div style={{ flex: "1 1 0", height: 8 }} />
          <img src={heartIcon} alt="Heart Icon" style={{ width: 16, height: 16 }} />
          <div style={{ position: "relative" }}>
            <img
              src={menuIcon}
              alt="Menu Icon"
              style={{ width: 20, height: 20, cursor: "pointer" }}
              onClick={handleMenuClick}
            />
            {menuOpen && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, zIndex: 50 }}>
                <UpdateMenu onNavigate={handleNavigate} />
              </div>
            )}
          </div>
        </div>

        {/* 활동 내용 */}
        <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", gap: 7 }}>
            {/* 상단 태그 */}
            <div style={{ padding: "5px 8px", background: "black", borderRadius: 4, display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ color: "white", fontSize: 12, fontFamily: "Pretendard", fontWeight: 600 }}>
                #{activity.count}회 수행
              </div>
            </div>

            {/* 제목 */}
            <div style={{ alignSelf: "stretch", display: "flex", justifyContent: "center" }}>
              <div style={{ color: "black", fontSize: 25, fontFamily: "IsYun, sans-serif", fontWeight: 400, textAlign: "center" }}>
                {activity.title}
              </div>
            </div>
          </div>

          {/* 설명 및 해시태그 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <div style={{ textAlign: "center", color: "black", fontSize: 15, lineHeight: '22px' }}>
              {activity.description.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {activity.tags.map((tag, i) => (
                <div key={i} style={{ borderRadius: 4, display: "flex", justifyContent: "center", alignItems: "center", padding: "2px 6px" }}>
                  <div style={{ color: "black", fontSize: 10, fontFamily: "Pretendard", fontWeight: 600 }}>
                    #{tag}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 편집 모드 컴포넌트 */}
      {isEditing && (
        <MakeMyActivitySectionS
          initialTitle={activity.title}
          initialDescription={activity.description}
          initialDuration={activity.durationMinutes}
          initialEnergyLevel={activity.level}
          initialGoodPoint={activity.goodPoint}
          isEditing={true}
          editingActivityId={activity.id}
          onSubmit={async (payload) => {
            try {
              await UpdateUserActivity(activity.id, payload);
              setIsEditing(false);
              handleEdited(activity.id, payload); // 편집 후 처리
            } catch (err) {
              console.error("수정 실패:", err);
            }
          }}
        />
      )}
    </div>
  );
}
