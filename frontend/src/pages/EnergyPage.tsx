import ActivitySelectTab from "../components/Tab/ActivitySelectTab";
import ConditionListSection from "../ccomponents/ConditionListSection";
import type { ConditionListPayload } from "../types/ConditionTypes";

const payload: ConditionListPayload = {
    description: "극도의 피로감, 몸이 무겁고 움직이기조차 힘듦",
    sections: [
        {
            title: "나의 신체상태는?",
            tags: [
                { label: "움직일수없음", count: 12 },
                { label: "극도의피로", count: 8 },
                { label: "몸무거움", count: 6 },
            ],
        },
        {
            title: "나의 마음상태는?",
            tags: [
                { label: "무기력", count: 18 },
                { label: "불안", count: 15 },
                { label: "초조", count: 14 },
            ],
        },
    ],
};
const EnergyPage = () => {

    return (
        <div>
            <ActivitySelectTab
                onChange={(selected) => console.log("선택된 탭:", selected)}
            />
            <ConditionListSection
                data={payload}
                onAddTag={(sectionIndex) => console.log("추가 클릭, 섹션:", sectionIndex)}
            />
        </div>
    );
};

export default EnergyPage;
