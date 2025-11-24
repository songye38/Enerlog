
import ConditionListSection from "../ccomponents/ConditionListSection";
import type { ConditionListPayload } from "../types/ConditionTypes";
import MainInput from "../components/Input/MainInput";
import { useState } from "react";
import MainBtn from "../components/Button/MainBtn";
import GoToMainBtn from "../components/Button/GoToMainBtn";




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
const AddEnergyPage = () => {
    const [description, setDescription] = useState("");

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <GoToMainBtn />
            <div style={{ textAlign: 'center', color: 'black', fontSize: 18, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>나의 에너지 레벨 기록하기</div>
            <div>
                <ConditionListSection
                    data={payload}
                    onAddTag={(sectionIndex) => console.log("추가 클릭, 섹션:", sectionIndex)}
                    countVisible={false}
                    withBackground={false}
                />
                <MainInput label="지금 현재 나의 상태는?" value={description} onChange={setDescription} type="text" />
            </div>
            <MainBtn>기록 완료</MainBtn>
        </div>
    );
};

export default AddEnergyPage;
