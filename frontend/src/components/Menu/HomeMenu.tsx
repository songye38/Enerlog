import dashboardIcon from "/icons/12X12/bar-chart-10.png";
import archiveIcon from "/icons/12X12/folder-check.png";
import programIcon from "/icons/12X12/message-chat-circle.png";
import profileIcon from "/icons/12X12/settings-01.png";
import energyIcon from "/icons/12X12/folder-check.png";
import actsIcon from "/icons/12X12/folder-check.png";
import { useAuth } from "../../hooks/useAuth";

type HomeMenuProps = {
    onNavigate: (path: string) => void;
};

export default function HomeMenu({ onNavigate }: HomeMenuProps) {
    const { user, logout } = useAuth(); // user가 있으면 로그인 상태


    const menuItems = [
        { label: "대시보드", path: "/dash", icon: dashboardIcon },
        { label: "기록", path: "/archive", icon: archiveIcon },
        { label: "프로그램", path: "/program", icon: programIcon },
        { label: "정보 수정", path: "/profile", icon: profileIcon },
    ];

    const archiveItems = [
        { label: "에너지 레벨 관리", path: "/energy", icon: energyIcon },
        { label: "활동 관리", path: "/acts", icon: actsIcon },
    ];

    // 로그인 상태에 따라 버튼 설정
    const authItems = user
        ? [
            {
                label: "로그아웃",
                icon: energyIcon,
                onClick: () => logout(), // path는 안 쓰고 onClick만
            },
        ]
        : [
            { label: "로그인", path: "/login", icon: energyIcon },
            { label: "회원가입", path: "/signup", icon: actsIcon },
        ];

    return (
        <div style={{ width: '210px', padding: '20px 20px 20px 20px', background: 'white', boxShadow: '0px 4px 4px rgba(0,0,0,0.25)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* 메뉴 항목 */}
            <div style={{ borderBottom: '1px solid #D9D9D9', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 20 }}>
                {menuItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => onNavigate(item.path)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                        <img src={item.icon} alt={item.label} style={{ width: 16, height: 16 }} />
                        <div style={{ color: '#000000', fontSize: 17, fontFamily: 'Pretendard, sans-serif', fontWeight: 600 }}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* 아카이브 항목 */}
            <div style={{ borderBottom: '1px solid #D9D9D9', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 20 }}>
                {archiveItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => onNavigate(item.path)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                        <img src={item.icon} alt={item.label} style={{ width: 16, height: 16 }} />
                        <div style={{ color: '#000000', fontSize: 17, fontFamily: 'Pretendard, sans-serif', fontWeight: 600 }}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* 로그인 / 회원가입 */}
            <div style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                {authItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => {
                            if ("onClick" in item && item.onClick) {
                                // onClick 속성이 있는 경우 실행
                                item.onClick();
                            } else if ("path" in item && item.path) {
                                // path 속성이 있는 경우 navigate
                                onNavigate(item.path);
                            }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                        <img src={item.icon} alt={item.label} style={{ width: 16, height: 16 }} />
                        <div style={{ color: '#000000', fontSize: 17, fontFamily: 'Pretendard, sans-serif', fontWeight: 600 }}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
