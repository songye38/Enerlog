
import MainInput from "../components/Input/MainInput";
import { useState } from "react";

type MakeMyActivitySectionProps = {
  onDoNow?: () => void;
  onDoLater?: () => void;

};


export default function MakeMyActivitySection({
  onDoNow,
  onDoLater,
}: MakeMyActivitySectionProps) {
    const [description, setDescription] = useState("");
    const [goodPoint, setGoodPoint] = useState("");
    const [duration, setDuration] = useState("");

  return (
    <div style={{ width: 390, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 36, display: 'inline-flex' }}>
      {/* 제목 */}
      <div style={{ alignSelf: 'stretch', textAlign: 'center' }}>
        <span style={{ color: 'black', fontSize: 16, fontFamily: 'Pretendard', fontWeight: 600, lineHeight: '26px' }}>
          내가 만드는 활동<br/><br/>
        </span>
        <span style={{ color: 'black', fontSize: 18, fontFamily: 'Pretendard', fontWeight: 600, lineHeight: '26px' }}>
          제목
        </span>
      </div>

      {/* 세부 정보 */}
      <MainInput label="설명" value={description} onChange={setDescription} type="text" />
      <MainInput label="좋은점" value={goodPoint} onChange={setGoodPoint} type="text" />
      <MainInput label="소요시간" value={duration} onChange={setDuration} type="text" />


      {/* 버튼 */}
      <div style={{ width: 390, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 20, display: 'flex' }}>
        <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 12, display: 'flex' }}>
          <div onClick={onDoNow} style={{ alignSelf: 'stretch', padding: 20, background: '#455CC5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
            <div style={{ color: 'white', fontSize: 18, fontFamily: 'Pretendard', fontWeight: 600 }}>지금 바로 해볼래</div>
          </div>
          <div onClick={onDoLater} style={{ alignSelf: 'stretch', padding: 20, background: '#455CC5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
            <div style={{ color: 'white', fontSize: 18, fontFamily: 'Pretendard', fontWeight: 600 }}>나중에 해볼래</div>
          </div>
        </div>

      </div>
    </div>
  );
}
