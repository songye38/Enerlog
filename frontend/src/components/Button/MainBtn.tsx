type MainBtnProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary"; // 🔥 추가
};

export default function MainBtn({
  children,
  onClick,
  disabled = false,
  variant = "primary",
}: MainBtnProps) {
  const isSecondary = variant === "secondary";

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: "100%",
        alignSelf: "stretch",
        padding: "20px 22px",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        display: "inline-flex",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s, opacity 0.2s",

        // 🔥 variant별 배경색
        background: disabled
          ? "#AFB9E6" // primary disabled
          : isSecondary
          ? "#F0F0F0" // secondary 일반
          : "#455CC5", // primary 일반
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontFamily: "Pretendard",
          fontWeight: 600,
          wordWrap: "break-word",
          lineHeight: "24px",

          // 🔥 variant별 폰트 색
          color: isSecondary ? "#8C8C8C" : "white",
        }}
      >
        {children}
      </div>
    </div>
  );
}
