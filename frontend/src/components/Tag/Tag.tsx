import { COLORS } from "../../types/Colors";

interface TagProps {
  label: string;
  count?: number; // 선택값
  withBackground? : boolean; // 배경색 표시 여부
}

export default function Tag({ label, count,withBackground=true }: TagProps) {
  return (
    <div
      style={{
        padding: "8px 14px",
        backgroundColor: withBackground ? "white": COLORS.primary[100], // 🔥 분기
        borderRadius: 16,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
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
