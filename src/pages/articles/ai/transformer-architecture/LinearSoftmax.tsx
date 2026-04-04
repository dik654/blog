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
    </section>
  );
}
