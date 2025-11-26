
import { useState } from "react";
import arrowIcon from '/icons/14X14/arrow-narrow-up-right.png'
import EnergyLevelSelectSlider from "../components/Slide/EnergyLevelSelectSlider";
import MainBtn from "../components/Button/MainBtn";
//import { ClipLoader } from "react-spinners";


export default function MakeMyActivitySectionS() {
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [goodPoint, setGoodPoint] = useState("");
    const [duration, setDuration] = useState("");
    const [showSlider, setShowSlider] = useState(false);
    const [energyLevel, setEnergyLevel] = useState<number | null>(null);
    const [loading, _setLoading] = useState(false); // 🔹 로딩 상태 추가

    const isSubmitDisabled = loading || !energyLevel || !title.trim() || !description.trim();

    async function handleSubmit() {
        //서버에 저장하는 함수
        //! 아직 연결안함
        // if (isSubmitDisabled) return; // 안전 가드

        // setLoading(true);

        // try {
        //     await fetch("/api/save", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             energyLevel,
        //             title,
        //             description,
        //         }),
        //     });

        //     // 성공 후 UX 흐름 (예: 페이지 이동)
        // } catch (error) {
        //     console.error("저장 실패:", error);
        // } finally {
        //     setLoading(false);
        // }
    }


    return (
        <div style={{ width: 390, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 16, display: 'inline-flex', marginTop: 32, backgroundColor: '#ECEFF9', padding: '20px 16px', borderRadius: 12 }}>
            {/* 에너지 레벨 선택하는 부분 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                <div
                    onClick={() => setShowSlider((prev) => !prev)}
                    style={{
                        width: 'auto',
                        padding: "12px 8px",
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
                        {energyLevel ? `에너지 레벨 ${energyLevel}` : "에너지 레벨 선택(필수)"}
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
                    내가 만드는 활동
                </div>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="활동제목(필수)"
                    style={{
                        color: 'black',
                        fontSize: 18,
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
                    설명
                </div>

                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="설명(필수)"
                    style={{
                        color: 'black',
                        fontSize: 18,
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
                    placeholder="좋은점"
                    style={{
                        color: 'black',
                        fontSize: 18,
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
                    placeholder="소요시간"
                    style={{
                        color: 'black',
                        fontSize: 18,
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
