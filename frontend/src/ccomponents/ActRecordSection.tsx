import type { ActivityFeed } from "../types/ActivityFeed";
import ActRecordBtn from "../components/Button/ActRecordBtn";
export default function ActRecordSection() {

    const activity: ActivityFeed = {
        id:'1',
        level: 3,
        isHearted: false,
        title: "가벼운 산책",
        description: "짧은 산책으로 기분 전환",
        tags: ["걷기", "운동"],
        count: 0,
        durationMinutes: "20분"
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 60,}}>
            <div style={{ color: 'black', fontSize: 15, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>아직 기록하지 않은 행동이 있어</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                <ActRecordBtn activity={activity} serverTime="10:08:08" />
                <ActRecordBtn activity={activity} serverTime="10:08:08" />

            </div>
        </div>

    );
}
