import MsmFormulaViz from './viz/MsmFormulaViz';
import ParamTradeoffViz from './viz/ParamTradeoffViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pippenger를 GPU에 매핑하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>MSM</strong>은 수백만 개의 스칼라-점 쌍에 대해 <code>Q = sum(s_i * P_i)</code>를 계산하는 연산이다.<br />
          ZK 증명 시스템에서 증명 생성 시간의 60~80%를 차지한다.
        </p>
        <p>
          Pippenger의 버킷 방식은 스칼라를 c-bit 윈도우로 쪼갠 뒤,
          같은 윈도우 값을 가진 점들을 하나의 버킷에 모아 한 번에 더한다.<br />
          버킷 누적 단계에서 각 버킷은 완전히 독립적이므로 GPU의 대규모 병렬성과 정확히 맞아떨어진다.
        </p>
        <MsmFormulaViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 파라미터</h3>
        <p>
          윈도우 크기 c가 GPU 구현의 성능을 좌우한다.
          c가 크면 버킷 수가 기하급수적으로 늘어 GPU 메모리를 압박하고,
          c가 작으면 윈도우 수가 늘어 반복 연산이 증가한다.<br />
          실전에서는 c = 16 전후가 메모리와 연산의 균형점이다.
        </p>
        <ParamTradeoffViz />
      </div>
    </section>
  );
}
