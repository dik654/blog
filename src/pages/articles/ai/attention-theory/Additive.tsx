import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import AdditiveAttnViz from './viz/AdditiveAttnViz';

const addCode = `Bahdanau (Additive) Attention:

1. 정렬 점수 (Alignment Score):
   e_ij = v^T * tanh(W_a * s_{i-1} + U_a * h_j)
   v, W_a, U_a: 학습 가능한 파라미터

2. 어텐션 가중치:
   a_ij = softmax_j(e_ij)
   = exp(e_ij) / Sum_k(exp(e_ik))

3. 컨텍스트 벡터:
   c_i = Sum_j(a_ij * h_j)
   디코더 입력에 concat: [y_{i-1}; c_i]`;

const annotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'MLP 기반 정렬 점수' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'Softmax 정규화' },
  { lines: [11, 13] as [number, number], color: 'amber' as const, note: '가중합 → 컨텍스트' },
];

export default function Additive() {
  return (
    <section id="additive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bahdanau (Additive) Attention</h2>
      <div className="not-prose mb-8"><AdditiveAttnViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Bahdanau Attention(2015) — 최초의 어텐션 메커니즘<br />
          디코더 상태 s + 인코더 히든 스테이트 h를 <strong>MLP(다층 퍼셉트론, 작은 신경망)</strong>에 통과 → 정렬 점수(alignment score) 계산<br />
          "Additive" = s와 h를 <strong>더한 뒤</strong> tanh 적용하기 때문
        </p>

        <CitationBlock source="Bahdanau et al., 2015" citeKey={2} type="paper"
          href="https://arxiv.org/abs/1409.0473">
          <p className="italic">"The decoder decides which parts of the source sentence to pay
          attention to. This frees the model from having to encode the whole source sentence
          into a fixed-length vector."</p>
        </CitationBlock>

        <CodePanel title="Bahdanau Attention 수식" code={addCode} annotations={annotations} />
      </div>
    </section>
  );
}
