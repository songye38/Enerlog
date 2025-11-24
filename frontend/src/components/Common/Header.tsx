import menuIcon from '/icons/24X24/menu.png';

export default function Header() {
  return (
    <div
      style={{
        width: 390,
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 93,
        display: 'inline-flex',
      }}
    >
      {/* 로고 */}
      <div
        style={{
          color: '#455CC5',
          fontSize: 64,
          fontFamily: 'WagleWagle, sans-serif',
          fontWeight: 400,
          lineHeight: '64px',
          wordWrap: 'break-word',
        }}
      >
        Enerlog
      </div>

      {/* 메뉴 영역 */}
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          display: 'flex',
        }}
      >
        {/* 서비스 소개 */}
        <div
          style={{
            padding: '4px 0',
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            display: 'flex',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              color: 'black',
              fontSize: 13,
              fontFamily: 'Pretendard, sans-serif',
              fontWeight: 400,
              lineHeight: '27px',
              wordWrap: 'break-word',
            }}
          >
            서비스 소개
          </div>
        </div>

        {/* 사용방법 */}
        <div
          style={{
            padding: '4px 0',
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            display: 'flex',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              color: 'black',
              fontSize: 13,
              fontFamily: 'Pretendard, sans-serif',
              fontWeight: 400,
              lineHeight: '27px',
              wordWrap: 'break-word',
            }}
          >
            사용방법
          </div>
        </div>

        {/* 햄버거 아이콘 */}
        <img src={menuIcon} alt="메뉴 아이콘" style={{ width: 24, height: 24, cursor: 'pointer' }} />
      </div>
    </div>
  );
}
