import MainProfileSection from "../ccomponents/MainProfileSection";
import LetterSection from "../ccomponents/LeterSection";
import TodayEnergySection from "../ccomponents/TodayEnergySection";
import ActRecordSection from "../ccomponents/ActRecordSection";
import ConditionSection from "../ccomponents/ConditionSection";
import { useAuth } from "../hooks/useAuth";



const HomePage = () => {
    const { user } = useAuth();

    return (
        <div>
            <MainProfileSection
                name="레나"
                imageUrl="https://placehold.co/36x36"
            />

            <LetterSection
                date="25.11.16"
                title="오늘의 편지"
                content="안녕, 레나야! </br> 오늘 너한테 필요한 건 </br>거창한 변화가 아니라 ‘작은 회복’ 같아.</br> 따뜻한 물 한 잔 마시기로 시작해보는 건 어떨까?"
            />

            <TodayEnergySection
                dateTime={new Date().toLocaleString("ko-KR")} // "25.11.26 13:55:22" 같은 포맷
                message={`${user || "사용자"}야, 지금 너의 에너지는 어때?`}
            />

            <ActRecordSection />
            <ConditionSection />


        </div>
    );
};

export default HomePage;

