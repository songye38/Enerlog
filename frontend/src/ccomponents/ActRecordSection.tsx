import { useEffect, useState } from "react";
import { fetchRecentPendingBehaves } from "../api/behave";
import ActRecordBtn from "../components/Button/ActRecordBtn";
import type { RecentPendingBehaveResponse } from "../api/behave";

export default function ActRecordSection() {
  const [activities, setActivities] = useState<RecentPendingBehaveResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchRecentPendingBehaves();
      setActivities(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (activities.length === 0) return <p>아직 기록할 행동이 없습니다.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 60 }}>
      <div style={{ color: 'black', fontSize: 15, fontFamily: 'Pretendard', fontWeight: 600, wordWrap: 'break-word' }}>
        아직 기록하지 않은 행동이 있어
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {activities.map((activity) => (
          <ActRecordBtn
            key={activity.behave_id}
            activity={{
              id: activity.activity_id || activity.activity_template_id || "unknown",
              energy_level: 0, // 필요하면 서버에서 전달받아 채워주기
              title: activity.title,
              description: "", // 필요하면 서버에서 description 포함
              count: 0, // 필요하면 서버에서 수행횟수 가져오기
              durationMinutes: "0", // 필요하면 서버에서 전달
            }}
            serverTime={new Date(activity.created_at).toLocaleTimeString()}
          />
        ))}
      </div>
    </div>
  );
}
