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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EnergySelectorBtn from "../components/Button/EnergySelectorBtn";
import { ENERGY_LEVELS } from "../types/EnergyLevel"; 
import type { EnergyLevelInfo } from "../types/EnergyLevel";

function convertTagsToConditionSections(tags: TagOut[]): ConditionListPayload["sections"] {
    const mental = tags.filter(t => t.tag_type === "mental");
    const body = tags.filter(t => t.tag_type === "body");

    return [
        {
            title: "나의 신체상태는?",
            tags: body.map(t => ({ label: t.tag_title, count: 0, isSelected: false, originalTag: t })),
        },
        {
            title: "나의 마음상태는?",
            tags: mental.map(t => ({ label: t.tag_title, count: 0, isSelected: false, originalTag: t })),
        }
    ];
}

const RecordBehavePage = () => {
    const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevelInfo | null>();
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [sections, setSections] = useState<ConditionListPayload["sections"]>([]);
    const location = useLocation();
    const { behave_id, energy_level, title } = location.state as {
        behave_id: string;
        energy_level: EnergyLevel;
        title: string;
    };

    console.log("behave_id",behave_id)

    // 서버에서 태그 가져오기
    useEffect(() => {
        async function loadTags() {
            try {
                const res = await fetchUserTags(energy_level);
                const converted = convertTagsToConditionSections(res.tags);
                setSections(converted);
            } catch (e) {
                console.error("태그 불러오기 실패:", e);
            }
        }
        loadTags();
    }, [energy_level]);

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
        const selectedTags = sections.flatMap(section =>
            section.tags.filter(tag => tag.isSelected).map(tag => tag.originalTag)
        );

        const userTags = selectedTags
            .filter(tag => tag?.id?.startsWith("temp"))
            .map(tag => ({ title: tag!.tag_title, type: tag!.tag_type }));

        const presetTags = selectedTags
            .filter(tag => tag?.id && !tag.id.startsWith("temp"))
            .map(tag => ({ id: tag!.id, title: tag!.tag_title, type: tag!.tag_type }));

        const payload: BehaveCreatePayload = {
            before_energy: energy_level,
            before_description: description,
            status: "emotion_recorded",
            user_tags: userTags,
            preset_tags: presetTags,
        };

        try {
            const result = await createBehave(payload);
            navigate(`/record?energy_level=${energy_level}&behave_id=${result.id}`);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Behave 생성 실패(JSON):", JSON.stringify(err.response?.data, null, 2));
            } else {
                console.error("알 수 없는 에러:", err);
            }
        }
    };

    const handleAddTag = (sectionIndex: number, label: string) => {
        setSections(prev => {
            const newSections = [...prev];
            const section = newSections[sectionIndex];

            if (!section.tags.some(t => t.label === label)) {
                const tempId = `temp-${Date.now()}`;
                section.tags.push({
                    label,
                    count: 0,
                    isSelected: true,
                    originalTag: {
                        id: tempId,
                        tag_title: label,
                        tag_type: section.title.includes("신체") ? "body" : "mental"
                    },
                });
            } else {
                const tag = section.tags.find(t => t.label === label);
                if (tag) tag.isSelected = true;
            }

            return newSections;
        });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            width: '100vw',
            boxSizing: 'border-box',
            overflowX: 'hidden', // 페이지 전체 가로 스크롤 방지
        }}>
            <GoToMainBtn />
            <div style={{ textAlign: 'center', color: 'black', fontSize: 18, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>
                {title}
            </div>

            <div>
                <ConditionListSection
                    data={{ description: "", sections }}
                    onAddTag={handleAddTag}
                    onTagToggle={handleTagToggle}
                    countVisible={false}
                    withBackground={false}
                />

                <MainInput
                    label="지금 현재 나의 상태는?"
                    value={description}
                    onChange={setDescription}
                    type="text"
                />

                {/* 버튼 리스트: 가로 스크롤만 적용 */}
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 12,
                    overflowX: "auto",
                    width: "100vw",
                    boxSizing: "border-box",
                    padding: "12px 0",
                    scrollbarWidth: "none",
                }}>
                    {Object.values(ENERGY_LEVELS).map((level) => (
                        <div key={level.title} style={{ flex: "0 0 auto" }}>
                            <EnergySelectorBtn
                                data={level}
                                mode="select"
                                selected={selectedEnergy?.level === level.level}
                                onSelect={setSelectedEnergy}
                            />
                        </div>
                    ))}
                </div>

            </div>

            <MainBtn onClick={handleSubmit}>기록 완료</MainBtn>
        </div>
    );
};

export default RecordBehavePage;
