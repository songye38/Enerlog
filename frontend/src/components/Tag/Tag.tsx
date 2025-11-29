import { COLORS } from "../../types/Colors";

interface TagProps {
  label: string;
  count?: number; // 선택값
  withBackground?: boolean; // 배경색 표시 여부
  isSelected?: boolean; // 🔹 선택 상태
  onClick?: () => void; // 🔹 클릭 이벤트
}

export default function Tag({ label, count, withBackground = true, isSelected = false, onClick }: TagProps) {
  return (
    <div
      onClick={onClick} // 🔹 클릭 시 토글
      style={{
        padding: "8px 14px",
        backgroundColor: isSelected ? COLORS.primary[300] : withBackground ? "white" : COLORS.primary[100],
        borderRadius: 16,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        border: isSelected ? `2px solid ${COLORS.primary[700]}` : "none", // 선택 강조
      }}
    >
      <div
        style={{
          color: "black",
          fontSize: 14,
          fontFamily: "Pretendard",
          fontWeight: 600,
          wordWrap: "break-word",
        }}
      >
        #{label}
      </div>

      {count !== undefined && (
        <div
          style={{
            color: "#455CC5",
            fontSize: 10,
            fontFamily: "Pretendard",
            fontWeight: 800,
            wordWrap: "break-word",
          }}
        >
          {count}회
        </div>
      )}
    </div>
  );
}
