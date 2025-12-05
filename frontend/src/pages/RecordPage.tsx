import { useState, useEffect } from "react";
import ActivityDisplaySection from "../ccomponents/ActivityDisplaySection";
import { fetchRecommendedActivities } from "../api/activity";
import type { ActivityTemplateOut } from "../api/activity";
import { useLocation } from "react-router-dom";
import MainBtn from "../components/Button/MainBtn";
import { useNavigate } from "react-router-dom";
import { updateBehaveWithActivity } from "../api/behave";

const RecordPage = () => {
  const [activities, setActivities] = useState<ActivityTemplateOut[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityTemplateOut | null>(null);
  const navigate = useNavigate();
  const isSubmitDisabled = selectedId === null;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const energyLevel = Number(params.get("energy_level"));
  const behaveId = params.get("behave_id");  // 🔥 바로 이거

  useEffect(() => {
    async function load() {
      const res = await fetchRecommendedActivities(energyLevel);
      console.log("서버에서 받아온 활동들 ", res);
      setActivities(res);
    }
    load();
  }, [energyLevel]);

  const handleSelected = (id: string) => {
    setSelectedId(id);
    const item = activities.find(a => a.id === id) || null;
    setSelectedActivity(item);
  };

  const handleSubmit = async () => {
    if (!selectedActivity || !behaveId) return;

    try {
      await updateBehaveWithActivity(behaveId, {
        id: selectedActivity.id,
        type: selectedActivity.type  // 이제 문제 없음
      });
      navigate(`/next-page`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToMain = () => {
    navigate('/')
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {activities.map((a) => (
          <ActivityDisplaySection
            key={a.id}
            activity={a}
            onSelected={handleSelected}
            selected={selectedId === a.id} // 🔥 선택된 카드만 border 적용
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* 저장하기 버튼 */}
        <MainBtn onClick={handleSubmit} disabled={isSubmitDisabled}>
          {selectedActivity ? `${selectedActivity.title} 해볼래` : "해볼래"}
        </MainBtn>
        {/* 오늘은 건너뛰기 버튼 */}
        <MainBtn variant="secondary" onClick={handleToMain}>
          오늘은 쉴래
        </MainBtn>
      </div>
    </div>
  );
};

export default RecordPage;
