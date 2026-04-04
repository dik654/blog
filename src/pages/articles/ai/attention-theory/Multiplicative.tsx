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
    </section>
  );
}
