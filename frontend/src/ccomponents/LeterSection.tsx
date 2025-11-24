import { useNavigate } from "react-router-dom";
import SecondaryBtn from "../components/Button/SecondaryBtn";


interface LetterSectionProps {
    date: string;         // ex: "25.11.16"
    title: string;        // ex: "오늘의 편지"
    content: string;      // 편지 내용

}

export default function LetterSection({
    date,
    title,
    content,
}: LetterSectionProps) {

    const navigate = useNavigate();
    return (
        <div
            style={{
                width: 390,
                paddingTop: 20,
                paddingBottom: 12,
                paddingLeft: 16,
                paddingRight: 16,
                background: "#ECEFF9",
                borderRadius: 16,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 20,
                display: "inline-flex",
                
            }}
        >
            {/* 편지 제목 + 내용 */}
            <div
                style={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 6,
                    display: "flex",
                }}
            >
                <div
                    style={{
                        color: "#3B4EA7",
                        fontSize: 14,
                        fontFamily: "Pretendard, sans-serif",
                        fontWeight: 600,
                        lineHeight: '27px',
                        wordWrap: "break-word",
                    }}
                >
                    💌 {date} {title}
                </div>
                <div
                    style={{
                        width: 'auto',
                        textAlign: "center",
                        color: "#31418C",
                        fontSize: 21,
                        fontFamily: "IncheonEducation, sans-serif",
                        fontWeight: 600,
                        lineHeight: '23px',
                        wordWrap: "break-word",
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>

            {/* 버튼 영역 */}
            <div
                style={{
                    alignSelf: "stretch",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 8,
                    display: "inline-flex",
                }}
            >
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
}
