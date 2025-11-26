import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import ActivitySelectTab from "../components/Tab/ActivitySelectTab";
import ActivityTab from "../components/Tab/ActivityTab";
import ActivitySection from "../ccomponents/ActivitySection";
import MakeMyActivitySectionS from "../ccomponents/MakeMyActivitySectionS";
import { fetchActivityTemplates, fetchUserActivites } from "../api/activity";
import type { ActivityFeed } from "../types/ActivityFeed";
import { ClipLoader } from "react-spinners";

const loaderStyle: CSSProperties = {
    display: "block",
    margin: "0 auto",
};

const ActivityPage = () => {
    const [activities, setActivities] = useState<ActivityFeed[]>([]);
    const [userActivities, setUserActivities] = useState<ActivityFeed[]>([]);
    const [loading, setLoading] = useState(true);

    // 1️⃣ 첫 번째 필터: 추천 활동 vs 내가 만든 활동
    const [selectedMainTab, setSelectedMainTab] = useState<"추천 활동" | "내가 만든 활동">("추천 활동");
    // 2️⃣ 두 번째 필터: 에너지 레벨, 전체, 좋아요
    const [selectedFilterTab, setSelectedFilterTab] = useState<string>("전체");

    useEffect(() => {
        const loadActivities = async () => {
            setLoading(true);
            try {
                const templates = await fetchActivityTemplates();
                const mapped: ActivityFeed[] = templates.map((tpl) => ({
                    level: tpl.energy_level,
                    isHearted: false,
                    title: tpl.title,
                    description: tpl.description || "",
                    tags: [],
                    count: 0,
                    durationMinutes: tpl.duration_minutes || "",
                }));
                setActivities(mapped);
            } catch (err) {
                console.error("추천 활동 불러오기 실패:", err);
            }
        };

        const loadUserActivities = async () => {
            try {
                const templates = await fetchUserActivites();
                const mapped: ActivityFeed[] = templates.map((tpl) => ({
                    level: tpl.energy_level,
                    isHearted: false,
                    title: tpl.title,
                    description: tpl.description || "",
                    tags: [],
                    count: 0,
                    durationMinutes: tpl.duration_minutes || "",
                }));
                
                setUserActivities(mapped);
            } catch (err) {
                console.error("내 활동 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
        loadUserActivities();
        console.log("전체 활동 목록",activities)
        console.log("사용자 전체 활동 목록",userActivities)
    }, []);

    // 1️⃣ 첫 번째 필터 적용
    const baseActivities = selectedMainTab === "추천 활동" ? activities : userActivities;

    // 2️⃣ 두 번째 필터 적용
    const displayedActivities =
        selectedFilterTab === "전체"
            ? baseActivities
            : selectedFilterTab.startsWith("에너지")
                ? baseActivities.filter(a => a.level === Number(selectedFilterTab.slice(2)))
                : baseActivities;

    return (
        <div>
            <ActivityTab
                myActivitiesCount={userActivities.length}
                onChange={(tab) => setSelectedMainTab(tab as "추천 활동" | "내가 만든 활동")}
            />

            <ActivitySelectTab onChange={setSelectedFilterTab} />

            {selectedMainTab === "내가 만든 활동" && <MakeMyActivitySectionS />}

            <div style={{ marginTop: 24 }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <ClipLoader color="#455CC5" loading={loading} size={40} cssOverride={loaderStyle} />
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {displayedActivities.map((activity, index) => (
                            <ActivitySection key={index} activity={activity} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityPage;
