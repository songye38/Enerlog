
import { COLORS } from "../../types/Colors";
import type { EnergyLevelInfo } from "../../types/EnergyLevel";
import arrow from "/icons/24X24/arrow-up-right.png";
import { useNavigate } from "react-router-dom"; // 🔹 추가!


type EnergySelectorBtnProps = {
    data: EnergyLevelInfo;
};

export default function EnergySelectorBtn({ data }: EnergySelectorBtnProps) {
    const navigate = useNavigate(); // 🔹 추가!
    const handleClick = () => {
        navigate("/add"); // 🔹 클릭 시 /add 페이지로 이동
    };

    return (
        <div
            onClick={handleClick} // 🔥 클릭 이벤트 연결
            style={{
                width: 172,
                height: '100%',
                padding: 16,
                background: COLORS.primary[50],
                borderRadius: 16,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 16,
                display: "inline-flex",
            }}
        >
            {/* 상단 콘텐츠 */}
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
                        fontSize: 20,
                        fontFamily: "SchoolSafeDictation, sans-serif",
                        fontWeight: 400,
                        lineHeight: "16px",
                        wordWrap: "break-word",
                    }}
                >
                    {data.emoji}
                </div>
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

            {/* 하단 레벨 표시 */}
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
                        fontSize: 16,
                        fontFamily: "Pretendard",
                        fontWeight: 700,
                        wordWrap: "break-word",
                    }}
                >
                    {data.level} : {data.title}
                </div>

                <div style={{ flex: "1 1 0", height: 8 }} />
                <img src={arrow} alt="로고" style={{ width: 24 }} />


            </div>
        </div>
    );
}
