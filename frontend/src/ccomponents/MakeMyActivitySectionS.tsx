
import MainInput from "../components/Input/MainInput";
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
        <div style={{ width: 390, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 36, display: 'inline-flex' ,marginTop:32}}>
            {/* 제목 */}
            <div style={{ alignSelf: 'stretch', textAlign: 'center' }}>
                <span style={{ color: 'black', fontSize: 16, fontFamily: 'Pretendard', fontWeight: 600, lineHeight: '26px' }}>
                    내가 만드는 활동<br /><br />
                </span>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목(필수)"
                    style={{
                        color: 'black',
                        fontSize: 20,
                        fontFamily: "IsYun, sans-serif",
                        fontWeight: 600,
                        lineHeight: '26px',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        background: 'transparent',
                    }}
                />

            </div>


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
                {/* 세부 정보 */}
                <MainInput label="설명(필수)" value={description} onChange={setDescription} type="text" />
                <MainInput label="좋은점" value={goodPoint} onChange={setGoodPoint} type="text" />
                <MainInput label="소요시간" value={duration} onChange={setDuration} type="text" />
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
