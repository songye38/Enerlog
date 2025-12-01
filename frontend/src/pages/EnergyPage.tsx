import { useEffect, useState, useMemo } from "react";
import ActivitySelectTab from "../components/Tab/ActivitySelectTab";
import ConditionListSection from "../ccomponents/ConditionListSection";
import type { ConditionListPayload, ConditionSection } from "../types/ConditionTypes";
import { fetchUserTagsRecorded, groupTagsByEnergyAndType } from "../api/energy";
import type { UserTagOut } from "../api/energy";

const EnergyPage = () => {
    const [selectedTab, setSelectedTab] = useState<string>("전체");
    const [groupedTags, setGroupedTags] = useState<Record<number, { body: UserTagOut[]; mental: UserTagOut[] }>>({});

    // 1️⃣ 서버에서 태그 가져오기
    useEffect(() => {
        async function loadTags() {
            try {
                const res = await fetchUserTagsRecorded();
                console.log("fetchUserTagsRecorded 결과:", res);

                const grouped = groupTagsByEnergyAndType(res.tags);
                console.log("grouped 결과:", grouped);
                setGroupedTags(grouped);
            } catch (error) {
                console.error("태그 불러오기 실패:", error);
            }
        }

        loadTags();
    }, []);

    // 2️⃣ 선택된 탭 기반 payload 계산
    const memoizedPayload: ConditionListPayload = useMemo(() => {
        if (!groupedTags || Object.keys(groupedTags).length === 0) {
            return { description: "사용자 기록 태그", sections: [] };
        }

        const level = selectedTab.startsWith("에너지")
            ? parseInt(selectedTab.replace("에너지", ""), 10)
            : null;

        const bodyTags: UserTagOut[] = level !== null
            ? groupedTags[level]?.body ?? []
            : Object.values(groupedTags).flatMap(g => g.body);

        const mentalTags: UserTagOut[] = level !== null
            ? groupedTags[level]?.mental ?? []
            : Object.values(groupedTags).flatMap(g => g.mental);

        const sections: ConditionSection[] = [
            {
                title: "나의 신체상태는?",
                tags: bodyTags.map(tag => ({ label: tag.title, count: tag.selected_count })),
            },
            {
                title: "나의 마음상태는?",
                tags: mentalTags.map(tag => ({ label: tag.title, count: tag.selected_count })),
            },
        ];

        return { description: "사용자 기록 태그", sections };
    }, [selectedTab, groupedTags]);

    return (
        <div>
            <ActivitySelectTab
                selectedTab={selectedTab}
                onChange={setSelectedTab}
            />
            <ConditionListSection
                data={memoizedPayload}
                onAddTag={(sectionIndex, tagLabel) => console.log("추가 클릭, 섹션:", sectionIndex, "태그:", tagLabel)}
            />
        </div>
    );
};

export default EnergyPage;
