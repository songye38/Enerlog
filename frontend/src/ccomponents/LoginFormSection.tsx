import MainBtn from "../components/Button/MainBtn";
import MainInput from "../components/Input/MainInput";
import { useState } from "react";
import logoIcon from '/common/logo.png'
import { COLORS } from "../types/Colors";
import { useNavigate } from "react-router-dom";

export default function LoginFormSection() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, backgroundColor: COLORS.primary[100], borderRadius: 16, padding: "28px 20px" }}>
            <div style={{ textAlign: "center" }}>
                <img src={logoIcon} alt="Enerlog Logo" style={{ width: 132, marginBottom: 4 }} />
                <div>
                    <span style={{ color: "#455CC5", fontSize: 12, fontFamily: "Outfit", fontWeight: 400, lineHeight: '16.44px' }}> energy, <br /></span>
                    <span style={{ color: "#455CC5", fontSize: 12, fontFamily: "Outfit", fontWeight: 400, lineHeight: '16.44px' }}> energy, <br /></span>
                    <span style={{ color: "#455CC5", fontSize: 12, fontFamily: "Outfit", fontWeight: 400, lineHeight: '16.44px' }}> energy, <br /></span>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <MainInput label="이메일" value={email} onChange={setEmail} type="text" />
                    <MainInput label="비밀번호" value={password} onChange={setPassword} type="password" />
                </div>
                <div style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex', gap: 4 }}>
                    <div style={{ padding: 10, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                        <div style={{ color: '#ED1515', fontSize: 14, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>비밀번호가 일치하지 않습니다.</div>
                    </div>
                    <MainBtn>로그인</MainBtn>
                </div>

            </div>
            <div style={{ paddingTop: 8, paddingBottom: 8, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                <div
                    onClick={() => navigate("/signup")}
                    style={{ textAlign: 'center', color: '#8C8C8C', fontSize: 14, fontFamily: 'Pretendard', fontWeight: '500', lineHeight: '21px', wordWrap: 'break-word' }}>회원가입</div>
            </div>
        </div>
    );
}
