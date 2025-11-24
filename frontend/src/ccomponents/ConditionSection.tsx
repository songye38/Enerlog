import ConditionDetailBtn from "../components/Button/ConditionDetailBtn";


export default function ConditionSection() {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 60, }}>
            <div style={{ color: 'black', fontSize: 15, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>최근 너의 컨디션을 간단히 정리해봤어.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                <ConditionDetailBtn type="recentEnergy" value="Lv4" />
                <ConditionDetailBtn type="recoveryIndex" value="+1.2" />
                <ConditionDetailBtn type="actRage" value="76%" />

            </div>
        </div>

    );
}
