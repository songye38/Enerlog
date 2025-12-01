


import type { ConditionListPayload } from "../types/ConditionTypes";
import { COLORS } from "../types/Colors";
import ConditionItem from "../components/List/ConditionItem";


interface Props {
  data: ConditionListPayload;
  onAddTag?: (sectionIndex: number, tagLabel: string) => void; // 🔹 tagLabel 추가
  onTagToggle?: (sectionIndex: number, tagIndex: number) => void; // 🔹 추가
  countVisible?: boolean;
  withBackground?: boolean;
}

export default function ConditionListSection({ data, onAddTag, countVisible = true, withBackground = true }: Props) {
  console.log("서버에서 보내는 사용자가 선택한 태그 모음",data);
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 36,
      backgroundColor: withBackground ? COLORS.primary[100] : "transparent",
      padding: "20px 16px",
      borderRadius: 12,
      width: '100%'
    }}>
      {withBackground && data.description && (
        <div style={{ color: "black", fontSize: 15, lineHeight: "20px" }}>
          {data.description}
        </div>
      )}

      {data.sections.map((section, idx) => (
        <ConditionItem
          key={idx}
          title={section.title}
          tags={section.tags}
          onAdd={(tagLabel: string) => onAddTag?.(idx, tagLabel)} // 🔹 선택한 태그 전달
          countVisible={countVisible}
          withBackground={withBackground}
        />
      ))}
    </div>
  );
}
