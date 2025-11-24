// components/List/ConditionItem.tsx
import Tag from "../Tag/Tag";
import AddTagBtn from "../Button/AddTagBtn";
import type { TagData } from "../../types/ConditionTypes";

interface ConditionItemProps {
  title: string;
  tags: TagData[];
  onAdd?: () => void;
  countVisible?: boolean; // 🔹 add!
  withBackground?: boolean; // 🔹 배경색 표시 여부
}

export default function ConditionItem({ title, tags, onAdd,countVisible = true,withBackground=true }: ConditionItemProps) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12,color:'black' }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map((tag, idx) => (
          <Tag key={idx} label={tag.label} count={countVisible ? tag.count : undefined} withBackground={withBackground} />
        ))}

        <AddTagBtn onClick={onAdd} />
      </div>
    </div>
  );
}
