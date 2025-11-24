// components/Button/ConditionDetailBtn.tsx
import { COLORS } from "../../types/Colors";
import type { ConditionType } from "../../types/ConditionTypes";
import { CONDITION_TYPES } from "../../types/ConditionTypes";
import arrowIcon from '/icons/20X20/arrow-up-right.png';

interface ConditionDetailBtnProps {
    type: ConditionType;        // recentEnergy, recoveryIndex, actRage
    value: string | number;     // ex: "Lv4"
}

export default function ConditionDetailBtn({ type, value }: ConditionDetailBtnProps) {
    const { title, description, bgColor } = CONDITION_TYPES[type];

    return (
        <div
            style={{
                width: 390,
                padding: 20,
                background: COLORS.secondary[bgColor],
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
            }}
        >
            {/* 텍스트 영역 */}
            <div style={{ width: 180, display: "flex", flexDirection: "column", gap: 36 }}>
                
                {/* 제목 + 설명 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div
                        style={{
                            color: "black",
                            fontSize: 17,
                            fontFamily: "Pretendard, sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "Pretendard, sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        {description}
                    </div>
                </div>

                {/* 링크 텍스트 + 아이콘 */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <img src={arrowIcon} alt="arrow icon" style={{ width: 20, height: 20 }} />
                    <div
                        style={{
                            color: "black",
                            fontSize: 13,
                            fontFamily: "Pretendard, sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        대시보드에서 더 자세히 보기
                    </div>
                </div>
            </div>

            {/* Lv 표시 */}
            <div style={{ flex: 1 }} />
            <div
                style={{
                    color: "black",
                    fontSize: 61,
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 500,
                }}
            >
                {value}
            </div>
        </div>
    );
}
