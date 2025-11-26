// import MainBtn from "../components/Button/MainBtn";
// import MainInput from "../components/Input/MainInput";
// import { useState } from "react";
// import logoIcon from '/common/logo.png'
// import { COLORS } from "../types/Colors";
// import { registerUser } from "../api/auth";
// import { toast } from "react-toastify";

// export default function SignupFormSection() {
//     const [email, setEmail] = useState("");
//     const [nickname, setNickname] = useState("");
//     const [password, setPassword] = useState("");
//     const [passwordConfirm, setPasswordConfirm] = useState("");
//     const [_error, setError] = useState("");
//     const [_success, setSuccess] = useState("");


//     const handleSubmit = async () => {
//         setError("");
//         setSuccess("");

//         if (password !== passwordConfirm) {
//             setError("비밀번호가 일치하지 않아");
//             return;
//         }

//         try {
//             const _user = await registerUser({
//                 nickname,
//                 email,
//                 password,
//             });
//             setSuccess("회원가입 성공! 환영해 🎉");
//             toast.success("회원가입 성공! 환영해 🎉");
//         } catch (err) {
//             if (err instanceof Error) setError(err.message);
//             else setError("알 수 없는 오류가 발생했어.");
//             toast.error("알 수 없는 오류가 발생했어.");
//         }
//     };


//     return (
//         <div style={{ display: "flex", flexDirection: "column", gap: 16, backgroundColor: COLORS.primary[100], borderRadius: 16, padding: "28px 20px" }}>
//             <div style={{ textAlign: "center" }}>
//                 <img src={logoIcon} alt="Enerlog Logo" style={{ width: 132, marginBottom: 4 }} />
//                 <div>
//                     <span style={{ color: "#455CC5", fontSize: 12, fontFamily: "Outfit", fontWeight: 400, lineHeight: '16.44px' }}> energy, <br /></span>
//                     <span style={{ color: "#455CC5", fontSize: 12, fontFamily: "Outfit", fontWeight: 400, lineHeight: '16.44px' }}> energy, <br /></span>
//                     <span style={{ color: "#455CC5", fontSize: 12, fontFamily: "Outfit", fontWeight: 400, lineHeight: '16.44px' }}> energy, <br /></span>
//                 </div>
//             </div>

//             <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
//                 <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                     <MainInput label="이메일" value={email} onChange={setEmail} type="text" />
//                     <MainInput label="닉네임" value={nickname} onChange={setNickname} type="text" />
//                     <MainInput label="비밀번호" value={password} onChange={setPassword} type="password" />
//                     <MainInput label="비밀번호 확인" value={passwordConfirm} onChange={setPasswordConfirm} type="password" />
//                 </div>
//                 <div style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex', gap: 4 }}>
//                     <div style={{ padding: 10, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
//                         <div style={{ color: '#ED1515', fontSize: 14, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>비밀번호가 일치하지 않습니다.</div>
//                     </div>
//                     <MainBtn onClick={handleSubmit}>회원가입</MainBtn>
//                 </div>
//             </div>
//         </div>
//     );
// }

import MainBtn from "../components/Button/MainBtn";
import MainInput from "../components/Input/MainInput";
import { useState } from "react";
import type { CSSProperties } from "react";
import logoIcon from '/common/logo.png'
import { COLORS } from "../types/Colors";
import { registerUser } from "../api/auth";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const loaderStyle: CSSProperties = {
    display: "block",
    margin: "0 auto",
};

export default function SignupFormSection() {
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [_error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false); // 🔹 로딩 상태 추가

    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        setLoading(true); // 🔹 API 요청 시작 시 로딩 true

        if (password !== passwordConfirm) {
            setError("비밀번호가 일치하지 않아");
            setLoading(false); // 🔹 비밀번호 불일치면 로딩 끔
            return;
        }

        try {
            await registerUser({
                nickname,
                email,
                password,
            });
            setSuccess("회원가입 성공! 환영해 🎉");
            toast.success("회원가입 성공! 환영해 🎉");
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("알 수 없는 오류가 발생했어.");
            toast.error("알 수 없는 오류가 발생했어.");
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
                    <MainInput label="닉네임" value={nickname} onChange={setNickname} type="text" />
                    <MainInput label="비밀번호" value={password} onChange={setPassword} type="password" />
                    <MainInput label="비밀번호 확인" value={passwordConfirm} onChange={setPasswordConfirm} type="password" />
                </div>

                <div style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex', gap: 12 }}>
                    {/* 🔹 에러 표시 */}
                    {_error && (
                        <div style={{ color: '#ED1515', fontSize: 14, fontFamily: 'Pretendard', fontWeight: '600', wordWrap: 'break-word' }}>
                            {_error}
                        </div>
                    )}

                    {/* 🔹 로딩 스피너 */}
                    {loading && <ClipLoader color="#455CC5" loading={loading} cssOverride={loaderStyle} size={40} />}

                    {/* 🔹 회원가입 버튼, 로딩 중이면 비활성화 */}
                    <MainBtn onClick={handleSubmit} disabled={loading}>
                        {loading ? "가입 중..." : "회원가입"}
                    </MainBtn>
                </div>
            </div>
        </div>
    );
}
