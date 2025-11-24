import AddIcon from '/icons/16X16/plus.png'

interface AddTagBtnProps {
  onClick?: () => void;
}

export default function AddTagBtn({ onClick }: AddTagBtnProps) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "8px 14px",
        background: "white",
        borderRadius: 16,
        outline: "1.60px #455CC5 dotted",
        outlineOffset: "-1.60px",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        cursor: "pointer",
      }}
    >

      {/* + 아이콘(네모 + 십자가 형태) */}
        <img src={AddIcon} alt="Add Icon" style={{ width: 16, height: 16 }} />
      

      <div
        style={{
          color: "#455CC5",
          fontSize: 14,
          fontFamily: "Pretendard",
          fontWeight: 600,
        }}
      >
        추가
      </div>
    </div>
  );
}
