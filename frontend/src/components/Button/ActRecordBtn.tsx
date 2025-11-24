import type { ActivityFeed } from "../../types/ActivityFeed";

type ActRecordBtnProps = {
  activity: ActivityFeed;
  serverTime: string; // 서버에서 받은 시간, 예: "10:08:08"
  onClick?: () => void;
};

export default function ActRecordBtn({ activity, serverTime, onClick }: ActRecordBtnProps) {
  const description = "행동에 대한 기록 남기기";

  return (
    <div
      style={{
        width: 390,
        background: '#D2D8F1',
        borderRadius: 12,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 6,
        display: 'inline-flex',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      {/* 서버 시간 표시 */}
      <div
        style={{
          padding: '8px 12px',
          background: '#FFF34F',
          borderTopLeftRadius: 12,
          borderBottomRightRadius: 8,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 6,
          display: 'inline-flex'
        }}
      >
        <div
          style={{
            color: 'black',
            fontSize: 14,
            fontFamily: 'Pretendard, sans-serif',
            fontWeight: 600,
            wordWrap: 'break-word'
          }}
        >
          기록 가능 시간 {serverTime}
        </div>
      </div>

      {/* 활동 버튼 + 설명 */}
      <div
        style={{
          padding: '8px 12px 14px 12px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
          display: 'inline-flex'
        }}
      >
        <div
          style={{
            padding: '6px 8px',
            background: '#455CC5',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            display: 'flex'
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 17,
              fontFamily: 'Pretendard, sans-serif',
              fontWeight: 500,
              wordWrap: 'break-word'
            }}
          >
            {activity.title} {/* ActivityFeed.title */}
          </div>
        </div>
        <div
          style={{
            color: 'black',
            fontSize: 17,
            fontFamily: 'Pretendard, sans-serif',
            fontWeight: 500,
            wordWrap: 'break-word'
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}
