import { useEffect, useState } from "react";
import { fetchRecentPendingBehaves } from "../api/behave";
import ActRecordBtn from "../components/Button/ActRecordBtn";
import type { RecentPendingBehaveResponse } from "../api/behave";
import { useNavigate } from "react-router-dom";

export default function ActRecordSection() {
    const [activities, setActivities] = useState<RecentPendingBehaveResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [remainingTimes, setRemainingTimes] = useState<{ [key: string]: number }>({}); // ms 단위
    const navigate = useNavigate();

    const handleClick = (info: { behave_id: string; title: string; energy_level: number }) => {
        navigate("/recordb", { state: info });
    };


    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await fetchRecentPendingBehaves();
            setActivities(data);

            // 초기 남은 시간 계산
            const times: { [key: string]: number } = {};
            data.forEach((activity) => {
                const created = new Date(activity.created_at).getTime();
                const now = Date.now();
                const remaining = Math.max(0, 24 * 60 * 60 * 1000 - (now - created));
                times[activity.behave_id] = remaining;
            });
            setRemainingTimes(times);

            setLoading(false);
        }
        load();
    }, []);

    // 1초마다 남은 시간 업데이트
    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTimes((prev) => {
                const updated: { [key: string]: number } = {};
                Object.entries(prev).forEach(([key, ms]) => {
                    updated[key] = Math.max(0, ms - 1000);
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

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
                            energy_level: 0,
                            title: activity.title,
                            description: "",
                            count: 0,
                            durationMinutes: "0",
                        }}
                        serverTime={formatTime(remainingTimes[activity.behave_id] || 0)}
                        onClick={() => handleClick({
                            behave_id: activity.behave_id,
                            title: activity.title,
                            energy_level: activity.before_energy
                        })}
                    />
                ))}
            </div>
        </div>
    );
}
