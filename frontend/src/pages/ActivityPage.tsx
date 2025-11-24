import ActivitySelectTab from "../components/Tab/ActivitySelectTab";
import ActivityTab from "../components/Tab/ActivityTab";
import ActivitySection from "../ccomponents/ActivitySection";
import type { ActivityFeed, EnergyLevel } from "../types/ActivityFeed";


const ActivityPage = () => {

    const activities: ActivityFeed[] = [
        {
            level: 4 as EnergyLevel,
            isHearted: true,
            title: "내가 제일 좋아하는 자전거길 걷기",
            description: "주변의 시각적·청각적 자극을 최소화하여\n마음과 몸이 안정될 수 있는 환경을 만드는 활동입니다.",
            tags: ["편안함", "스트레스완화", "마음안정"],
            count: 4,
            durationMinutes: 30,
        },
        {
            level: 2 as EnergyLevel,
            isHearted: false,
            title: "짧은 명상하기",
            description: "잠시 눈을 감고 심호흡을 하며 마음을 정리하는 활동입니다.",
            tags: ["집중", "마음안정"],
            count: 3,
            durationMinutes: 10,
        },
    ];

    return (
        <div>
            <ActivitySelectTab
                onChange={(selected) => console.log("선택된 탭:", selected)}
            />
            <ActivityTab myActivitiesCount={5} />
            <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {activities.map((activity, index) => (
                        <ActivitySection key={index} activity={activity} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;
