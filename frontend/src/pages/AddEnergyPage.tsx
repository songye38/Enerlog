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
            tags: body.map(t => ({ label: t.title, count: 0, isSelected: false, originalTag: t })),
        },
        {
            title: "나의 마음상태는?",
            tags: mental.map(t => ({ label: t.title, count: 0, isSelected: false, originalTag: t })),
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

    // 서버에서 태그 가져오기
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

    // 태그 선택 토글
    const handleTagToggle = (sectionIndex: number, tagIndex: number) => {
        setSections(prev => {
            const newSections = [...prev];
            newSections[sectionIndex] = {
                ...newSections[sectionIndex],
                tags: [...newSections[sectionIndex].tags],
            };
            const tag = newSections[sectionIndex].tags[tagIndex];
            tag.isSelected = !tag.isSelected;
            return newSections;
        });
    };

    // 기록 완료 클릭
    const handleSubmit = () => {
        const selectedTags = sections.flatMap(section =>
            section.tags.filter(tag => tag.isSelected).map(tag => tag.originalTag)
        );
        console.log("선택된 태그들:", selectedTags);
        console.log("설명:", description);

        // 여기서 서버로 POST 요청 가능
        // 예: saveEnergyRecord({ energyLevel, description, tags: selectedTags })
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <GoToMainBtn />
            <div style={{ textAlign: 'center', color: 'black', fontSize: 18, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>
                나의 에너지 레벨 기록하기
            </div>

            <div>
                <ConditionListSection
                    data={{ description: "", sections }}
                    onTagToggle={handleTagToggle} // 🔹 토글 핸들러
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

            <MainBtn onClick={handleSubmit}>기록 완료</MainBtn>
        </div>
    );
};

export default AddEnergyPage;
