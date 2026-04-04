import MaskedAttentionViz from './viz/MaskedAttentionViz';

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
    </section>
  );
}
