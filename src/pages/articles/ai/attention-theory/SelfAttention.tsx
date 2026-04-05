import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import SelfAttnViz from './viz/SelfAttnViz';

const selfCode = `Self-Attention & Multi-Head (Transformer):

1. Q, K, V 생성:
   Q = X * W_Q   (d_model → d_k)
   K = X * W_K   (d_model → d_k)
   V = X * W_V   (d_model → d_v)

2. Scaled Dot-Product Attention:
   Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V

3. Multi-Head:
   head_i = Attention(Q_i, K_i, V_i)
   MultiHead = Concat(head_0, ..., head_h) * W_O
   h=8, d_k = d_model / h = 64 (d_model=512)

4. Causal Mask (Decoder):
   mask[i][j] = -inf if j > i, else 0
   softmax(-inf) = 0 → 미래 토큰 차단`;

const annotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'Q/K/V 선형 변환' },
  { lines: [8, 9] as [number, number], color: 'emerald' as const, note: 'Scaled Dot-Product' },
  { lines: [11, 14] as [number, number], color: 'amber' as const, note: 'Multi-Head 병렬' },
];

export default function SelfAttention() {
  return (
    <section id="self-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Self-Attention & Multi-Head</h2>
      <div className="not-prose mb-8"><SelfAttnViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Self-Attention — 입력 시퀀스가 <strong>자기 자신에 대해</strong> 어텐션 수행<br />
          Q, K, V 모두 같은 입력 X에서 파생 → "Self"<br />
          Multi-Head — 여러 헤드가 <strong>서로 다른 표현 부분공간</strong>에서 병렬로 어텐션 학습, 더 풍부한 패턴 포착
        </p>

        <CitationBlock source="Vaswani et al., 2017 — Attention Is All You Need"
          citeKey={4} type="paper" href="https://arxiv.org/abs/1706.03762">
          <p className="italic">"Multi-head attention allows the model to jointly attend to information
          from different representation subspaces at different positions."</p>
        </CitationBlock>

        <CodePanel title="Self-Attention & Multi-Head 수식" code={selfCode} annotations={annotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Self-Attention 상세 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Self-Attention 계산 (BERT-base 기준)
//
// 입력: X ∈ R^{n × d_model}, d_model=768
//
// Step 1: Q, K, V 선형 투영 (공통 입력)
//   W_Q, W_K, W_V ∈ R^{d_model × d_k}   (d_k=64)
//
//   Q = X · W_Q   # (n, 64)
//   K = X · W_K   # (n, 64)
//   V = X · W_V   # (n, 64)
//
// Step 2: Attention matrix
//   scores = Q · K^T / sqrt(d_k)   # (n, n)
//   A = softmax(scores, axis=-1)    # (n, n)
//
// Step 3: Output
//   output = A · V                  # (n, 64)
//
// 복잡도:
//   - Time:  O(n² · d)
//   - Memory: O(n²) for attention matrix
//   - 긴 시퀀스(n=1024)에서 병목
//
// vs RNN:
//   RNN:  O(n · d²)  시간, 순차 처리
//   Self-Attn: O(n² · d) 시간, 완전 병렬
//
// 언제 Self-Attention이 이득?
//   n < d일 때 (일반적인 모델에서 흔함)

// Self vs Cross Attention:
//   Self: Q, K, V 모두 같은 입력 X에서 파생
//     → 시퀀스 내부 관계 학습
//   Cross: Q는 decoder, K, V는 encoder
//     → encoder-decoder 간 관계 학습

// Causal Masking (Decoder-only):
//   Lower triangular mask
//   mask[i][j] = 0 if j ≤ i else -∞
//   softmax(-∞) = 0
//   → 미래 토큰 참조 차단
//   → GPT 스타일 autoregressive 학습`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Head의 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Multi-Head Attention 상세 (h=12 heads)
//
// 각 헤드는 독립 파라미터:
//   W_Q^i, W_K^i, W_V^i  (i=1..12)
//
// 출력 투영:
//   W_O ∈ R^{h·d_v × d_model}
//
// 수식:
//   head_i = Attention(X·W_Q^i, X·W_K^i, X·W_V^i)
//   MultiHead(X) = Concat(head_1, ..., head_h) · W_O
//
// 각 헤드 차원:
//   d_k = d_model / h = 768/12 = 64
//
// 파라미터 수 (block 당):
//   h개 헤드 × 3 matrices × (d_model × d_k)
//   = 12 × 3 × (768 × 64)
//   = 1,769,472
//
//   W_O: 768 × 768 = 589,824
//   총: 2,359,296

// 왜 Multi-Head?
//
// 1. 다양한 관계 동시 학습
//    - Head 1: 구문 관계 (주어-동사)
//    - Head 2: 의미 관계 (유의어)
//    - Head 3: 위치 관계 (직전 토큰)
//    - Head 4: 공참조 (대명사-선행어)
//
// 2. 표현 공간 분산
//    - 단일 768차원 attention vs 12개 64차원
//    - 병렬 "관점" 확보
//
// 3. 노이즈 robustness
//    - 한 헤드 실패해도 다른 헤드 보완
//
// 4. 계산 효율
//    - 같은 파라미터 수, 병렬화 유리

// Head pruning 연구 (Voita 2019):
//   - 학습 후 일부 헤드 제거 가능
//   - 성능 거의 유지
//   - 특정 헤드가 과도하게 중요
//   - 학습 중 모든 헤드 필요, 추론 시 일부만 필수`}
        </pre>
        <p className="leading-7">
          요약 1: Self-Attention은 <strong>Q=K=V</strong>가 같은 입력에서 파생 — 시퀀스 내부 관계 학습.<br />
          요약 2: Multi-Head로 <strong>다양한 관계 유형</strong> 동시 학습 — 구문·의미·위치 패턴 분리.<br />
          요약 3: O(n²) 복잡도가 장단점 — 완전 병렬화 가능하나 긴 시퀀스에 부담.
        </p>
      </div>
    </section>
  );
}
