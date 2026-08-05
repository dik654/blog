import MathText from '@/components/ui/math-text';
import M from '@/components/ui/math';
import MaskedAttentionScene from './viz/MaskedAttentionScene';
import MaskedAttnDetailScene from './viz/MaskedAttnDetailScene';

export default function MaskedAttention() {
  return (
    <MathText id="masked-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">마스크 어텐션 (디코더)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          다음 단어를 맞히는 위치가 정답 미래 token을 볼 수 있으면 문제가 너무 쉬워진다<br />
          그래서 위치 $i$ 는 $j \\le i$ 만 보고, $j &gt; i$ 위치의 attention 점수는 $-\\infty$ 로 바꾼다<br />
          softmax 뒤 미래 위치 확률이 0이 되는 이 장치가 causal masked attention이다
        </p>
      </div>

      <MaskedAttentionScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>마스크 적용 원리</h3>
        <div className="rounded-lg border p-3 text-sm space-y-2 mb-4">
          <div><strong>1.</strong> 스케일된 어텐션 스코어 계산 (Q×K<sup>T</sup>/√d_k)</div>
          <div><strong>2.</strong> 상삼각(미래 위치)에 -∞ 대입</div>
          <div><strong>3.</strong> Softmax 적용 → e<sup>-∞</sup> = 0</div>
        </div>
        <p>
          결과: 각 token은 자신과 이전 token만 참조한다<br />
          encoder는 입력 전체가 이미 주어져 있으므로 이런 미래 차단이 필요 없다
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Causal Mask 구현</h3>
        <p className="leading-7">
          마스크는 softmax 전에 들어간다.
          확률을 만든 뒤 0으로 지우면 남은 확률을 다시 정규화해야 하지만, 점수 단계에서 $-\\infty$ 를 넣으면 softmax가 자동으로 0을 만든다.
          학습 때는 전체 target을 한 번에 넣되 mask로 누수를 막고, 생성 때는 이전 token들의 $K,V$ 를 cache에 저장한다.
        </p>
        <M display>{'\\text{score}[i][j] = \\begin{cases} Q_i \\cdot K_j / \\sqrt{d_k} & \\text{if } j \\leq i \\;\\text{(과거+현재)} \\\\ \\underbrace{-\\infty}_{\\text{softmax} \\to 0} & \\text{if } j > i \\;\\text{(미래 차단)} \\end{cases}'}</M>
      </div>
      <div className="not-prose my-8"><MaskedAttnDetailScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: 미래 위치는 score 단계에서 $-\\infty$ 로 바꾼다.<br />
          요약 2: GPT 계열 decoder-only 모델은 causal mask가 기본.<br />
          요약 3: 학습은 병렬로, 추론은 KV cache를 붙인 autoregressive 흐름으로 간다.
        </p>
      </div>
    </MathText>
  );
}
