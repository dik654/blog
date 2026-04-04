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
    </section>
  );
}
