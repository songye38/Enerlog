
import { COLORS } from "../../types/Colors";
import type { EnergyLevelInfo } from "../../types/EnergyLevel";
import arrow from "/icons/24X24/arrow-up-right.png";
import { useNavigate } from "react-router-dom"; // 🔹 추가!


type EnergySelectorBtnProps = {
    data: EnergyLevelInfo;
    mode?: 'navigate' | 'select'; // 🔹 모드
    selected?: boolean;            // 선택 모드에서 선택 상태
    onSelect?: (data: EnergyLevelInfo) => void; // 선택 모드에서 부모 전달
};

export default function EnergySelectorBtn({ data, mode = 'navigate', selected, onSelect }: EnergySelectorBtnProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (mode === 'navigate') {
            navigate(`/add?energy_level=${data.level}`); // 이동
        } else if (mode === 'select') {
            if (onSelect) onSelect(data); // 선택 모드: 부모로 전달
        }
    };

    return (
        <div
            onClick={handleClick}
            style={{
                width: 172,
                height: '100%',
                padding: 16,
                background: COLORS.primary[50],
                borderRadius: 16,
                border: mode === 'select' && selected ? `2px solid ${COLORS.primary[700]}` : 'none',
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 16,
                display: "inline-flex",
                cursor: "pointer",
                transition: "border 0.2s",
            }}
        >
            {/* 기존 내용 그대로 */}
            <div
                style={{
                    alignSelf: "stretch",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    display: "inline-flex",
                }}
            >
                <div
                    style={{
                        color: COLORS.primary[700],
                        fontSize: 23,
                        fontFamily: "IsYun, sans-serif",
                        fontWeight: 700,
                        wordWrap: "break-word",
                    }}
                >
                    {data.level} : {data.title}
                </div>

                <div style={{ flex: "1 1 0", height: 8 }} />
                <img src={arrow} alt="로고" style={{ width: 24 }} />
            </div>

            <div
                style={{
                    alignSelf: "stretch",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 8,
                    display: "flex",
                }}
            >
                <div
                    style={{
                        alignSelf: "stretch",
                        color: "black",
                        fontSize: 17,
                        fontFamily: "IsYun, sans-serif",
                        fontWeight: 600,
                        lineHeight: "18.2px",
                        wordWrap: "break-word",
                    }}
                    dangerouslySetInnerHTML={{ __html: data.description }}
                />
            </div>
        </div>
    );
}
