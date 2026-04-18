import GradientProblemViz from './viz/GradientProblemViz';
import GradientMathDetailViz from './viz/GradientMathDetailViz';
import LSTMDesignDetailViz from './viz/LSTMDesignDetailViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RNN의 한계와 LSTM의 등장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RNN(Recurrent Neural Network) — 시퀀스 데이터를 처리하는 가장 기본적인 구조<br />
          시퀀스가 길어지면 <strong>기울기 소실(Vanishing Gradient)</strong> 문제 발생<br />
          장기 의존성을 학습하지 못함
        </p>
      </div>
      <div className="not-prose my-6"><GradientProblemViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          1997년 <strong>Hochreiter & Schmidhuber</strong>가 제안한 LSTM — <strong>게이트 메커니즘</strong>과 <strong>셀 상태(Cell State)</strong>로 해결<br />
          셀 상태는 컨베이어 벨트처럼 정보를 거의 손실 없이 전달<br />
          세 개의 게이트(Forget, Input, Output)가 정보의 흐름을 제어
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">RNN vs LSTM 핵심 차이</h3>
        <div className="grid grid-cols-2 gap-4 not-prose text-sm">
          {[
            ['RNN', 'h_t = tanh(W · [h_{t-1}, x_t])', '단일 tanh — 기울기 소실', '#ef4444'],
            ['LSTM', 'C_t + 3 Gates → h_t', '셀 상태 + 게이트 — 장기 기억 보존', '#10b981'],
          ].map(([name, eq, desc, color]) => (
            <div key={name} className="rounded-lg border p-3"
              style={{ borderColor: color + '40', background: color + '08' }}>
              <p className="font-mono font-bold text-xs" style={{ color: color as string }}>{name}</p>
              <p className="text-[11px] text-foreground/60 mt-1 font-mono">{eq}</p>
              <p className="text-[11px] text-foreground/50 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">기울기 소실 수학적 분석</h3>
        <div className="not-prose"><GradientMathDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM 설계의 핵심 통찰</h3>
        <div className="not-prose"><LSTMDesignDetailViz /></div>
        <p className="leading-7">
          요약 1: <strong>기울기 소실</strong>은 RNN의 구조적 한계 — 곱셈 기반 재귀가 T 스텝 동안 ρ(W)^T로 붕괴.<br />
          요약 2: LSTM의 <strong>additive update</strong>와 forget gate가 기울기 고속도로를 만들어 장기 의존성 학습 가능.<br />
          요약 3: 현재도 <strong>소규모 데이터·실시간 스트리밍·저자원 환경</strong>에서 LSTM은 Transformer보다 실용적.
        </p>
      </div>
    </section>
  );
}
