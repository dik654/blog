import MathText from '@/components/ui/math-text';
import LinearSoftmaxScene from './viz/LinearSoftmaxScene';
import LinearSoftmaxDetailScene from './viz/LinearSoftmaxDetailScene';
import M from '@/components/ui/math';

export default function LinearSoftmax() {
  return (
    <MathText id="linear-softmax" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">최종 출력 (Linear + Softmax)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          decoder의 마지막 벡터 $h$ 는 아직 모델 내부 차원이다<br />
          다음 token을 고르려면 vocabulary의 모든 후보에 점수 $z$ 를 줘야 한다<br />
          $hW_U$ 로 logit을 만들고 softmax로 다음 단어 확률 $p$ 를 만든다
        </p>
      </div>

      <LinearSoftmaxScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>학습 과정</h3>
        <div className="rounded-lg border p-3 text-sm space-y-2 mb-4">
          <div><strong>1.</strong> Linear: d_model(6) → vocab_size(11) — Logits 생성</div>
          <div><strong>2.</strong> Softmax → 확률 분포 (합=1)</div>
          <div><strong>3.</strong> argmax → 예측 단어 선택</div>
          <div><strong>4.</strong> Cross-Entropy Loss 계산 → 역전파</div>
        </div>
        <p>
          cross-entropy는 정답 token에 준 확률만 본다<br />
          p_target 이 작으면 -log p_target 이 크게 올라가고, 그 스칼라가 backward의 시작점이 된다
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Output Layer 최적화</h3>
        <M display>
          {`P(w_i) = \\underbrace{\\text{softmax}\\!\\left(\\frac{e^{z_i}}{\\sum_j e^{z_j}}\\right)}_{\\text{확률 분포}}, \\quad \\underbrace{\\mathcal{L} = -\\log P(w_{\\text{target}})}_{\\text{Cross-Entropy Loss}}`}
        </M>
      </div>
      <LinearSoftmaxDetailScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: 내부 벡터 $h$ 는 $W_U$ 를 지나 vocabulary logit $z$ 가 된다.<br />
          요약 2: softmax는 logit을 다음 token 확률 분포로 바꾼다.<br />
          요약 3: 학습은 -log p_target, 생성은 temperature/top-k/top-p가 분포를 조정한다.
        </p>
      </div>
    </MathText>
  );
}
