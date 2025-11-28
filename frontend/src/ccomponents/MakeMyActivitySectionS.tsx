
import { useState } from "react";
import arrowIcon from '/icons/14X14/arrow-narrow-up-right.png'
import EnergyLevelSelectSlider from "../components/Slide/EnergyLevelSelectSlider";
import MainBtn from "../components/Button/MainBtn";
import { createActivity } from "../api/activity";
import { toast } from "react-toastify";
import type { ActivityUpdatePayload, ActivityCreatePayload } from "../api/activity";
import { UpdateUserActivity } from "../api/activity";
import type { ActivityFeed } from "../types/ActivityFeed";

interface MakeMyActivitySectionSProps {
    initialTitle?: string;
    initialDescription?: string;
    initialDuration?: string;
    initialEnergyLevel?: number;
    initialGoodPoint?: string;
    onSubmit?: (payload: ActivityUpdatePayload, isEditing: boolean, id?: string) => Promise<void>;
    isEditing?: boolean;
    editingActivityId?: string;
    onAdded?: (newActivity: ActivityFeed) => void;  // ← 여기 추가
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
    const [energyLevel, setEnergyLevel] = useState<number | null>(initialEnergyLevel ?? null);
    const [showSlider, setShowSlider] = useState(false);
    const [loading, setLoading] = useState(false);

    const isSubmitDisabled = loading || energyLevel === null || !title.trim() || !description.trim();

    async function handleSubmit() {
        if (isSubmitDisabled) return;

        setLoading(true);

        // 함수 상단에서 미리 선언
        let updatePayload: ActivityUpdatePayload | undefined;
        let createPayload: ActivityCreatePayload | undefined;

        try {
            if (isEditing && editingActivityId) {
                updatePayload = {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(duration && { duration_minutes: duration }),
                    ...(goodPoint && { good_point: goodPoint }),
                    ...(energyLevel != null && { energy_level: energyLevel }),
                    is_public: false,
                };

                await UpdateUserActivity(editingActivityId, updatePayload);
                toast.success("활동이 수정되었습니다.");
            } else {
                if (!title || !description || energyLevel == null) {
                    toast.error("필수 항목을 모두 입력해주세요.");
                    setLoading(false);
                    return;
                }

                createPayload = {
                    title,
                    description,
                    is_public: false,
                    duration_minutes: duration,
                    good_point: goodPoint || undefined,
                    energy_level: energyLevel,
                };

                const createdActivity = await createActivity(createPayload);

                if (onAdded && createdActivity) {
                    onAdded({
                        id: createdActivity.id,
                        title: createdActivity.title,
                        description: createdActivity.description || "",
                        durationMinutes: createdActivity.duration_minutes || "",
                        goodPoint: createdActivity.good_point || "",
                        insight: createdActivity.insight || "",    // 서버에서 옵셔널이면 빈 문자열로
                        level: createdActivity.energy_level,       // 반드시 EnergyLevel 타입
                        isHearted: false,                          // 기본값
                        tags: [],                                   // 기본값
                        count: 0,                                   // 기본값
                    });
                }
            }

            // 공통 onSubmit 호출
            if (onSubmit) {
                await onSubmit(
                    isEditing && editingActivityId ? updatePayload! : createPayload!,
                    isEditing,
                    editingActivityId
                );
            }

            // 초기화
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
        <div style={{ width: 390, flexDirection: 'column', gap: 20, display: 'inline-flex', marginTop: 32, backgroundColor: '#ECEFF9', padding: '20px 16px', borderRadius: 12 }}>
            {/* 에너지 레벨 선택하는 부분 */}
            <div>
                <div
                    onClick={() => setShowSlider((prev) => !prev)}
                    style={{
                        display: "inline-flex",       // 🔹 내용만큼 크기
                        padding: "6px 8px",
                        background: "#455CC5",
                        borderRadius: 6,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 6,
                        cursor: "pointer",
                        width: "fit-content",         // 🔹 강제로 내용만큼
                    }}
                >
                    <img src={arrowIcon} alt="Arrow Icon" style={{ width: 14, height: 14 }} />
                    <div
                        style={{
                            color: "#ECEFF9",
                            fontSize: 13,
                            fontFamily: "Pretendard",
                            fontWeight: 600,
                            whiteSpace: "nowrap",     // 🔹 줄바꿈 방지
                        }}
                    >
                        {energyLevel !== null ? `에너지 레벨 ${energyLevel}` : "에너지 레벨 선택(필수)"}
                    </div>
                </div>
            </div>

            {/* 제목 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                <div
                    style={{
                        color: 'black',
                        fontSize: 13,
                        fontFamily: 'Pretendard',
                        fontWeight: 600,
                    }}
                >
                    활동제목(필수)
                </div>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="활동의 제목을 적어주세요."
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
            {/* 설명 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                <div
                    style={{
                        color: 'black',
                        fontSize: 13,
                        fontFamily: 'Pretendard',
                        fontWeight: 600,
                    }}
                >
                    설명(필수)
                </div>

                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="이 활동에서 어떤 것들을 하는지 적어주세요."
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

            {/* 좋은점 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                <div
                    style={{
                        color: 'black',
                        fontSize: 13,
                        fontFamily: 'Pretendard',
                        fontWeight: 600,
                    }}
                >
                    좋은점
                </div>

                <input
                    type="text"
                    value={goodPoint}
                    onChange={(e) => setGoodPoint(e.target.value)}
                    placeholder="이 활동을 하면 어떤 점이 좋을까요?"
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
            {/* 소요시간 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                <div
                    style={{
                        color: 'black',
                        fontSize: 13,
                        fontFamily: 'Pretendard',
                        fontWeight: 600,
                    }}
                >
                    소요시간
                </div>

                <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="예)5분, 1시간"
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




            {/* 버튼  */}
            <MainBtn onClick={handleSubmit} disabled={isSubmitDisabled}>
                {loading ? "저장 중..." : "저장하기"}
            </MainBtn>

            {/* 토글되면 슬라이더 보임 */}
            {showSlider && (
                <div
                    style={{
                        position: "absolute",
                        top: "350px",      // 원하는 위치로 조정
                        left: "20px",      // 원하는 위치로 조정
                        zIndex: 9999,
                    }}
                >
                    <EnergyLevelSelectSlider
                        onSelect={(level) => {
                            setEnergyLevel(level);     // 선택한 값 표시
                            setShowSlider(false);      // 슬라이더 자동 닫힘
                        }}
                    />
                </div>
            )}

        </div>
    );
}
