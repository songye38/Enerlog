// import ConditionDetailBtn from "../components/Button/ConditionDetailBtn";


// export default function ConditionSection() {

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', marginTop: 60, }}>
//             <div style={{ color: 'black', fontSize: 15, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>최근 너의 컨디션을 간단히 정리해봤어.</div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
//                 <ConditionDetailBtn type="recentEnergy" value="Lv4" />
//                 <ConditionDetailBtn type="recoveryIndex" value="+1.2" />
//                 <ConditionDetailBtn type="actRage" value="76%" />

//             </div>
//         </div>

//     );
// }


import { useEffect, useState } from "react";
import ConditionDetailBtn from "../components/Button/ConditionDetailBtn";
import {
  fetchAverageEnergyLast3Days,
  fetchEnergyChangeLast3Days,
  fetchExecuteToRecordRatioLast3Days,
} from "../api/insights";

export default function ConditionSection() {
  const [averageEnergy, setAverageEnergy] = useState<number | null>(null);
  const [energyChange, setEnergyChange] = useState<number | null>(null);
  const [executeRatio, setExecuteRatio] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const avg = await fetchAverageEnergyLast3Days();
        setAverageEnergy(avg);

        const change = await fetchEnergyChangeLast3Days();
        setEnergyChange(change);

        const ratio = await fetchExecuteToRecordRatioLast3Days();
        setExecuteRatio(ratio);
      } catch (err) {
        console.error("컨디션 데이터 로딩 실패:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 60 }}>
      <div style={{ color: 'black', fontSize: 15, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>
        최근 너의 컨디션을 간단히 정리해봤어.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        <ConditionDetailBtn type="recentEnergy" value={averageEnergy !== null ? `Lv${averageEnergy}` : "-"} />
        <ConditionDetailBtn type="recoveryIndex" value={energyChange !== null ? `${energyChange >= 0 ? "+" : ""}${energyChange.toFixed(1)}` : "-"} />
        <ConditionDetailBtn type="actRage" value={executeRatio !== null ? `${(executeRatio * 100).toFixed(0)}%` : "-"} />
      </div>
    </div>
  );
}
