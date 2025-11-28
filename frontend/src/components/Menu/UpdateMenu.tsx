import editIcon from "/icons/12X12/edit.png";
import trashIcon from "/icons/12X12/trash.png";

type UpdateMenuProps = {
    onNavigate: (path: string) => void;
};

export default function UpdateMenu({ onNavigate }: UpdateMenuProps) {

    const mainItems = [
        { label: "수정", path: "/energy", icon: editIcon },
        { label: "삭제", path: "/acts", icon: trashIcon },
    ];

    return (
        <div style={{ width: '180px', padding: '28px 20px 20px 20px', background: 'white', boxShadow: '0px 4px 4px rgba(0,0,0,0.25)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>


            {/* 수정,삭제 */}
            <div style={{ borderBottom: '1px solid #D9D9D9', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 20 }}>
                {mainItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => onNavigate(item.path)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                        <img src={item.icon} alt={item.label} style={{ width: 12, height: 12 }} />
                        <div style={{ color: '#595959', fontSize: 15, fontFamily: 'Pretendard, sans-serif', fontWeight: 600 }}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>




        </div>
    );
}
