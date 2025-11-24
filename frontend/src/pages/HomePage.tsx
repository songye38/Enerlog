import MainBtn from "../components/Button/MainBtn";
import type { ActivityFeed } from "../types/ActivityFeed";
import ActRecordBtn from "../components/Button/ActRecordBtn";
import MainProfileSection from "../ccomponents/MainProfileSection";
import LetterSection from "../ccomponents/LeterSection";
import TodayEnergySection from "../ccomponents/TodayEnergySection";


const HomePage = () => {

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
            <MainProfileSection
                name="레나"
                imageUrl="https://placehold.co/36x36"
            />

            <LetterSection
                date="25.11.16"
                title="오늘의 편지"
                content="안녕, 레나야! 오늘 너한테 필요한 건 거창한 변화가 아니라 ‘작은 회복’ 같아. 따뜻한 물 한 잔 마시기로 시작해보는 건 어떨까?"
            />

            <TodayEnergySection
                dateTime="25.11.20 20:47:20"
                message="레나야, 지금 너의 에너지는 어때?"
            />

            <ActRecordBtn activity={activity} serverTime="10:08:08" />

            <MainBtn>회원가입</MainBtn>
        </div>
    );
};

export default HomePage;

