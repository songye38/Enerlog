import MainBtn from "../components/Button/MainBtn";
import MainInput from "../components/Input/MainInput";
import { useState } from "react";
import logoIcon from '/common/logo.png'
import { COLORS } from "../types/Colors";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";
import { loginUser } from "../api/auth";

const loaderStyle: CSSProperties = {
    display: "block",
    margin: "0 auto",
};

export default function LoginFormSection() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [_error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false); // 🔹 로딩 상태 추가


    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        setLoading(true); // 🔹 API 요청 시작 시 로딩 true

        try {
            await loginUser({
                email,
                password,
            });
            setSuccess("로그인 성공 🎉");
            toast.success("로그인 성공 🎉");
            navigate('/')

        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("로그인 실패.");
            toast.error("로그인 실패");
        } finally {
            setLoading(false); // 🔹 API 요청 끝나면 항상 로딩 false
        }
    };

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
                    {/* 🔹 로딩 스피너 */}
                    {loading && <ClipLoader color="#455CC5" loading={loading} cssOverride={loaderStyle} size={40} />}
                    <MainBtn onClick={handleSubmit} disabled={loading}>
                        {loading ? "로그인 중..." : "로그인"}
                    </MainBtn>
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
