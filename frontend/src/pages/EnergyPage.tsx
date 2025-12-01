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

  useEffect(() => {
    async function loadTags() {
      try {
        const res = await fetchUserTagsRecorded();
        const grouped = groupTagsByEnergyAndType(res.tags);
        setGroupedTags(grouped);
      } catch (error) {
        console.error("태그 불러오기 실패:", error);
      }
    }
    loadTags();
  }, []);

  // 탭 변경 시 payload 업데이트
  useEffect(() => {
  if (!groupedTags) return;

  const updatePayload = () => {
    let level: number | null = null;
    if (selectedTab.startsWith("에너지")) {
      level = parseInt(selectedTab.replace("에너지", ""), 10);
    }

    let bodyTags: TagOut[] = [];
    let mentalTags: TagOut[] = [];

    if (level && groupedTags[level]) {
      bodyTags = groupedTags[level].body;
      mentalTags = groupedTags[level].mental;
    } else {
      // "전체" 선택 시 모든 레벨 합치기
      bodyTags = Object.values(groupedTags).flatMap(g => g.body);
      mentalTags = Object.values(groupedTags).flatMap(g => g.mental);
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

    setPayload({ description: "사용자 기록 태그", sections });
  };

  // 비동기로 감싸서 동기 호출 문제 방지
  const id = setTimeout(updatePayload, 0);
  return () => clearTimeout(id); // cleanup
}, [selectedTab, groupedTags]);


  return (
    <div>
      <ActivitySelectTab
        selectedTab={selectedTab}
        onChange={(tab) => setSelectedTab(tab)}
      />
      <ConditionListSection
        data={payload}
        onAddTag={(sectionIndex) => console.log("추가 클릭, 섹션:", sectionIndex)}
      />
    </div>
  );
};

export default EnergyPage;
