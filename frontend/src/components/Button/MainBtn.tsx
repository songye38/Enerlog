type MainBtnProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean; // 🔹 disabled 추가
};

export default function MainBtn({ children, onClick, disabled = false }: MainBtnProps) {
  return (
    <div 
      onClick={disabled ? undefined : onClick} // 🔹 disabled 시 클릭 막기
      style={{
        width: "100%",
        alignSelf: "stretch",
        padding: "20px 22px",
        background: disabled ? "#AFB9E6" : "#455CC5", // 🔹 disabled 시 회색
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        display: "inline-flex",
        cursor: disabled ? "not-allowed" : "pointer", // 🔹 마우스 포인터 변경
        opacity: disabled ? 0.7 : 1, // 🔹 시각적 효과
        transition: "background 0.2s, opacity 0.2s",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 18,
          fontFamily: "Pretendard",
          fontWeight: 600,
          wordWrap: "break-word",
          lineHeight: "24px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
