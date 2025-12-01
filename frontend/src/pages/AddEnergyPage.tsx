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
import { createBehave } from "../api/behave";
import type { BehaveCreatePayload } from "../api/behave";
//import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
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


    const handleSubmit = async () => {
        // 선택된 태그들
        const selectedTags = sections.flatMap(section =>
            section.tags.filter(tag => tag.isSelected).map(tag => tag.originalTag)
        );

        // user_tags / preset_tags 분리
        const userTags = selectedTags
            .filter(tag => tag?.id?.startsWith("temp"))
            .map(tag => ({ title: tag!.title, type: tag!.type }));

        const presetTags = selectedTags
            .filter(tag => tag?.id && !tag.id.startsWith("temp"))
            .map(tag => ({ id: tag!.id, title: tag!.title, type: tag!.type }));

        // payload 구성
        const payload: BehaveCreatePayload = {
            before_energy: energyLevel, // 숫자 그대로
            before_description: description,
            status: "emotion_recorded",
            user_tags: userTags,
            preset_tags: presetTags,
        };

        try {
            const result = await createBehave(payload);
            console.log("Behave 생성 완료:", result);
            navigate(`/record?energy_level=${energyLevel}`);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Behave 생성 실패(JSON):", JSON.stringify(err.response?.data, null, 2));
            } else {
                console.error("알 수 없는 에러:", err);
            }
        }
    };



    // AddEnergyPage.tsx
    const handleAddTag = (sectionIndex: number, label: string) => {
        setSections(prev => {
            const newSections = [...prev];
            const section = newSections[sectionIndex];

            // 중복 방지
            if (!section.tags.some(t => t.label === label)) {
                const tempId = `temp-${Date.now()}`;

                section.tags.push({
                    label,
                    count: 0,
                    isSelected: true,
                    originalTag: {
                        id: tempId, // string 타입 맞춤
                        title: label,
                        type: section.title.includes("신체") ? "body" : "mental"
                    },
                });
            } else {
                // 이미 있는 태그면 선택 상태만 체크
                const tag = section.tags.find(t => t.label === label);
                if (tag) tag.isSelected = true;
            }

            return newSections;
        });
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
                    onAddTag={handleAddTag} // 🔹 새 태그 추가 콜백
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
