interface BehaveResultModalProps {
    open: boolean;
    onClose: () => void;
    title: string;                    // ex) 단 5분이라도 눈 감고 누워 있기
    afterEnergyBefore: number | null;
    afterEnergyAfter: number | null;
    bodyBefore: string[];             // ex) ["극도의피로", "졸림"]
    bodyAfter: string[];              // ex) ["나른함", "가벼움"]
    mentalBefore: string[];
    mentalAfter: string[];
}

const BehaveResultModal = ({
    open,
    onClose,
    title,
    afterEnergyBefore,
    afterEnergyAfter,
    bodyBefore,
    bodyAfter,
    mentalBefore,
    mentalAfter,
}: BehaveResultModalProps) => {

    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
                color:'black'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    width: 390,
                    padding: "72px 20px 36px",
                    background: "white",
                    borderRadius: 20,
                    boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 제목 */}
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        color: "#455CC5",
                        fontSize: 48,
                        fontFamily: "WagleWagle",
                        fontWeight: 400,
                        lineHeight: "52px",
                    }}>
                        정말 멋져!
                    </div>
                    <div style={{ marginTop: 10, fontSize: 18, fontWeight: 700, textAlign: "center" ,color:'black'}}>
                        {title}
                    </div>
                </div>

                {/* 에너지 변화 */}
                <div>
                    <div style={{ fontSize: 15, fontWeight: 600,color:'black' }}>나의 에너지 변화</div>

                    <div style={{
                        marginTop: 8,
                        background: "#ECEFF9",
                        borderRadius: 8,
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}>
                        <div style={{ fontWeight: 600 }}>
                            {afterEnergyBefore} →
                        </div>

                        <div
                            style={{
                                background: "#455CC5",
                                color: "white",
                                padding: "8px 14px",
                                borderRadius: 16,
                                fontWeight: 600,
                            }}
                        >
                            {afterEnergyAfter}
                        </div>
                    </div>
                </div>

                {/* 신체 상태 변화 */}
                <div>
                    <div style={{ fontSize: 15, fontWeight: 600,color:'black' }}>나의 신체상태 변화</div>

                    <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                        {/* Before */}
                        <div style={{
                            flex: 1,
                            background: "#ECEFF9",
                            borderRadius: 8,
                            padding: "12px 14px",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                        }}>
                            {bodyBefore.map((tag) => (
                                <div key={tag} style={{ fontSize: 14, fontWeight: 600 ,color:'black'}}>
                                    #{tag}
                                </div>
                            ))}
                        </div>

                        {/* After */}
                        <div style={{
                            flex: 1,
                            background: "#ECEFF9",
                            borderRadius: 8,
                            padding: "12px 14px",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                        }}>
                            {bodyAfter.map((tag) => (
                                <div key={tag} style={{
                                    background: "#455CC5",
                                    color: "white",
                                    padding: "6px 10px",
                                    borderRadius: 16,
                                    fontSize: 13,
                                    fontWeight: 600,
                                }}>
                                    #{tag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 마음 상태 변화 - 구조 동일 */}
                <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>나의 마음상태 변화</div>

                    <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                        <div style={{
                            flex: 1,
                            background: "#ECEFF9",
                            borderRadius: 8,
                            padding: "12px 14px",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                        }}>
                            {mentalBefore.map((tag) => (
                                <div key={tag} style={{ fontSize: 14, fontWeight: 600,color:'black' }}>
                                    #{tag}
                                </div>
                            ))}
                        </div>

                        <div style={{
                            flex: 1,
                            background: "#ECEFF9",
                            borderRadius: 8,
                            padding: "12px 14px",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                        }}>
                            {mentalAfter.map((tag) => (
                                <div key={tag} style={{
                                    background: "#455CC5",
                                    color: "white",
                                    padding: "6px 10px",
                                    borderRadius: 16,
                                    fontSize: 13,
                                    fontWeight: 600,
                                }}>
                                    #{tag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 버튼 */}
                <div
                    style={{
                        marginTop: 10,
                        background: "#455CC5",
                        borderRadius: 8,
                        padding: "20px 22px",
                        textAlign: "center",
                        color: "white",
                        fontSize: 18,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                    onClick={onClose}
                >
                    메인으로 이동
                </div>
            </div>
        </div>
    );
};

export default BehaveResultModal;
