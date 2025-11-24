// components/ConditionListSection.tsx
import ConditionItem from "../components/List/ConditionItem"; // 기존 컴포넌트 재사용
import type { ConditionListPayload } from "../types/ConditionTypes";
import { COLORS } from "../types/Colors";

interface Props {
  data: ConditionListPayload;
  onAddTag?: (sectionIndex: number) => void;
}

export default function ConditionListSection({ data, onAddTag }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 ,backgroundColor:COLORS.primary[100],padding: "20px 16px",borderRadius:12,width:'100%'}}>
      {/* 전체 설명(위치: sections들을 총괄하는 설명) */}
      {data.description && (
        <div style={{ color: "black", fontSize: 15, lineHeight: "20px" }}>
          {data.description}
        </div>
      )}

      {/* 각 섹션 렌더링 */}
      {data.sections.map((section, idx) => (
        <ConditionItem
          key={idx}
          title={section.title}
          tags={section.tags}
          onAdd={() => onAddTag?.(idx)}
        />
      ))}
    </div>
  );
}
