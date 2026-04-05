import DecoderViz from './viz/DecoderViz';

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Decoder LSTM 생성 과정 (Autoregressive)
//
// 초기 상태:
//   (c_0, h_0) = (c_T, h_T)  # encoder의 최종 상태
//   y_0 = <SOS>               # start-of-sequence 토큰
//
// 생성 루프:
//   t = 1
//   while y_{t-1} ≠ <EOS> and t < max_len:
//     e_t = Embedding[y_{t-1}]
//     (c_t, h_t) = LSTM(e_t, (c_{t-1}, h_{t-1}))
//     logits = W_out · h_t       # (vocab_size,)
//     probs = softmax(logits)
//
//     # Greedy
//     y_t = argmax(probs)
//
//     # 또는 Beam Search (k=4~10)
//
//     t += 1
//
// 출력: y_1, y_2, ..., <EOS>

// 자기회귀(Autoregressive)의 의미:
//   - 이전 출력이 다음 입력이 됨
//   - 순차적 생성 (병렬 불가)
//   - GPT도 동일 방식
//
// 생성 전략:
//
// 1. Greedy Search
//    - 매 스텝 argmax
//    - 빠르지만 suboptimal
//
// 2. Beam Search
//    - top-k 후보 유지
//    - 누적 확률 최대 경로
//    - 번역 품질 우수
//
// 3. Sampling
//    - temperature, top-p, top-k
//    - 다양성 확보
//    - 창의적 생성에 유리

// Exposure Bias 문제:
//   - 학습: teacher forcing (정답 입력)
//   - 추론: 자신의 예측 입력
//   - 오류 누적 가능
//   - 해결: Scheduled Sampling (Bengio 2015)`}
        </pre>
        <p className="leading-7">
          요약 1: Decoder는 <strong>이전 출력을 다음 입력</strong>으로 사용 — autoregressive 생성.<br />
          요약 2: <strong>Beam Search</strong>가 greedy 대비 번역 품질 향상 — top-k 후보 추적.<br />
          요약 3: <strong>Exposure bias</strong>는 학습/추론 분포 불일치 — GPT 계열도 같은 문제.
        </p>
      </div>
    </section>
  );
}
