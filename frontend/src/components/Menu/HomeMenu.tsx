import { useNavigate } from "react-router-dom";

import dashboardIcon from "/icons/12X12/bar-chart-10.png";
import archiveIcon from "/icons/12X12/folder-check.png";
import programIcon from "/icons/12X12/message-chat-circle.png";
import profileIcon from "/icons/12X12/settings-01.png";
import energyIcon from "/icons/12X12/folder-check.png";
import actsIcon from "/icons/12X12/folder-check.png";

export default function HomeMenu() {
    const navigate = useNavigate();

    // 메뉴 항목 + 이동할 경로
    const menuItems = [
        { label: "대시보드", path: "/dash", icon: dashboardIcon },
        { label: "기록", path: "/archive", icon: archiveIcon },
        { label: "프로그램", path: "/program", icon: programIcon },
        { label: "정보 수정", path: "/profile", icon: profileIcon },
    ];

    // 메뉴 항목 + 이동할 경로
    const archiveItems = [
        { label: "에너지 레벨 관리", path: "/energy", icon: energyIcon },
        { label: "활동 관리", path: "/acts", icon: actsIcon },
    ];

    const authItems = [
        { label: "로그인", path: "/login", icon: energyIcon },
        { label: "회원가입", path: "/signup", icon: actsIcon },
    ];

    return (
        <div
            style={{
                padding: '28px 20px 20px 20px',
                background: 'white',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                borderRadius: 12,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 12,
                display: 'inline-flex',
            }}
        >
            {/* 메뉴 항목 */}
            <div
                style={{
                    width: '100%',
                    paddingBottom: 20,
                    borderBottom: '1px #D9D9D9 solid',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 16,
                    display: 'flex',
                }}
            >
                {menuItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(item.path)}
                        style={{
                            alignSelf: 'stretch',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 6,
                            display: 'inline-flex',
                            cursor: 'pointer',
                        }}
                    >
                        {/* 아이콘 */}
                        <img src={item.icon} alt={item.label} style={{ width: 12, height: 12 }} />

                        {/* 텍스트 */}
                        <div
                            style={{
                                color: '#595959',
                                fontSize: 15,
                                fontFamily: 'Pretendard, sans-serif',
                                fontWeight: 500,
                                wordWrap: 'break-word',
                            }}
                        >
                            {item.label}
                        </div>
                    </div>
                ))}

            </div>

            {/* 아카이브 항목 */}
            <div
                style={{
                    width: '100%',
                    paddingBottom: 20,
                    borderBottom: '1px #D9D9D9 solid',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 16,
                    display: 'flex',
                }}
            >
                {archiveItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(item.path)}
                        style={{
                            alignSelf: 'stretch',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 6,
                            display: 'inline-flex',
                            cursor: 'pointer',
                        }}
                    >
                        {/* 아이콘 */}
                        <img src={item.icon} alt={item.label} style={{ width: 12, height: 12 }} />

                        {/* 텍스트 */}
                        <div
                            style={{
                                color: '#595959',
                                fontSize: 15,
                                fontFamily: 'Pretendard, sans-serif',
                                fontWeight: 500,
                                wordWrap: 'break-word',
                            }}
                        >
                            {item.label}
                        </div>
                    </div>
                ))}

            </div>

            {/* 로그인 / 회원가입 */}
            <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'inline-flex' }}>
                {authItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(item.path)}
                        style={{
                            padding: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 6, // 아이콘과 텍스트 간격
                            display: 'flex',
                            cursor: 'pointer',
                        }}
                    >
                        {/* 아이콘 */}
                        <img src={item.icon} alt={item.label} style={{ width: 12, height: 12 }} />

                        {/* 텍스트 */}
                        <div
                            style={{
                                color: '#595959',
                                fontSize: 15,
                                fontFamily: 'Pretendard, sans-serif',
                                fontWeight: 500,
                                wordWrap: 'break-word',
                            }}
                        >
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
