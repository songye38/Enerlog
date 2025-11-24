
import { COLORS } from "../../types/Colors";

interface MainInputProps {
    label: string;             // 입력 항목 제목
    value: string;             // 입력 값
    onChange: (value: string) => void;  // 값 변경 이벤트
    type?: "text" | "password"; // 입력 타입, 기본은 "text"
    placeholder?: string;       // 입력창 placeholder
}

export default function MainInput({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
}: MainInputProps) {
    return (
        <div
            style={{
                alignSelf: "stretch",
                padding: "12px 12px 4px 12px",
                backgroundColor: COLORS.primary[200],
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                justifyContent: "center", // 부모 높이 기준 세로 중앙
                alignItems: "center",     // 자식 수평 중앙
            }}
        >
            {/* 제목 */}
            <div
                style={{
                    color: "black",
                    fontSize: 14,
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 600,
                }}
            >
                {label}
            </div>

            {/* 입력창 */}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    padding: 10,
                    margin:10,
                    fontSize: 16,
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    lineHeight: "21px",
                    color: type === "password" ? "black" : "black",
                    backgroundColor: COLORS.primary[200],
                    borderRadius: 6,
                    width: "100%",
                    boxSizing: "border-box",
                    border: "none",
                    outline: "none",        // ← 포커스 시 생기는 하이라이트 제거
                    WebkitAppearance: "none",  // Safari
                    MozAppearance: "none",     // Firefox
                    appearance: "none",
                }}
            />
        </div>
    );
}
