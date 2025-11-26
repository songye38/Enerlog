import BellIcon from "/icons/20X20/bell.png";
import { useAuth } from "../hooks/useAuth";

interface MainProfileSectionProps {
  name: string;
  imageUrl: string;
}

export default function MainProfileSection({ name, imageUrl }: MainProfileSectionProps) {

  const { user } = useAuth();
  return (
    <div
      style={{
        width: '100%',
        height:'auto',
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 6,
        display: "inline-flex",
        marginTop: 32
      }}
    >
      {/* 프로필 사진 + 이름 */}
      <div
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 6,
          display: "flex",
        }}
      >
        <img
          style={{ width: 36, height: 36, borderRadius: 9999 }}
          src={imageUrl}
          alt={`${name} 프로필 사진`}
        />
        <div
          style={{
            color: "black",
            fontSize: 20,
            fontFamily: "IsYun, sans-serif",
            fontWeight: 600,
            lineHeight: '27px',
            wordWrap: "break-word",
          }}
        >
          {user}
        </div>
      </div>

      {/* 가운데 여백 */}
      <div style={{ flex: "1 1 0", height: 16 }} />

      {/* 상태 아이콘 */}
       <img src={BellIcon} alt="알림 아이콘" style={{ width: 20, height: 20 }} />
    </div>
  );
}
