import { useState, useEffect } from "react";
import ActivityDisplaySection from "../ccomponents/ActivityDisplaySection";
import { fetchRecommendedActivities } from "../api/activity";
import type { ActivityTemplateOut } from "../api/activity";
import { useLocation } from "react-router-dom";
import MainBtn from "../components/Button/MainBtn";
import { useNavigate } from "react-router-dom";

const RecordPage = () => {
  const [activities, setActivities] = useState<ActivityTemplateOut[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const isSubmitDisabled = selectedId === null;

  const location = useLocation();
  const energyLevel = Number(
    new URLSearchParams(location.search).get("energy_level")
  );

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
    console.log("사용자가 선택한 활동 ID:", id);
    // 👉 이후 다음 페이지로 이동하거나 API 호출할 때 사용 가능
  };

  const handleSubmit = () => {
    //navigate('/')
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
          {/* {loading ? "저장 중..." : "저장하기"} */}
          저장하기
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
