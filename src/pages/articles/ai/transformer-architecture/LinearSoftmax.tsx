import LinearSoftmaxViz from './viz/LinearSoftmaxViz';

export default function LinearSoftmax() {
  return (
    <section id="linear-softmax" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">최종 출력 (Linear + Softmax)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          디코더의 마지막 출력 벡터(d_model=6)를 단어장 크기(11)로 확장한다<br />
          <strong>Linear(6→11)</strong> → <strong>Softmax</strong> → 다음 단어 확률 분포<br />
          가장 높은 확률의 단어가 예측 결과
        </p>
      </div>

      <LinearSoftmaxViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>학습 과정</h3>
        <div className="rounded-lg border p-3 text-sm space-y-2 mb-4">
          <div><strong>1.</strong> Linear: d_model(6) → vocab_size(11) — Logits 생성</div>
          <div><strong>2.</strong> Softmax → 확률 분포 (합=1)</div>
          <div><strong>3.</strong> argmax → 예측 단어 선택</div>
          <div><strong>4.</strong> Cross-Entropy Loss 계산 → 역전파</div>
        </div>
        <p>
          CE Loss = -log(정답 확률)<br />
          확률이 1에 가까울수록 Loss → 0, 학습이 잘 된 것
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Output Layer 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Output Projection & Softmax
//
// 입력: decoder output h ∈ R^{d_model}
// 출력: 다음 토큰 확률 분포 p ∈ R^{vocab_size}
//
// Step 1: Linear projection (logits)
//   logits = h · W_out + b_out
//   W_out: (d_model, vocab_size)
//
//   파라미터 수:
//     d_model=4096, vocab=32000 → 131M!
//     전체 파라미터의 큰 부분 차지
//
// Step 2: Softmax
//   p_i = exp(logits_i) / Σ_j exp(logits_j)
//
// Step 3: Loss (학습 시)
//   L = -log(p_target)   # Cross-Entropy
//
// Step 4: Generation (추론 시)
//   next_token = sample(p) 또는 argmax(p)

// Weight Tying:
//   입력 임베딩 E와 출력 가중치 W_out 공유
//   W_out = E^T
//
//   장점:
//   - 파라미터 절반 감소
//   - 임베딩과 출력의 일관성
//   - 정규화 효과
//
//   GPT-2, BERT, LLaMA 모두 채택

// 생성 전략:
//
// 1. Greedy (argmax)
//    deterministic, 보수적
//
// 2. Temperature
//    logits / T 후 softmax
//    T < 1: sharp, T > 1: flat
//
// 3. Top-k Sampling
//    상위 k개만 유지, 나머지 0
//
// 4. Top-p (Nucleus) Sampling
//    누적 확률 p 내 토큰만 유지
//
// 5. Beam Search
//    top-k 경로 유지 (번역에서 인기)

// Loss 변형:
//   - Label smoothing: 0.9 true + 0.1 uniform
//   - Focal loss: 어려운 샘플 강조
//   - Speculative decoding: 빠른 생성`}
        </pre>
        <p className="leading-7">
          요약 1: 출력은 <strong>Linear → Softmax → Loss/Sampling</strong> 순.<br />
          요약 2: <strong>Weight tying</strong>으로 임베딩-출력 공유 — 파라미터 절감.<br />
          요약 3: 생성 시 <strong>temperature·top-k·top-p</strong>로 다양성 조절.
        </p>
      </div>
    </section>
  );
}
