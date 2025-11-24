import MainBtn from "../components/Button/MainBtn";
import { ENERGY_LEVELS } from "../types/EnergyLevel"; // 실제 값
import EnergySelectorBtn from "../components/Button/EnergySelectorBtn";
import type { ActivityFeed } from "../types/ActivityFeed";
import ActRecordBtn from "../components/Button/ActRecordBtn";
import { useNavigate } from 'react-router-dom';
import SecondaryBtn from "../components/Button/SecondaryBtn";

const HomePage = () => {

    const navigate = useNavigate();

    const activity: ActivityFeed = {
        level: 3,
        isHearted: false,
        title: "가벼운 산책",
        description: "짧은 산책으로 기분 전환",
        tags: ["걷기", "운동"],
        count: 0,
        durationMinutes: 20
    };
    return (
        <div>
            메인페이지

            <MainBtn>회원가입</MainBtn>

            {/* EnergySelectorBtn에 실제 데이터 넘기기 */}
            <EnergySelectorBtn data={ENERGY_LEVELS[0]} />
            <EnergySelectorBtn data={ENERGY_LEVELS[5]} />
            <EnergySelectorBtn data={ENERGY_LEVELS[10]} />

            <ActRecordBtn activity={activity} serverTime="10:08:08" />

            <div style={{ display: 'flex', gap: 16 }}>
                {/* 나의 에너지 레벨 페이지로 이동 */}
                <SecondaryBtn
                    label="나의 에너지 레벨"
                    onClick={() => navigate('/energy')}
                />

                {/* 나를 채우는 활동 페이지로 이동 */}
                <SecondaryBtn
                    label="나를 채우는 활동"
                    onClick={() => navigate('/acts')}
                />
            </div>
        </div>
    );
};

export default HomePage;

