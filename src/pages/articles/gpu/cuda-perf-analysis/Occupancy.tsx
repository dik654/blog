import OccupancyDefViz from './viz/OccupancyDefViz';
import OccupancyCalcViz from './viz/OccupancyCalcViz';
import LatencyHidingViz from './viz/LatencyHidingViz';

export default function Occupancy() {
  return (
    <section id="occupancy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">점유율(Occupancy) & 활성 워프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>점유율은 SM에서 동시에 활성화된 워프 수를 최대 가능 워프 수로 나눈 비율이다. 높은 점유율은 메모리 지연을 숨기는 데 유리하지만, 항상 100%가 최적은 아니다.</p>

        <h3 className="text-xl font-semibold mt-8 mb-3">점유율 정의 & 제한 자원</h3>
        <div className="not-prose mb-4"><OccupancyDefViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">점유율 계산 예시</h3>
        <p>레지스터 사용량이 점유율을 가장 크게 좌우한다. 스레드당 레지스터를 64개에서 32개로 줄이면 점유율이 50%에서 100%로 올라가지만, spill이 발생하면 오히려 느려진다.</p>
        <div className="not-prose mb-4"><OccupancyCalcViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">레이턴시 히딩 & 자동 블록 크기</h3>
        <p>GPU는 한 워프가 메모리 응답을 기다리는 동안 다른 워프를 실행한다. 활성 워프가 충분하면 파이프라인이 항상 바쁘게 유지된다.</p>
        <div className="not-prose mb-4"><LatencyHidingViz /></div>
      </div>
    </section>
  );
}
