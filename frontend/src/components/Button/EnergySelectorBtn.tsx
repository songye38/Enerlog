
import { COLORS } from "../../types/Colors";
import type { EnergyLevelInfo } from "../../types/EnergyLevel";
import arrow from "/icons/24X24/arrow-up-right.png";


type EnergySelectorBtnProps = {
  data: EnergyLevelInfo;
};

export default function EnergySelectorBtn({ data }: EnergySelectorBtnProps) {
  return (
    <div
      style={{
        width: 172,
        height: 'auto',
        padding: 16,
        background: COLORS.primary[50],
        borderRadius: 16,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 16,
        display: "inline-flex",
      }}
    >
      {/* 상단 콘텐츠 */}
      <div
        style={{
          alignSelf: "stretch",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 4,
          display: "flex",
        }}
      >
        <div
          style={{
            alignSelf: "stretch",
            color: "black",
            fontSize: 20,
            fontFamily: "Pretendard",
            fontWeight: 400,
            lineHeight: "16px",
            wordWrap: "break-word",
          }}
        >
          {data.emoji}
        </div>
        <div
          style={{
            alignSelf: "stretch",
            color: "black",
            fontSize: 14,
            fontFamily: "Pretendard",
            fontWeight: 400,
            lineHeight: "17px",
            wordWrap: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
      </div>

      {/* 하단 레벨 표시 */}
      <div
        style={{
          alignSelf: "stretch",
          justifyContent: "flex-start",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <div
          style={{
            color: "black",
            fontSize: 15,
            fontFamily: "Pretendard",
            fontWeight: 500,
            wordWrap: "break-word",
          }}
        >
          {data.level} : {data.title}
        </div>

        <div style={{ flex: "1 1 0", height: 8 }} />
        <img src={arrow} alt="로고" style={{width:24}} />


      </div>
    </div>
  );
}
