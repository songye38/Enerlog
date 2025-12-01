import { useState } from "react";
import type { ActivityFeed } from "../types/ActivityFeed";
import arrowIcon from '/icons/14X14/arrow-narrow-up-right.png';
import menuIcon from '/icons/20X20/dots-horizontal.png';
import heartIcon from '/icons/16X16/heart.png';
import UpdateMenu from "../components/Menu/UpdateMenu";
import MakeMyActivitySectionS from "./MakeMyActivitySectionS";
import { DeleteUserActivity, UpdateUserActivity } from "../api/activity";
import type { ActivityUpdatePayload } from "../api/activity";
import { toast } from "react-toastify";

interface ActivitySectionProps {
  activity: ActivityFeed;
  onDeleted?: (id: string) => void; // 부모에게 알려서 리스트 갱신
  onEdited?: (id: string, payload: ActivityUpdatePayload) => void; // 편집 후 부모에게 알림
  onAdded?: (newActivity: ActivityFeed) => void; // 새로 추가된 활동 알림
}

export default function ActivitySection({ activity, onDeleted, onEdited }: ActivitySectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
        toast.success("삭제 완료!");
      } catch (err) {
        toast.error("삭제 실패");
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
              에너지 레벨 : {activity.energy_level}
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
            <div style={{ width: 'auto', padding: "5px 8px", background: "black", borderRadius: 4, display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
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
          </div>
        </div>
      </div>

      {/* 편집 모드 컴포넌트 */}
      {isEditing && (
        <MakeMyActivitySectionS
          initialTitle={activity.title}
          initialDescription={activity.description}
          initialDuration={activity.durationMinutes}
          initialEnergyLevel={activity.energy_level}
          initialGoodPoint={activity.good_point}
          isEditing={true}
          editingActivityId={activity.id}
          onSubmit={async (payload) => {
            try {
              await UpdateUserActivity(activity.id, payload);
              setIsEditing(false);
              onEdited?.(activity.id, payload); // 편집 후 처리
            } catch (err) {
              console.error("수정 실패:", err);
            }
          }}
        />
      )}
    </div>
  );
}
