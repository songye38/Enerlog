interface TagProps {
  label: string;
  count?: number; // 선택값
}

export default function Tag({ label, count }: TagProps) {
  return (
    <div
      style={{
        padding: "8px 14px",
        background: "white",
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
