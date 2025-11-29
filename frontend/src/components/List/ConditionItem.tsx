// components/List/ConditionItem.tsx
import { useState, useEffect } from "react";
import Tag from "../Tag/Tag";
import AddTagBtn from "../Button/AddTagBtn";
import type { TagData } from "../../types/ConditionTypes";

interface ConditionItemProps {
  title: string;
  tags: TagData[];
  onAdd?: (tagLabel: string) => void; // 선택된 태그 전달
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
  const [addingTag, setAddingTag] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [localTags, setLocalTags] = useState<TagData[]>(tags);

  // props.tags가 바뀌면 localTags도 동기화
  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

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

  const handleAddNewTag = (label: string) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    // 이미 있는 태그면 중복 방지
    if (!localTags.some((t) => t.label === trimmedLabel)) {
      const newTag: TagData = { label: trimmedLabel, count: 0 };
      setLocalTags((prev) => [...prev, newTag]);
    }

    // 선택 상태에 추가
    setSelectedTags((prev) =>
      prev.includes(trimmedLabel) ? prev : [...prev, trimmedLabel]
    );

    onAdd?.(trimmedLabel);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        color: "black",
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {localTags.map((tag, idx) => (
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
          <input
            type="text"
            value={newTagLabel}
            onChange={(e) => setNewTagLabel(e.target.value)}
            onBlur={() => {
              handleAddNewTag(newTagLabel);
              setNewTagLabel("");
              setAddingTag(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddNewTag(newTagLabel);
                setNewTagLabel("");
                setAddingTag(false);
              }
            }}
            placeholder="태그 입력"
            autoFocus
            style={{
              padding: "4px 8px",
              borderRadius: 8,
              border: "1px solid #ccc",
              minWidth: 80,
            }}
          />
        ) : (
          <AddTagBtn onClick={() => setAddingTag(true)} />
        )}
      </div>
    </div>
  );
}
