import VariantsViz from './viz/VariantsViz';
import VariantsDetailViz from './viz/VariantsDetailViz';
import M from '@/components/ui/math';

export default function Variants() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LSTM 변형과 GRU</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        LSTM 이후 다양한 변형이 등장. GRU는 게이트를 줄여 효율을 높였다.
      </p>
      <VariantsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM 변형 상세</h3>
        <VariantsDetailViz />
        <p className="leading-7">
          <strong>GRU</strong>(Cho 2014) — forget + input을 update gate 하나로 통합.
          셀 상태 없이 은닉 상태만으로 기억 관리.
        </p>
        <M display>{'\\underbrace{r_t}_{\\text{리셋}} = \\sigma(W_r \\cdot [h_{t-1}, x_t]), \\quad \\underbrace{z_t}_{\\text{업데이트}} = \\sigma(W_z \\cdot [h_{t-1}, x_t])'}</M>
        <M display>{'\\tilde{h}_t = \\tanh(W \\cdot [\\underbrace{r_t \\odot h_{t-1}}_{\\text{리셋된 과거}}, x_t])'}</M>
        <M display>{'h_t = \\underbrace{(1 - z_t) \\odot h_{t-1}}_{\\text{이전 유지}} + \\underbrace{z_t \\odot \\tilde{h}_t}_{\\text{새 정보}}'}</M>
        <p className="leading-7">
          <M>{'z_t'}</M>가 높으면 새 정보 반영, <M>{'(1-z_t)'}</M>가 높으면 이전 유지 — coupled 구조로 파라미터 25% 감소.<br />
          <strong>Peephole</strong>: 게이트가 <M>{'C_{t-1}'}</M>도 참조 — 타이밍 민감 작업에 약간의 개선.<br />
          <strong>Bidirectional</strong>: 순방향 + 역방향 병렬 실행 → <M>{'h_t = [\\overrightarrow{h_t} ; \\overleftarrow{h_t}]'}</M> — NER/POS 태깅 표준.<br />
          <strong>Stacked</strong>: 2~4 레이어 적층 — 하위는 로컬, 상위는 추상 패턴 학습.
        </p>
        <p className="leading-7">
          현대 후계자 — Mamba(선택적 SSM), RWKV(RNN+Transformer), RetNet(선형 어텐션).<br />
          공통 핵심: "선택적 기억" 메커니즘 — LSTM 게이트의 현대적 재해석.
        </p>
      </div>
    </section>
  );
}
