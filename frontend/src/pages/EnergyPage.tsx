import { useEffect, useState } from "react";
import ActivitySelectTab from "../components/Tab/ActivitySelectTab";
import ConditionListSection from "../ccomponents/ConditionListSection";
import type { ConditionListPayload, ConditionSection } from "../types/ConditionTypes";
import { fetchUserTagsRecorded, groupTagsByEnergyAndType } from "../api/energy";
import type { TagOut } from "../api/energy";

const EnergyPage = () => {
  const [payload, setPayload] = useState<ConditionListPayload>({
    description: "사용자 기록 태그",
    sections: [],
  });
  const [selectedTab, setSelectedTab] = useState<string>("전체");
  const [groupedTags, setGroupedTags] = useState<Record<number, { body: TagOut[]; mental: TagOut[] }>>({});

  // 1️⃣ 서버에서 태그 가져오기
  useEffect(() => {
    async function loadTags() {
      try {
        const res = await fetchUserTagsRecorded();

        console.log("fetchUserTagsRecorded의 결과",res);

        // optional 처리: energy_level 없으면 0, selected_count 없으면 0
        const normalizedTags = res.tags.map(tag => ({
          ...tag,
          energy_level: tag.energy_level ?? 0,
          selected_count: tag.selected_count ?? 0,
        }));

        const grouped = groupTagsByEnergyAndType(normalizedTags);
        console.log("grouped 의 결과",grouped);
        setGroupedTags(grouped);
      } catch (error) {
        console.error("태그 불러오기 실패:", error);
      }
    }
    loadTags();
  }, []);

  // 2️⃣ 선택된 탭이 바뀌면 payload 업데이트
  useEffect(() => {
    if (!groupedTags || Object.keys(groupedTags).length === 0) return;

    let bodyTags: TagOut[] = [];
    let mentalTags: TagOut[] = [];

    if (selectedTab === "전체") {
      // 모든 레벨 합치기
      bodyTags = Object.values(groupedTags).flatMap(g => g.body);
      mentalTags = Object.values(groupedTags).flatMap(g => g.mental);
    } else if (selectedTab.startsWith("에너지")) {
      const level = parseInt(selectedTab.replace("에너지", ""), 10);
      bodyTags = groupedTags[level]?.body ?? [];
      mentalTags = groupedTags[level]?.mental ?? [];
    }

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

    // 3️⃣ setState 비동기 처리
    setTimeout(() => {
      setPayload({ description: "사용자 기록 태그", sections });
    }, 0);
  }, [selectedTab, groupedTags]);

  return (
    <div>
      <ActivitySelectTab
        selectedTab={selectedTab}
        onChange={(tab) => setSelectedTab(tab)}
      />
      <ConditionListSection
        data={payload}
        onAddTag={(sectionIndex, tagLabel) => console.log("추가 클릭, 섹션:", sectionIndex, "태그:", tagLabel)}
      />
    </div>
  );
};

export default EnergyPage;
