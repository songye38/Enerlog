import arrowIcon from '/icons/24X24/arrow-left.png'
import { useNavigate } from "react-router-dom";

export default function GoToMainBtn() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/'); // 메인 페이지로 이동
    };
    return (
        <div
            onClick={handleClick}
            style={{ justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
            <img src={arrowIcon} alt="메인으로 가기" style={{ width: 24, height: 24, marginRight: 8 }} />
            <div style={{ color: 'black', fontSize: 17, fontFamily: 'Pretendard', fontWeight: '500', wordWrap: 'break-word' }}>메인으로 가기</div>
        </div>
    );
}



