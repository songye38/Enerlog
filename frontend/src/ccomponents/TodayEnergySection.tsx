import { ENERGY_LEVELS } from "../types/EnergyLevel"; // Record<EnergyLevel, EnergyLevelInfo>
import EnergySelectorBtn from "../components/Button/EnergySelectorBtn";

interface TodayEnergySectionProps {
  dateTime: string;
  message: string;
}

export default function TodayEnergySection({ dateTime, message }: TodayEnergySectionProps) {
  return (
    <div style={{width:'390px'}}>
      {/* 제목 부분 */}
      <div
        style={{
          width: "100%",
          paddingTop: 20,
          paddingBottom: 12,
          paddingLeft: 12,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          display: "inline-flex",
          boxSizing: "border-box",
          marginTop: 24
        }}
      >
        {/* 날짜/시간 */}
        <div
          style={{
            color: "#455CC5",
            fontSize: 10,
            fontFamily: "WAGURI, sans-serif",
            fontWeight: 400,
            wordWrap: "break-word",
          }}
        >
          {dateTime}
        </div>

        {/* 메시지 */}
        <div
          style={{
            color: "#455CC5",
            fontSize: 20,
            fontFamily: "WAGURI, sans-serif",
            fontWeight: 400,
            lineHeight: "43px",
            wordWrap: "break-word",
          }}
        >
          {message}
        </div>
      </div>

      {/* 가로 스크롤 가능한 버튼 리스트 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 12,
          overflowX: "auto",
          padding: "12px",
          width: "100%",
          boxSizing: "border-box",
          scrollbarWidth: "none", // Firefox
        }}
      >
        {Object.values(ENERGY_LEVELS).map((level) => (
          <div key={level.title} style={{ flex: "0 0 auto" }}>
            <EnergySelectorBtn data={level} />
          </div>
        ))}
      </div>
    </div>
  );
}
