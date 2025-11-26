import ActivitySelectTab from "../components/Tab/ActivitySelectTab";
import ActivityTab from "../components/Tab/ActivityTab";
import ActivitySection from "../ccomponents/ActivitySection";
import type { ActivityFeed } from "../types/ActivityFeed";
import { fetchActivityTemplates } from "../api/activity";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import type { CSSProperties } from "react";


const loaderStyle: CSSProperties = {
    display: "block",
    margin: "0 auto",
};


const ActivityPage = () => {

    const [activities, setActivities] = useState<ActivityFeed[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadActivities = async () => {
            try {
                const templates = await fetchActivityTemplates(); // 여기서 서버 API 호출
                const mapped: ActivityFeed[] = templates.map((tpl) => ({
                    level: tpl.energy_level,       // 0~10 숫자 그대로
                    isHearted: false,              // 기본값
                    title: tpl.title,
                    description: tpl.description || "",
                    tags: [],                       // 나중에 태그 연결 가능
                    count: 0,                       // 기본값
                    durationMinutes: tpl.duration_minutes || 0,
                }));
                setActivities(mapped);
            } catch (err) {
                console.error("템플릿 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
    }, []);


    return (
        <div>
            <ActivitySelectTab
                onChange={(selected) => console.log("선택된 탭:", selected)}
            />
            <ActivityTab myActivitiesCount={5} />
            <div style={{ marginTop: 24,display:'flex',flexDirection:'column',gap:12 }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <ClipLoader color="#455CC5" loading={loading} size={40} cssOverride={loaderStyle} />
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <ActivitySection key={index} activity={activity} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityPage;
