import { useState, useEffect } from "react";
import ConditionListSection from "../ccomponents/ConditionListSection";
import MainInput from "../components/Input/MainInput";
import MainBtn from "../components/Button/MainBtn";
import GoToMainBtn from "../components/Button/GoToMainBtn";
import type { ConditionListPayload } from "../types/ConditionTypes";
import { fetchUserTags } from "../api/energy";
import type { TagOut } from "../api/energy";
import type { EnergyLevel } from "../types/EnergyLevel";
import { useLocation } from "react-router-dom";

function convertTagsToConditionSections(tags: TagOut[]): ConditionListPayload["sections"] {
    const mental = tags.filter(t => t.type === "mental");
    const body = tags.filter(t => t.type === "body");

    return [
        {
            title: "나의 신체상태는?",
            tags: body.map(t => ({ label: t.title, count: 0 })),
        },
        {
            title: "나의 마음상태는?",
            tags: mental.map(t => ({ label: t.title, count: 0 })),
        }
    ];
}

const AddEnergyPage = () => {
    const [description, setDescription] = useState("");
    const [sections, setSections] = useState<ConditionListPayload["sections"]>([]);

    const location = useLocation();
    const energyLevel = Number(
        new URLSearchParams(location.search).get("energy_level")
    ) as EnergyLevel;

    // ⭐ 여기에 에너지 레벨을 props나 상위에서 받아오게 바꿀 예정

    useEffect(() => {
        async function loadTags() {
            try {
                const res = await fetchUserTags(energyLevel);
                const converted = convertTagsToConditionSections(res.tags);

                setSections(converted);
            } catch (e) {
                console.error("태그 불러오기 실패:", e);
            }
        }
        loadTags();
    }, [energyLevel]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <GoToMainBtn />
            <div style={{ textAlign: 'center', color: 'black', fontSize: 18, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>
                나의 에너지 레벨 기록하기
            </div>

            <div>
                <ConditionListSection
                    data={{ description: "", sections }}
                    onAddTag={(sectionIndex) =>
                        console.log("추가 클릭, 섹션:", sectionIndex)
                    }
                    countVisible={false}
                    withBackground={false}
                />

                <MainInput
                    label="지금 현재 나의 상태는?"
                    value={description}
                    onChange={setDescription}
                    type="text"
                />
            </div>

            <MainBtn>기록 완료</MainBtn>
        </div>
    );
};

export default AddEnergyPage;
