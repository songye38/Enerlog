// components/List/ConditionItem.tsx
import { useState } from "react";
import Tag from "../Tag/Tag";
import AddTagBtn from "../Button/AddTagBtn";
import type { TagData } from "../../types/ConditionTypes";

interface ConditionItemProps {
  title: string;
  tags: TagData[];
  onAdd?: (tagLabel: string) => void; // 🔹 선택된 태그 전달
  countVisible?: boolean; // 횟수 표시 여부
  withBackground?: boolean; // 배경색 표시 여부
}

export default function ConditionItem({
  title,
  tags,
  onAdd,
  countVisible = true,
  withBackground = true,
}: ConditionItemProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // 🔹 선택된 태그 상태

  const handleTagClick = (label: string) => {
    setSelectedTags((prev) => {
      const isSelected = prev.includes(label);
      const newSelected = isSelected
        ? prev.filter((l) => l !== label) // 이미 선택되어 있으면 해제
        : [...prev, label]; // 선택
      onAdd?.(label); // 선택/해제 시 상위로 전달
      return newSelected;
    });
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, color: "black" }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map((tag, idx) => (
          <Tag
            key={idx}
            label={tag.label}
            count={countVisible ? tag.count : undefined}
            withBackground={withBackground}
            isSelected={selectedTags.includes(tag.label)} // 🔹 선택 여부 전달
            onClick={() => handleTagClick(tag.label)} // 🔹 클릭 이벤트
          />
        ))}

        <AddTagBtn onClick={() => onAdd?.("")} />
      </div>
    </div>
  );
}
