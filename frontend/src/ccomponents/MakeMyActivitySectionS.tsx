import { useState } from "react";
import arrowIcon from '/icons/14X14/arrow-narrow-up-right.png';
import EnergyLevelSelectSlider from "../components/Slide/EnergyLevelSelectSlider";
import MainBtn from "../components/Button/MainBtn";
import { createActivity, UpdateUserActivity } from "../api/activity";
import { toast } from "react-toastify";
import type { ActivityUpdatePayload, ActivityCreatePayload } from "../api/activity";
import type { ActivityFeed, EnergyLevel } from "../types/ActivityFeed";

interface MakeMyActivitySectionSProps {
  initialTitle?: string;
  initialDescription?: string;
  initialDuration?: string;
  initialEnergyLevel?: EnergyLevel;
  initialGoodPoint?: string;
  onSubmit?: (payload: ActivityUpdatePayload, isEditing: boolean, id?: string) => Promise<void>;
  isEditing?: boolean;
  editingActivityId?: string;
  onAdded?: (newActivity: ActivityFeed) => void;
}

export default function MakeMyActivitySectionS({
  initialTitle,
  initialDescription,
  initialDuration,
  initialEnergyLevel,
  initialGoodPoint,
  onSubmit,
  isEditing = false,
  editingActivityId,
  onAdded
}: MakeMyActivitySectionSProps) {
  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [duration, setDuration] = useState(initialDuration || "");
  const [goodPoint, setGoodPoint] = useState(initialGoodPoint || "");
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | null>(initialEnergyLevel ?? null);
  const [showSlider, setShowSlider] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSubmitDisabled = loading || energyLevel === null || !title.trim() || !description.trim();

  async function handleSubmit() {
    if (isSubmitDisabled) return;

    setLoading(true);

    try {
      if (isEditing && editingActivityId) {
        const updatePayload: ActivityUpdatePayload = {
          ...(title && { title }),
          ...(description && { description }),
          ...(duration && { duration_minutes: duration }),
          ...(goodPoint && { good_point: goodPoint }),
          ...(energyLevel != null && { energy_level: energyLevel }),
          is_public: false,
        };

        await UpdateUserActivity(editingActivityId, updatePayload);
        toast.success("활동이 수정되었습니다.");

        if (onSubmit) {
          await onSubmit(updatePayload, true, editingActivityId);
        }
      } else {
        if (!title || !description || energyLevel == null) {
          toast.error("필수 항목을 모두 입력해주세요.");
          setLoading(false);
          return;
        }

        const createPayload: ActivityCreatePayload = {
          title,
          description,
          is_public: false,
          duration_minutes: duration || undefined,
          good_point: goodPoint || undefined,
          energy_level: energyLevel,
        };

        const createdActivity = await createActivity(createPayload);
        toast.success("활동이 추가되었습니다!");

        if (onAdded && createdActivity) {
          onAdded({
            id: createdActivity.id,
            title: createdActivity.title,
            description: createdActivity.description || "",
            durationMinutes: createdActivity.duration_minutes || "",
            good_point: createdActivity.good_point || "",
            insight: createdActivity.insight || "",
            energy_level: createdActivity.energy_level as EnergyLevel,
            count: 0,
          });
        }

        if (onSubmit) {
          await onSubmit(createPayload, false);
        }
      }

      // 입력 초기화
      setTitle("");
      setDescription("");
      setDuration("");
      setGoodPoint("");
      setEnergyLevel(null);

    } catch (error) {
      console.error(error);
      toast.error(isEditing ? "활동 수정 실패" : "활동 저장 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      width: 390,
      display: 'inline-flex',
      flexDirection: 'column',
      gap: 20,
      marginTop: 32,
      backgroundColor: '#ECEFF9',
      padding: '20px 16px',
      borderRadius: 12
    }}>
      {/* 에너지 레벨 선택 */}
      <div>
        <div
          onClick={() => setShowSlider(prev => !prev)}
          style={{
            display: "inline-flex",
            padding: "6px 8px",
            background: "#455CC5",
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          <img src={arrowIcon} alt="Arrow Icon" style={{ width: 14, height: 14 }} />
          <div style={{
            color: "#ECEFF9",
            fontSize: 13,
            fontFamily: "Pretendard",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}>
            {energyLevel !== null ? `에너지 레벨 ${energyLevel}` : "에너지 레벨 선택(필수)"}
          </div>
        </div>
      </div>

      {/* 입력 필드 */}
      {[
        { label: "활동제목(필수)", value: title, setter: setTitle, placeholder: "활동의 제목을 적어주세요." },
        { label: "설명(필수)", value: description, setter: setDescription, placeholder: "이 활동에서 어떤 것들을 하는지 적어주세요." },
        { label: "좋은점", value: goodPoint, setter: setGoodPoint, placeholder: "이 활동을 하면 어떤 점이 좋을까요?" },
        { label: "소요시간", value: duration, setter: setDuration, placeholder: "예)5분, 1시간" },
      ].map(({ label, value, setter, placeholder }, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          <div style={{ color: 'black', fontSize: 13, fontFamily: 'Pretendard', fontWeight: 600 }}>{label}</div>
          <input
            type="text"
            value={value}
            onChange={(e) => setter(e.target.value)}
            placeholder={placeholder}
            style={{
              color: 'black',
              fontSize: 20,
              fontFamily: "IsYun, sans-serif",
              fontWeight: 600,
              border: 'none',
              outline: 'none',
              width: '100%',
              background: 'transparent',
              padding: 0,
            }}
          />
        </div>
      ))}

      {/* 제출 버튼 */}
      <MainBtn onClick={handleSubmit} disabled={isSubmitDisabled}>
        {loading ? "저장 중..." : "저장하기"}
      </MainBtn>

      {/* 슬라이더 */}
      {showSlider && (
        <div style={{ position: "absolute", top: 350, left: 20, zIndex: 9999 }}>
          <EnergyLevelSelectSlider
            onSelect={(level: EnergyLevel) => {
              setEnergyLevel(level);
              setShowSlider(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
