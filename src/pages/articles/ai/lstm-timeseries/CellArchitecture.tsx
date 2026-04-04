import LSTMCellFlowViz from './viz/LSTMCellFlowViz';
import GateFlowViz from './viz/GateFlowViz';
import GateEquations from './GateEquations';

export default function CellArchitecture() {
  return (
    <section id="cell-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LSTM 셀 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LSTM 셀 — <strong>세 개의 게이트</strong>와 <strong>셀 상태(Cell State)</strong>로 구성<br />
          셀 상태는 시간축을 따라 정보를 전달하는 "고속도로"<br />
          게이트들이 이 고속도로에 정보를 추가하거나 제거
        </p>
      </div>

      <div className="not-prose my-6"><LSTMCellFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">게이트 연산 상세</h3>
        <p>
          각 게이트는 <strong>sigmoid(σ)</strong> 함수를 사용하여 0~1 사이의 값 출력<br />
          이 값이 정보의 "통과 비율" 결정 — 0이면 완전 차단, 1이면 완전 통과
        </p>
      </div>

      <div className="not-prose my-6"><GateFlowViz /></div>

      <GateEquations />
    </section>
  );
}
