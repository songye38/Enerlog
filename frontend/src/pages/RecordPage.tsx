import { useState, useEffect } from "react";
import ActivityDisplaySection from "../ccomponents/ActivityDisplaySection";
import { fetchRecommendedActivities } from "../api/activity";
import type { ActivityTemplateOut } from "../api/activity";
import { useLocation } from "react-router-dom";

const RecordPage = () => {
  const [activities, setActivities] = useState<ActivityTemplateOut[]>([]);
  const [_selectedId, setSelectedId] = useState<string | null>(null);

  const location = useLocation();
  const energyLevel = Number(
    new URLSearchParams(location.search).get("energy_level")
  );

  useEffect(() => {
    async function load() {
      const res = await fetchRecommendedActivities(energyLevel);
      setActivities(res);
    }
    load();
  }, [energyLevel]);

  const handleSelected = (id: string) => {
    setSelectedId(id);
    console.log("사용자가 선택한 활동 ID:", id);
    // 👉 이후 다음 페이지로 이동하거나 API 호출할 때 사용 가능
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      {activities.map((a) => (
        <ActivityDisplaySection
          key={a.id}
          activity={a}
          onSelected={handleSelected}
        />
      ))}
    </div>
  );
};

export default RecordPage;
