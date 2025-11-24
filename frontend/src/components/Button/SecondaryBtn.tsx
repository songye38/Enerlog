import bookIcon from '/icons/16X16/book.png';


type SecondaryBtnProps = {
  label: string;          // 버튼 텍스트
  onClick?: () => void;   // 클릭 시 실행될 함수
};

export default function SecondaryBtn({ label, onClick }: SecondaryBtnProps) {
  return (
    <div
      style={{
        width:'100%',
        alignSelf: 'stretch',
        padding: '9px 21px',
        background: '#D2D8F1',
        borderRadius: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        display: 'inline-flex',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <div
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 6,
          display: 'inline-flex',
        }}
      >
        {/* 좌측 아이콘 */}
        <img src={bookIcon} alt="로고" style={{width:16}} />

        {/* 버튼 텍스트 */}
        <div
          style={{
            color: '#31418C',
            fontSize: 13,
            fontFamily: 'Pretendard, sans-serif',
            fontWeight: 600,
            wordWrap: 'break-word',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
