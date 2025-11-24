// components/List/ConditionItem.tsx
import Tag from "../Tag/Tag";
import AddTagBtn from "../Button/AddTagBtn";
import type { TagData } from "../../types/ConditionTypes";

interface ConditionItemProps {
  title: string;
  tags: TagData[];
  onAdd?: () => void;
}

export default function ConditionItem({ title, tags, onAdd }: ConditionItemProps) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12,color:'black' }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map((t, i) => (
          <Tag key={i} label={t.label} count={t.count} />
        ))}

        <AddTagBtn onClick={onAdd} />
      </div>
    </div>
  );
}
