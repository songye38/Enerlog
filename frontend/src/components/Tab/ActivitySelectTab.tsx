interface ActivitySelectTabProps {
    selectedTab?: string; // 부모가 선택한 값
    onChange?: (selected: string) => void; 
}

export default function ActivitySelectTab({ selectedTab, onChange }: ActivitySelectTabProps) {
    const defaultOptions = [
        "전체",
        "에너지1","에너지2","에너지3","에너지4","에너지5",
        "에너지6","에너지7","에너지8","에너지9","에너지10"
    ];

    const tabs = defaultOptions;
    const activeIndex = selectedTab ? tabs.indexOf(selectedTab) : 0; // 부모 값 우선

    const handleClick = (idx: number) => {
        if (onChange) onChange(tabs[idx]);
    };

    return (
        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: 4, width:'90vw' }}>
            {tabs.map((label, idx) => (
                <div
                    key={idx}
                    onClick={() => handleClick(idx)}
                    style={{
                        padding: "10px",
                        borderRadius: 8,
                        background: activeIndex === idx ? "#D2D8F1" : "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        flex: "0 0 auto"
                    }}
                >
                    <div style={{ color: "black", fontSize: 14, fontFamily: "Pretendard", fontWeight: 600 }}>
                        {label}
                    </div>
                </div>
            ))}
        </div>
    );
}
