import PreTrainFlowViz from './viz/PreTrainFlowViz';

const MLM_STRATEGY = [
  { pct: '80%', action: '[MASK]로 교체', color: '#6366f1', example: '"the cat [MASK] on"' },
  { pct: '10%', action: '랜덤 토큰 교체', color: '#f59e0b', example: '"the cat apple on"' },
  { pct: '10%', action: '원본 유지', color: '#10b981', example: '"the cat sat on"' },
];

const STATS = [
  { key: '코퍼스', value: 'Wikipedia + BookCorpus (3.3B words)' },
  { key: '배치 크기', value: '256 sequences x 512 tokens' },
  { key: '학습 스텝', value: '1M steps (~40 epochs)' },
  { key: 'Optimizer', value: 'Adam (lr=1e-4, warmup 10k steps)' },
];

export default function PreTraining() {
  return (
    <section id="pre-training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">사전학습: MLM + NSP</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          BERT의 사전학습 — 두 가지 비지도 목적함수로 구성<br />
          <strong>MLM</strong>(Masked Language Model) — 입력 토큰의 15%를 마스킹하고 원본 예측<br />
          <strong>NSP</strong>(Next Sentence Prediction) — 두 문장의 연속 관계를 이진 분류
        </p>
      </div>

      <PreTrainFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 mb-4">
        <h3 className="text-xl font-semibold mb-3">MLM 마스킹 전략 (15% 토큰 대상)</h3>
      </div>
      <div className="space-y-2 mb-6">
        {MLM_STRATEGY.map((s) => (
          <div key={s.pct} className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
            style={{ borderColor: s.color + '40', background: s.color + '08' }}>
            <span className="font-mono font-bold text-sm w-10" style={{ color: s.color }}>{s.pct}</span>
            <span className="text-sm w-36">{s.action}</span>
            <span className="text-xs font-mono text-foreground/50">{s.example}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3 className="text-xl font-semibold mb-3">학습 설정</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {STATS.map((s) => (
          <div key={s.key} className="rounded-lg border border-border/40 px-3 py-2 flex justify-between">
            <span className="text-foreground/50 font-mono text-xs">{s.key}</span>
            <span className="text-foreground/80 text-xs">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">MLM 손실 함수 계산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Masked Language Model (MLM)
//
// 목표: 마스킹된 토큰의 원본 예측
//
// 입력 예시:
//   원본: "The cat sat on the mat"
//   마스킹: "The [MASK] sat on the mat"
//
// BERT 출력 (각 위치):
//   logits_i = Linear(h_i)  # (seq_len, vocab_size)
//
// 손실 (마스킹 위치만):
//   L_MLM = -Σ_{i ∈ masked} log P(x_i | x_\\i)
//
//   여기서:
//     x_i = 원본 토큰
//     x_\\i = 마스킹된 문맥
//     P = softmax(logits_i)[x_i]
//
// 15% 마스킹 전략의 이유:
//   - 너무 적으면: 한 문장당 신호 적음, 학습 느림
//   - 너무 많으면: 문맥 깨짐, 예측 어려움
//   - 15%가 경험적 최적점 (실험으로 결정)
//
// 80/10/10 규칙:
//   80% → [MASK]로 교체
//   10% → 랜덤 토큰으로 교체 (noise)
//   10% → 원본 유지 (bias towards actual word)
//
// 왜 10% 랜덤 + 10% 원본?
//   - Fine-tuning 시 [MASK] 없음 (train/test mismatch)
//   - 모델이 모든 토큰에 대해 예측해야 함을 학습
//   - 원본 유지로 "실제 단어" 신호 추가`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">NSP와 MLM 조합</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Next Sentence Prediction (NSP)
//
// 목표: 두 문장이 연속되는지 이진 분류
//
// 입력 형식:
//   [CLS] Sentence A [SEP] Sentence B [SEP]
//
// 학습 데이터 구성:
//   50%: 실제로 연속된 문장 쌍 (IsNext = 1)
//   50%: 랜덤 문장 쌍 (NotNext = 0)
//
// 출력:
//   [CLS] 토큰의 최종 hidden state → Dense(2) → Softmax
//
// 손실:
//   L_NSP = -Σ log P(y | h_CLS)  (이진 크로스 엔트로피)
//
// 전체 손실:
//   L_total = L_MLM + L_NSP
//   (단순 합산, 가중치 동일)

// NSP의 효과:
//   - 문장 수준 관계 학습
//   - QA, NLI 등 문장 쌍 태스크에 유리
//   - 하지만 2019년 이후 효과 의문 제기
//
// RoBERTa (2019)의 발견:
//   - NSP 제거해도 성능 향상
//   - MLM만 사용, 더 큰 배치, 더 긴 학습
//   - ALBERT: NSP 대신 Sentence Order Prediction (SOP)
//
// 2019년 이후 트렌드:
//   - NSP 삭제
//   - 긴 시퀀스 사용 (512 고정)
//   - 동적 마스킹 (매 epoch 다르게)
//   - 더 많은 데이터 (160GB → 수 TB)

// BERT 학습 비용 (2018):
//   - TPU v3 Pod (64 chips): 4일
//   - 비용: ~$6,000
//   - 요즘 기준: 몇 시간이면 복제 가능`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>15% 마스킹 + 80/10/10 규칙</strong>이 MLM의 핵심 — train/test gap 최소화.<br />
          요약 2: <strong>NSP</strong>는 문장 관계 학습용이었으나 RoBERTa 이후 제거가 표준.<br />
          요약 3: L_total = L_MLM + L_NSP — 두 목적함수 단순 합산으로 공동 학습.
        </p>
      </div>
    </section>
  );
}
