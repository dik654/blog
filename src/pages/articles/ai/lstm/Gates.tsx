import GateViz from './viz/GateViz';
import GateDetailViz from './viz/GateDetailViz';
import M from '@/components/ui/math';

export default function Gates() {
  return (
    <section id="gates" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">게이트 메커니즘</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        LSTM의 3개 게이트 — 각각 시그모이드(σ) 출력 [0,1]로 정보 흐름을 제어.<br />
        0 = 완전 차단, 1 = 완전 통과.
      </p>
      <GateViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">3 게이트 상세</h3>
        <GateDetailViz />
        <p className="leading-7">
          <strong>Forget Gate</strong> — 이전 기억 중 유지할 비율 결정.
          <M>{'b_f = 1'}</M>로 초기화하여 학습 초기에 기억 보존 편향.
        </p>
        <M display>{'\\underbrace{f_t}_{\\text{잊기 비율}} = \\sigma(\\underbrace{W_f \\cdot [h_{t-1}, x_t]}_{\\text{이전 출력 + 현재 입력}} + b_f)'}</M>
        <p className="leading-7">
          <strong>Input Gate</strong> — σ(얼마나) × tanh(무엇을) 분리가 핵심 패턴.
        </p>
        <M display>{'\\underbrace{i_t}_{\\text{저장 비율}} = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i), \\quad \\underbrace{\\tilde{C}_t}_{\\text{후보 기억}} = \\tanh(W_c \\cdot [h_{t-1}, x_t] + b_c)'}</M>
        <p className="leading-7">
          <strong>Output Gate</strong> — 셀 상태를 tanh로 정규화한 뒤 gate 적용.
          셀 상태(<M>{'C_t'}</M>)는 장기 기억, 은닉 상태(<M>{'h_t'}</M>)는 단기 출력 — 두 흐름이 분리.
        </p>
        <M display>{'\\underbrace{o_t}_{\\text{출력 비율}} = \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o), \\quad \\underbrace{h_t}_{\\text{은닉 상태}} = o_t \\odot \\tanh(C_t)'}</M>
        <p className="leading-7">
          파라미터 총 수: <M>{'4 \\times H \\times (H + I + 1)'}</M> — 4개 가중치 행렬(<M>{'W_f, W_i, W_c, W_o'}</M>)에서 유래.<br />
          H=512, I=300 기준 약 166만/레이어 — Vanilla RNN의 4배.
        </p>
      </div>
    </section>
  );
}
