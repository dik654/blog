import M from '@/components/ui/math';
import MaskedAttentionViz from './viz/MaskedAttentionViz';
import MaskedAttnDetailViz from './viz/MaskedAttnDetailViz';

export default function MaskedAttention() {
  return (
    <section id="masked-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">마스크 어텐션 (디코더)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          디코더는 <strong>자기회귀(autoregressive)</strong> 방식으로 동작한다<br />
          "나는 학생 ___" — 빈칸을 채울 때 미래 단어를 보면 안 된다<br />
          상삼각 영역에 -∞를 넣어 미래 토큰을 차단한다
        </p>
      </div>

      <MaskedAttentionViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>마스크 적용 원리</h3>
        <div className="rounded-lg border p-3 text-sm space-y-2 mb-4">
          <div><strong>1.</strong> 스케일된 어텐션 스코어 계산 (Q×K<sup>T</sup>/√d_k)</div>
          <div><strong>2.</strong> 상삼각(미래 위치)에 -∞ 대입</div>
          <div><strong>3.</strong> Softmax 적용 → e<sup>-∞</sup> = 0</div>
        </div>
        <p>
          결과: 각 토큰은 자신과 이전 토큰만 참조 가능<br />
          인코더의 Self-Attention에는 마스크가 없다 — 양방향 참조
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Causal Mask 구현</h3>
        <p className="leading-7">
          상삼각에 -∞를 넣으면 softmax(exp(-∞)=0)가 미래 토큰의 가중치를 완전히 제거한다.
          GPT(Decoder-only)는 causal mask 필수, BERT(Encoder-only)는 양방향이므로 불필요.
          학습 시에는 mask + teacher forcing으로 전체 시퀀스를 병렬 학습하고,
          생성 시에는 autoregressive + KV cache로 속도를 최적화한다.
        </p>
        <M display>{'\\text{score}[i][j] = \\begin{cases} Q_i \\cdot K_j / \\sqrt{d_k} & \\text{if } j \\leq i \\;\\text{(과거+현재)} \\\\ \\underbrace{-\\infty}_{\\text{softmax} \\to 0} & \\text{if } j > i \\;\\text{(미래 차단)} \\end{cases}'}</M>
      </div>
      <div className="not-prose my-8"><MaskedAttnDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <strong>Lower-triangular mask</strong>로 미래 토큰 참조 차단.<br />
          요약 2: GPT는 <strong>causal mask 필수</strong>, BERT는 불필요 (양방향).<br />
          요약 3: 학습 시 <strong>병렬화</strong>, 추론 시 <strong>autoregressive</strong>.
        </p>
      </div>
    </section>
  );
}
