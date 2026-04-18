import CellStateViz from './viz/CellStateViz';
import CellDetailViz from './viz/CellDetailViz';
import M from '@/components/ui/math';

export default function CellState() {
  return (
    <section id="cell-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">셀 상태와 정보 흐름</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        셀 상태(Cell State) — 컨베이어 벨트처럼 직선으로 흐르는 LSTM의 핵심 통로.<br />
        <M>{'C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t'}</M> — 덧셈 구조가 기울기 소실을 방지한다.
      </p>
      <CellStateViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cell State 수식</h3>
        <CellDetailViz />
        <p className="leading-7">
          셀 상태 업데이트 — 두 단계의 조합. 먼저 forget gate로 불필요한 과거를 삭제, 이어서 input gate로 새 정보를 추가.
        </p>
        <M display>{'\\underbrace{C_t}_{\\text{새 셀 상태}} = \\underbrace{f_t \\odot C_{t-1}}_{\\text{삭제 후 남은 기억}} + \\underbrace{i_t \\odot \\tilde{C}_t}_{\\text{새로 추가할 기억}}'}</M>
        <p className="leading-7">
          왜 덧셈이 기울기를 보존하는가 — 미분의 핵심: <M>{'\\frac{\\partial(a+b)}{\\partial a} = 1'}</M>.
        </p>
        <M display>{'\\frac{\\partial C_t}{\\partial C_{t-1}} = \\underbrace{f_t}_{\\approx 1} \\quad \\text{vs} \\quad \\frac{\\partial h_t}{\\partial h_{t-1}} = \\underbrace{W_{hh} \\cdot (1 - \\tanh^2(\\cdots))}_{\\text{RNN: 반복 곱 → 축소}}'}</M>
        <p className="leading-7">
          LSTM의 기울기는 forget gate 값 <M>{'f_t'}</M>에 의해 결정 — <M>{'f_t \\approx 1'}</M>이면 기울기가 거의 그대로 전파.<br />
          여러 단계에 걸친 기울기: <M>{'\\frac{\\partial C_t}{\\partial C_0} = \\prod_{i=1}^{t} f_i'}</M> — forget gate가 기울기 "고속도로"를 제어.<br />
          이 원리는 ResNet의 skip connection(<M>{'y = F(x) + x'}</M>)과 동일 — 덧셈 경로가 기울기를 보존.
        </p>
        <p className="leading-7">
          <strong>셀 상태 vs 은닉 상태</strong>: <M>{'C_t'}</M>는 장기 기억(메모장), <M>{'h_t = o_t \\odot \\tanh(C_t)'}</M>는 단기 출력(발표 자료).<br />
          이 분리 덕분에 정보가 셀 안에 수십~수백 단계 보존되면서도 출력은 상황에 맞게 선별.
        </p>
      </div>
    </section>
  );
}
