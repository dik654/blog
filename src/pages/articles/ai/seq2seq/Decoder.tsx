import DecoderViz from './viz/DecoderViz';
import S2SDecoderViz from './viz/S2SDecoderViz';
import M from '@/components/ui/math';

export default function Decoder() {
  return (
    <section id="decoder" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">디코더: 벡터에서 번역 생성</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        EOS + 컨텍스트 벡터 → LSTM → Softmax → 단어 생성.<br />
        출력이 다음 입력(자기회귀) — GPT 등 현대 LLM의 기본 메커니즘.
      </p>
      <DecoderViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Decoder LSTM 자기회귀 생성</h3>
        <S2SDecoderViz />
        <M display>{'\\underbrace{(c_0, h_0) = (c_T, h_T)}_{\\text{Encoder 최종 상태 복사}}, \\quad y_0 = \\langle\\text{SOS}\\rangle'}</M>
        <p className="leading-7">
          자기회귀 생성: <M>{'s_t = \\text{LSTM}(y_{t-1},\\, s_{t-1},\\, c)'}</M>, <M>{'y_t = \\arg\\max \\text{softmax}(W_{out} \\cdot s_t)'}</M><br />
          Beam Search: top-k 후보를 유지하며 <M>{'\\prod_t P(y_t)'}</M> 최대 경로 선택 (k=4~10)
        </p>
        <M display>{'\\text{Exposure Bias}: \\underbrace{P_{\\text{train}}(y_{t-1}) = y^*_{t-1}}_{\\text{정답}} \\neq \\underbrace{P_{\\text{test}}(y_{t-1}) = \\hat{y}_{t-1}}_{\\text{모델 예측}}'}</M>
        <p className="leading-7">
          요약 1: Decoder는 <strong>이전 출력을 다음 입력</strong>으로 사용 — autoregressive 생성.<br />
          요약 2: <strong>Beam Search</strong>가 greedy 대비 번역 품질 향상 — top-k 후보 추적.<br />
          요약 3: <strong>Exposure bias</strong>는 학습/추론 분포 불일치 — GPT 계열도 같은 문제.
        </p>
      </div>
    </section>
  );
}
