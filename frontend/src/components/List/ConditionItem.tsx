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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [addingTag, setAddingTag] = useState(false); // 🔹 입력 모드 상태
  const [newTagLabel, setNewTagLabel] = useState(""); // 🔹 새 태그 값

  const handleTagClick = (label: string) => {
    setSelectedTags((prev) => {
      const isSelected = prev.includes(label);
      const newSelected = isSelected
        ? prev.filter((l) => l !== label)
        : [...prev, label];
      onAdd?.(label); // 선택/해제 시 상위 전달
      return newSelected;
    });
  };

  const handleAddTagConfirm = () => {
    if (newTagLabel.trim()) {
      onAdd?.(newTagLabel.trim()); // 상위로 새 태그 전달
      setSelectedTags((prev) => [...prev, newTagLabel.trim()]); // 선택 상태에도 추가
      setNewTagLabel("");
      setAddingTag(false);
    }
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
            isSelected={selectedTags.includes(tag.label)}
            onClick={() => handleTagClick(tag.label)}
          />
        ))}

        {addingTag ? (
          <div style={{ display: "flex", gap: 4 }}>
            <input
              type="text"
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
              placeholder="태그 입력"
              style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid #ccc" }}
            />
            <button onClick={handleAddTagConfirm}>추가</button>
            <button onClick={() => setAddingTag(false)}>취소</button>
          </div>
        ) : (
          <AddTagBtn onClick={() => setAddingTag(true)} />
        )}
      </div>
    </div>
  );
}
