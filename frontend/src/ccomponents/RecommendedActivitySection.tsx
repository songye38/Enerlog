
import type { ActivityFeed } from "../types/ActivityFeed";


type RecommendActivitySectionProps = {
  data: ActivityFeed;
  onDoNow?: () => void;
  onDoLater?: () => void;
  rank: number; // map에서 index+1로 전달
};

export default function RecommendActivitySection({
  data,
  onDoNow,
  onDoLater,
  rank,
}: RecommendActivitySectionProps) {
  return (
    <div style={{ width: 390, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 36, display: 'inline-flex' }}>
      {/* 제목 */}
      <div style={{ alignSelf: 'stretch', textAlign: 'center' }}>
        <span style={{ color: 'black', fontSize: 16, fontFamily: 'Pretendard', fontWeight: 600, lineHeight: '26px' }}>
          추천 활동 {rank}<br/><br/>
        </span>
        <span style={{ color: 'black', fontSize: 18, fontFamily: 'Pretendard', fontWeight: 600, lineHeight: '26px' }}>
          {data.title}
        </span>
      </div>

      {/* 세부 정보 */}
      <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 12, display: 'flex' }}>
        {/* 설명 */}
        <div style={{ alignSelf: 'stretch', padding: 12, background: '#ECEFF9', borderRadius: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'flex' }}>
          <div style={{ color: 'black', fontSize: 14, fontFamily: 'Pretendard', fontWeight: 600 }}>설명</div>
          <div style={{ textAlign: 'center', color: 'black', fontSize: 16, fontFamily: 'Pretendard', fontWeight: 400, lineHeight: '21px' }}>
            {data.description}
          </div>
        </div>

        {/* 좋은 점 */}
        <div style={{ alignSelf: 'stretch', padding: 12, background: '#ECEFF9', borderRadius: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'flex' }}>
          <div style={{ color: 'black', fontSize: 14, fontFamily: 'Pretendard', fontWeight: 600 }}>좋은 점</div>
          <div style={{ textAlign: 'center', color: 'black', fontSize: 16, fontFamily: 'Pretendard', fontWeight: 400, lineHeight: '21px' }}>
            {data.goodPoint}
          </div>
        </div>

        {/* 소요 시간 */}
        <div style={{ alignSelf: 'stretch', padding: 12, background: '#ECEFF9', borderRadius: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'flex' }}>
          <div style={{ color: 'black', fontSize: 14, fontFamily: 'Pretendard', fontWeight: 600 }}>소요 시간</div>
          <div style={{ textAlign: 'center', color: 'black', fontSize: 16, fontFamily: 'Pretendard', fontWeight: 400, lineHeight: '21px' }}>
            {data.durationMinutes}
          </div>
        </div>

        {/* 인사이트 */}
        <div style={{ alignSelf: 'stretch', padding: 12, background: '#ECEFF9', borderRadius: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'flex' }}>
          <div style={{ color: 'black', fontSize: 14, fontFamily: 'Pretendard', fontWeight: 600 }}>인사이트</div>
          <div style={{ textAlign: 'center', color: 'black', fontSize: 16, fontFamily: 'Pretendard', fontWeight: 400, lineHeight: '21px' }} dangerouslySetInnerHTML={{ __html: data.insight || "" }} />
        </div>
      </div>

      {/* 버튼 */}
      <div style={{ width: 390, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 20, display: 'flex' }}>
        <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 12, display: 'flex' }}>
          <div onClick={onDoNow} style={{ alignSelf: 'stretch', padding: 20, background: '#455CC5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
            <div style={{ color: 'white', fontSize: 18, fontFamily: 'Pretendard', fontWeight: 600 }}>추천 행동 {rank} 지금 바로 해볼래</div>
          </div>
          <div onClick={onDoLater} style={{ alignSelf: 'stretch', padding: 20, background: '#455CC5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
            <div style={{ color: 'white', fontSize: 18, fontFamily: 'Pretendard', fontWeight: 600 }}>추천 행동 {rank} 나중에 해볼래</div>
          </div>
        </div>

        {/* 페이지 인디케이터 */}
        {/* <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 5, display: 'inline-flex' }}>
          <div style={{ width: 11, height: 11, background: '#BFBFBF', borderRadius: 9999 }} />
          <div style={{ width: 11, height: 11, background: '#F0F0F0', borderRadius: 9999 }} />
          <div style={{ width: 11, height: 11, background: '#F0F0F0', borderRadius: 9999 }} />
          <div style={{ width: 11, height: 11, background: '#F0F0F0', borderRadius: 9999 }} />
        </div> */}
      </div>
    </div>
  );
}
