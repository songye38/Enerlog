type MainBtnProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function MainBtn({ children, onClick }: MainBtnProps) {
  return (
    <div 
      onClick={onClick}
      style={{
        width: "100%",
        alignSelf: "stretch",
        padding: "20px 22px",
        background: "#455CC5",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        display: "inline-flex",
        cursor: "pointer"
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
