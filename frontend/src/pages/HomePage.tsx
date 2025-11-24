import MainBtn from "../components/Button/MainBtn";
import { ENERGY_LEVELS } from "../types/EnergyLevel"; // 실제 값
import EnergySelectorBtn from "../components/Button/EnergySelectorBtn";

const HomePage = () => {
    return (
        <div>
            메인페이지

            <MainBtn>회원가입</MainBtn>

            {/* EnergySelectorBtn에 실제 데이터 넘기기 */}
            <EnergySelectorBtn data={ENERGY_LEVELS[0]} />
            <EnergySelectorBtn data={ENERGY_LEVELS[5]} />
            <EnergySelectorBtn data={ENERGY_LEVELS[10]} />
        </div>
    );
};

export default HomePage;

