import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import DotProductViz from './viz/DotProductViz';

const mulCode = `Luong Attention 변형 3가지:

1. Dot-Product:
   score(s_t, h_s) = s_t^T * h_s
   → 파라미터 없음, 가장 빠름, 같은 차원 필수

2. General (Bilinear):
   score(s_t, h_s) = s_t^T * W_a * h_s
   → 학습 행렬 W_a로 차원 간 관계 학습

3. Concat (= Bahdanau와 유사):
   score = v^T * tanh(W * [s_t; h_s])
   → MLP 기반, 가장 유연하지만 느림

Transformer의 Scaled Dot-Product:
   Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V`;

const annotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'Dot: 단순 내적' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'General: 가중치 학습' },
  { lines: [15, 16] as [number, number], color: 'amber' as const, note: 'Scaled: Transformer 표준' },
];

export default function Multiplicative() {
  return (
    <section id="multiplicative" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Luong & Scaled Dot-Product Attention</h2>
      <div className="not-prose mb-8"><DotProductViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Luong Attention(2015) — MLP 대신 <strong>내적(dot-product, 두 벡터를 곱해 합산하는 연산)</strong>으로 정렬 점수 계산<br />
          행렬 곱 한 번으로 배치 처리 가능 → Bahdanau 대비 연산 효율 대폭 향상<br />
          Transformer(2017) — 여기에 <strong>√d_k 스케일링</strong> 추가, 차원이 커져도 softmax 안정 동작
        </p>

        <CitationBlock source="Luong et al., 2015 — Effective Approaches to Attention-based NMT"
          citeKey={3} type="paper" href="https://arxiv.org/abs/1508.04025">
          <p className="italic">"We propose and compare various attention-based models:
          global attention which always attends to all source positions,
          and local attention that only looks at a subset."</p>
        </CitationBlock>

        <CodePanel title="Luong Attention 변형" code={mulCode} annotations={annotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">√d_k 스케일링이 필요한 이유</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Dot product의 분산 분석
//
// Q와 K의 각 원소가 독립 정규분포를 따른다고 가정:
//   Q_i ~ N(0, 1), K_i ~ N(0, 1)
//
// Dot product:
//   Q · K = Σ_{i=1}^{d_k} Q_i · K_i
//
// 평균:
//   E[Q · K] = Σ E[Q_i · K_i] = Σ 0 = 0
//
// 분산:
//   Var[Q · K] = Σ Var[Q_i · K_i] = Σ 1 = d_k
//
// → 차원 d_k가 커질수록 dot product 값의 분산이 커짐
// → |QK| 값이 매우 크거나 작은 경우 많아짐
//
// Softmax 포화 문제:
//   softmax([10, 1, 1])  = [0.9998, 0.0001, 0.0001]
//   softmax([1, 0.1, 0.1]) = [0.48, 0.26, 0.26]
//
//   값 차이가 클수록 softmax가 one-hot에 가까워짐
//   → gradient가 거의 0 (saturated)
//
// 해결책: sqrt(d_k)로 나누기
//   Var[Q·K / sqrt(d_k)] = d_k / d_k = 1
//   → 분산 1로 정규화
//   → softmax 안정 동작
//
// 예:
//   d_k=64  → sqrt(64) = 8
//   d_k=128 → sqrt(128) ≈ 11.3
//   d_k=512 → sqrt(512) ≈ 22.6

// Vaswani et al. 2017 논문 발췌:
//   "We suspect that for large values of d_k, the dot products
//    grow large in magnitude, pushing the softmax function into
//    regions where it has extremely small gradients."`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">세 가지 score 함수 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ┌──────────────┬──────────┬──────────┬──────────┐
// │   방식       │ 파라미터 │ 속도     │ 정확도   │
// ├──────────────┼──────────┼──────────┼──────────┤
// │ Dot-product  │ 없음     │ 매우빠름 │ 중간     │
// │ Scaled dot   │ 없음     │ 매우빠름 │ 높음     │
// │ General      │ W_a      │ 빠름     │ 높음     │
// │ Concat (Add) │ W, v     │ 느림     │ 높음     │
// └──────────────┴──────────┴──────────┴──────────┘
//
// 수식 비교:
//   Dot:     score = Q · K
//   Scaled:  score = Q · K / sqrt(d_k)
//   General: score = Q^T · W · K
//   Concat:  score = v^T · tanh(W · [Q; K])
//
// 실무 권장:
//   - Transformer 계열: Scaled dot-product (표준)
//   - 소규모 RNN: Additive (표현력)
//   - 큰 차원: Scaled dot (필수)
//   - 다른 차원 Q, K: General 또는 Additive

// Luong의 추가 기여:
//   1. Global vs Local Attention
//      - Global: 모든 소스 위치 참조 (표준)
//      - Local: 윈도우 내 위치만 참조 (효율)
//
//   2. Input-feeding approach
//      - 이전 context vector를 다음 디코더 입력에 concat
//      - 과거 attention 결정을 기억하게 함
//
// 현대 Transformer로의 계승:
//   Luong dot-product → Scaled dot-product (Transformer)
//   → Multi-head로 확장
//   → 행렬 연산으로 완전 병렬화`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>√d_k 스케일링</strong>은 dot product의 분산을 1로 정규화 — softmax 포화 방지.<br />
          요약 2: Dot-product 방식은 <strong>행렬 연산 한 번</strong>으로 완결 — Transformer의 핵심 효율성.<br />
          요약 3: Luong의 <strong>general·concat 변형</strong>이 Transformer의 multi-head로 확장됨.
        </p>
      </div>
    </section>
  );
}
